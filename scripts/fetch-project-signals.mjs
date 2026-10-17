// Resolves the landing page's build-time project signals (#1128, #1130 review).
// Sources: Maven Central metadata (release version) and the public GitHub REST
// API (stargazers_count). Every value is validated here; a failed request or a
// bad reply keeps the committed value, so the build never breaks and the page
// never shows an invented number.
//
// The committed src/data/project-signals.json is only rewritten in CI (CI=true)
// and only when a valid value changed, so a local `yarn build` never dirties git.
import {readFile, writeFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';

export const VERSION_PATTERN = /^\d+\.\d+\.\d{8}$/;
const MAVEN_METADATA = 'https://repo1.maven.org/maven2/io/github/shafthq/shaft-engine/maven-metadata.xml';
const GITHUB_REPO = 'https://api.github.com/repos/ShaftHQ/SHAFT_ENGINE';
const TIMEOUT_MS = 8000;

export const validVersion = (value) => typeof value === 'string' && VERSION_PATTERN.test(value);
export const validStars = (value) => Number.isSafeInteger(value) && value > 0;
export const validJava = (value) => typeof value === 'string' && /^\d+$/.test(value);
const valid = (signals) => validVersion(signals.engineVersion) && validJava(signals.javaVersion) && validStars(signals.stars);

async function get(fetchImpl, url, headers = {}) {
  const response = await fetchImpl(url, {headers: {'User-Agent': 'shafthq.github.io-build', ...headers}, signal: AbortSignal.timeout(TIMEOUT_MS)});
  if (!response.ok) {
    const error = new Error(`${url} returned ${response.status}`);
    error.status = response.status;
    throw error;
  }
  return response.text();
}

async function fetchVersion(fetchImpl) {
  const version = (await get(fetchImpl, MAVEN_METADATA)).match(/<release>([^<]*)<\/release>/)?.[1];
  if (!validVersion(version)) throw new Error(`rejected release "${version ?? ''}"`);
  return version;
}

async function fetchStars(fetchImpl, token) {
  const accept = {Accept: 'application/vnd.github+json'};
  let body;
  try {
    body = await get(fetchImpl, GITHUB_REPO, token ? {...accept, Authorization: `Bearer ${token}`} : accept);
  } catch (error) {
    if (!(token && error.status === 401)) throw error;
    body = await get(fetchImpl, GITHUB_REPO, accept); // A rejected token: retry anonymously once.
  }
  const stars = JSON.parse(body).stargazers_count;
  if (!validStars(stars)) throw new Error(`rejected stargazers_count ${String(stars)}`);
  return stars;
}

export async function resolveSignals({fetchImpl = fetch, current, javaVersion, token, log = console.warn}) {
  const [version, stars] = await Promise.allSettled([fetchVersion(fetchImpl), fetchStars(fetchImpl, token)]);
  const signals = {
    engineVersion: version.status === 'fulfilled' ? version.value : current.engineVersion,
    javaVersion: validJava(javaVersion) ? javaVersion : current.javaVersion,
    stars: stars.status === 'fulfilled' ? stars.value : current.stars,
  };
  if (version.status === 'rejected') log(`project-signals: kept engineVersion ${current.engineVersion} (${version.reason.message})`);
  if (stars.status === 'rejected') log(`project-signals: kept stars ${current.stars} (${stars.reason.message})`);
  if (!validJava(javaVersion)) log(`project-signals: kept javaVersion ${current.javaVersion} (releases.json has "${javaVersion ?? ''}")`);
  return {signals};
}

export function shouldWrite({env, current, next}) {
  return env.CI === 'true' && valid(next) && JSON.stringify(next) !== JSON.stringify(current);
}

async function main() {
  const target = fileURLToPath(new URL('../src/data/project-signals.json', import.meta.url));
  const releases = JSON.parse(await readFile(fileURLToPath(new URL('../src/data/releases.json', import.meta.url)), 'utf8'));
  const current = JSON.parse(await readFile(target, 'utf8'));
  const {signals} = await resolveSignals({current, javaVersion: releases.javaVersion, token: process.env.GITHUB_TOKEN});
  if (shouldWrite({env: process.env, current, next: signals})) await writeFile(target, `${JSON.stringify(signals, null, 2)}\n`);
  else if (JSON.stringify(signals) !== JSON.stringify(current)) console.log('project-signals: newer values found; the committed file is only rewritten in CI.');
  console.log(`project-signals: SHAFT ${signals.engineVersion}, Java ${signals.javaVersion}, ${signals.stars} stars`);
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) await main();
