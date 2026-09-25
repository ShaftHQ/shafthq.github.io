const assert = require('assert');
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const read = (relativePath) => fs.readFileSync(path.join(root, relativePath), 'utf8');

const snippets = JSON.parse(read('src/data/snippets.json'));
const commands = snippets.playwrightSetupCommands ?? '';
for (const required of [
  'setup status --profile PLAYWRIGHT --mode MANAGED',
  'setup plan',
  '--profile PLAYWRIGHT',
  '--mode MANAGED',
  'setup install',
  'setup verify --profile PLAYWRIGHT --mode MANAGED',
]) {
  assert(commands.includes(required), `The shared Playwright setup snippet must include ${required}.`);
}

const component = read('src/components/DocSnippets/index.tsx');
assert(component.includes('export function PlaywrightSetupCommands'),
  'DocSnippets must expose the recurring managed Playwright command sequence.');

// The guide is split by Diátaxis page type (#1079); the contract covers the whole set.
const infrastructure = [
  'docs/start/local-infrastructure.mdx',
  'docs/start/local-infrastructure/mobile.mdx',
  'docs/start/local-infrastructure/services.mdx',
  'docs/start/local-infrastructure/previews.mdx',
  'docs/start/local-infrastructure/reference.mdx',
].map(read).join('\n');
assert(infrastructure.includes('<PlaywrightSetupCommands />'),
  'The canonical infrastructure guide must render the shared Playwright command sequence.');
for (const fact of [
  'Playwright Java 1.62.0',
  'Chromium revision 1234',
  'Firefox revision 1538',
  'WebKit revision 2336',
  'Ubuntu 24.04 x64',
  'never runs `install-deps`',
  '`PLAYWRIGHT_BROWSERS_PATH` wins',
]) {
  assert(infrastructure.includes(fact), `The infrastructure guide must document ${fact}.`);
}

const backend = read('docs/reference/actions/GUI/Playwright_Backend.md');
assert(backend.includes('/docs/start/local-infrastructure/services#install-managed-playwright-browsers'),
  'The Playwright backend must link to its canonical managed setup flow.');

console.log('Managed Playwright infrastructure documentation contract checks passed.');
