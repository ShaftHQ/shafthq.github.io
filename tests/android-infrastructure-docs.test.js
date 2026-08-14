const assert = require('assert');
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const read = (relativePath) => fs.readFileSync(path.join(root, relativePath), 'utf8');

const snippets = JSON.parse(read('src/data/snippets.json'));
const commands = snippets.androidSetupCommands ?? '';
for (const required of [
  'setup status --profile MOBILE_ANDROID --mode MANAGED',
  'setup plan',
  '--profile MOBILE_ANDROID',
  '--mode MANAGED',
  'setup install',
  '--accept-license android-sdk-license',
  'setup verify --profile MOBILE_ANDROID --mode MANAGED',
  'setup start',
  'setup logs',
  'setup stop',
]) {
  assert(commands.includes(required), `The shared Android setup snippet must include ${required}.`);
}

const component = read('src/components/DocSnippets/index.tsx');
assert(component.includes('export function AndroidSetupCommands'),
  'DocSnippets must expose the recurring managed Android command sequence.');

const infrastructure = read('docs/start/local-infrastructure.mdx');
assert(infrastructure.includes('<AndroidSetupCommands />'),
  'The canonical infrastructure guide must render the shared Android command sequence.');
for (const heading of [
  '## Install managed Android and Appium',
  '### Check platform prerequisites',
  '### Use the cache and offline mode',
  '### Start, inspect, and recover the owned runtime',
  '### Use the typed Java API',
]) {
  assert(infrastructure.includes(heading), `The infrastructure guide is missing "${heading}".`);
}
for (const fact of [
  'Node 24.19.0',
  'Appium 3.6.0',
  'Inspector plugin 2026.7.1',
  'UiAutomator2 8.2.2',
  'build-tools 36.0.0',
  'aapt2',
  'emulator -accel-check',
  'android-sdk-license',
  'AndroidSetupRequest',
]) {
  assert(infrastructure.includes(fact), `The infrastructure guide must document ${fact}.`);
}
assert(!/other profiles are cataloged[\s\S]*currently return\s+unsupported/i.test(infrastructure),
  'Current guidance must not describe MOBILE_ANDROID as catalog-only.');

const mobile = read('docs/testing/mobile.md');
const normalizedMobile = mobile.replace(/\s+/g, ' ');
for (const fact of [
  'compatible managed setup receipt',
  'does not install missing tools',
  'explicit remote execution address',
  'shared infrastructure provider and owned lifecycle',
]) {
  assert(normalizedMobile.includes(fact), `The mobile guide must explain that ${fact}.`);
}
assert(!/after confirmation, install the user-cache Android command-line tools/i.test(mobile),
  'MCP guidance must not describe the retired duplicate Android installer.');

console.log('Managed Android infrastructure documentation contract checks passed.');
