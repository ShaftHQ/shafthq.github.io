// #1130 review: the build-time project signals are validated inside the
// fetch script. A bad reply keeps the committed value; it never reaches the page.
import assert from 'node:assert/strict';
import {resolveSignals, shouldWrite, VERSION_PATTERN} from '../scripts/fetch-project-signals.mjs';

const current = {engineVersion: '10.4.20261013', javaVersion: '25', stars: 414};
const metadata = (release) => `<metadata><versioning><release>${release}</release></versioning></metadata>`;
const reply = (status, body) => ({ok: status >= 200 && status < 300, status, text: async () => (typeof body === 'string' ? body : JSON.stringify(body))});

function mockFetch({maven, github, githubAnonymous}) {
  const calls = [];
  const impl = async (url, init = {}) => {
    calls.push({url, headers: init.headers ?? {}});
    if (url.includes('repo1.maven.org')) return typeof maven === 'function' ? maven() : maven;
    if (url.includes('api.github.com')) {
      const authed = Boolean(init.headers?.Authorization);
      const value = authed || githubAnonymous === undefined ? github : githubAnonymous;
      return typeof value === 'function' ? value() : value;
    }
    throw new Error(`unexpected ${url}`);
  };
  return {impl, calls};
}

async function run(options, extra = {}) {
  const {impl, calls} = mockFetch(options);
  const result = await resolveSignals({fetchImpl: impl, current, javaVersion: '25', token: extra.token, log: () => {}, ...extra});
  return {...result, calls};
}

// Good replies are applied.
{
  const {signals} = await run({maven: reply(200, metadata('10.4.20261101')), github: reply(200, {stargazers_count: 420})});
  assert.deepEqual(signals, {engineVersion: '10.4.20261101', javaVersion: '25', stars: 420});
}

// Bad versions keep the committed value.
for (const bad of ['10.4.0-SNAPSHOT', '10.4', '10.4.2026101', 'latest', '10.4.20261013-rc1', '']) {
  const {signals} = await run({maven: reply(200, metadata(bad)), github: reply(200, {stargazers_count: 420})});
  assert.equal(signals.engineVersion, current.engineVersion, `version "${bad}" must be rejected`);
  assert.equal(VERSION_PATTERN.test(bad), false);
}
{
  const {signals} = await run({maven: reply(200, '<html>maintenance</html>'), github: reply(200, {stargazers_count: 420})});
  assert.equal(signals.engineVersion, current.engineVersion, 'a reply without <release> must be rejected');
}

// Bad star totals keep the committed value.
for (const bad of [0, -3, 3.5, '414', null, undefined, Number.NaN, 1e309]) {
  const {signals} = await run({maven: reply(200, metadata('10.4.20261101')), github: reply(200, {stargazers_count: bad})});
  assert.equal(signals.stars, current.stars, `stars ${String(bad)} must be rejected`);
}
{
  const {signals} = await run({maven: reply(200, metadata('10.4.20261101')), github: reply(200, 'not json')});
  assert.equal(signals.stars, current.stars, 'a non-JSON GitHub reply must be rejected');
}

// Failures and timeouts keep both committed values.
{
  const {signals} = await run({maven: () => { throw new Error('offline'); }, github: reply(503, 'busy')});
  assert.deepEqual(signals, current);
}

// A rejected token (401) is retried once without the auth header.
{
  const {signals, calls} = await run({maven: reply(200, metadata('10.4.20261101')), github: reply(401, {message: 'Bad credentials'}), githubAnonymous: reply(200, {stargazers_count: 431})}, {token: 'ghs_test'});
  const githubCalls = calls.filter((call) => call.url.includes('api.github.com'));
  assert.equal(githubCalls.length, 2);
  assert.equal(githubCalls[0].headers.Authorization, 'Bearer ghs_test');
  assert.equal(githubCalls[1].headers.Authorization, undefined);
  assert.equal(signals.stars, 431);
}
{
  const {calls} = await run({maven: reply(200, metadata('10.4.20261101')), github: reply(200, {stargazers_count: 431})});
  assert.equal(calls.find((call) => call.url.includes('api.github.com')).headers.Authorization, undefined, 'no token, no auth header');
}

// Both requests start together (Promise.allSettled), not one after the other.
{
  let releaseMaven;
  const started = [];
  const impl = (url) => {
    started.push(url.includes('maven') ? 'maven' : 'github');
    if (url.includes('maven')) return new Promise((resolve) => { releaseMaven = () => resolve(reply(200, metadata('10.4.20261101'))); });
    return Promise.resolve(reply(200, {stargazers_count: 420}));
  };
  const pending = resolveSignals({fetchImpl: impl, current, javaVersion: '25', log: () => {}});
  await new Promise((resolve) => setImmediate(resolve));
  assert.deepEqual(started.sort(), ['github', 'maven'], 'GitHub must not wait for Maven Central');
  releaseMaven();
  await pending;
}

// A missing or malformed Java baseline keeps the committed one (no "Java undefined").
for (const javaVersion of [undefined, '', 'twenty-five', null]) {
  const {impl} = mockFetch({maven: reply(200, metadata('10.4.20261101')), github: reply(200, {stargazers_count: 420})});
  const {signals} = await resolveSignals({fetchImpl: impl, current, javaVersion, log: () => {}});
  assert.equal(signals.javaVersion, '25', `javaVersion ${String(javaVersion)} must fall back`);
}

// A local build never dirties the tracked file; CI writes only valid, changed values.
const next = {...current, stars: 420};
assert.equal(shouldWrite({env: {}, current, next}), false, 'local build must not write');
assert.equal(shouldWrite({env: {CI: 'true'}, current, next: {...current}}), false, 'unchanged values are not written');
assert.equal(shouldWrite({env: {CI: 'true'}, current, next}), true);
assert.equal(shouldWrite({env: {CI: 'true'}, current, next: {...next, stars: 0}}), false, 'invalid values are never written');

console.log('project-signals tests passed');
