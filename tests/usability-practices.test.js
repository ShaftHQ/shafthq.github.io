import {readFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const note = readFileSync(new URL('../docs/maintainers/usability-practices.md', import.meta.url), 'utf8');
const generator = readFileSync(new URL('../scripts/build-llms-txt.mjs', import.meta.url), 'utf8');
const orientation = readFileSync(new URL('../src/theme/DocItem/Content/index.tsx', import.meta.url), 'utf8');

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function section(title) {
  const start = note.indexOf(title);
  assert(start >= 0, `missing ${title}`);
  const rest = note.slice(start + title.length);
  const next = rest.search(/\n## /);
  return next === -1 ? rest : rest.slice(0, next);
}

for (const heading of ['## Human practices', '## Agent practices']) {
  const body = section(heading);
  const items = [...body.matchAll(/^\d+\. \*\*[^*]+\*\*/gm)];
  assert(items.length === 10, `${heading} has ${items.length} practices`);
  const links = [...body.matchAll(/https?:\/\/[^\s)]+/g)].map((match) => match[0]);
  assert(links.length >= 10, `${heading} has ${links.length} source URLs`);
}

assert(generator.includes('static/llms.txt'), 'generator writes llms.txt');
assert(generator.includes('markdownUrl'), 'generator links Markdown pages');
assert(orientation.includes('/llms.txt'), 'pages point at llms.txt');
assert(orientation.includes('doc-orientation'), 'pages state who the guide is for');
assert(readFileSync(`${root}/docs/reference/reporting.mdx`, 'utf8').includes('className="fact-list"'), 'reporting properties are a definition list');
assert(!readFileSync(`${root}/docs/start/upgrade/run.mdx`, 'utf8').includes('### Missing-provider troubleshooting\n\n|'), 'troubleshooting table was restructured');

console.log('usability-practices.test.js passed');
