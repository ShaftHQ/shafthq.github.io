const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');

const repoRoot = path.join(__dirname, '..');
const runner = fs.readFileSync(path.join(repoRoot, 'scripts', 'run-shaft-tests.mjs'), 'utf8');
const homepage = fs.readFileSync(path.join(repoRoot, 'tests', 'e2e', 'homepage.spec.js'), 'utf8');
const prBuild = fs.readFileSync(path.join(repoRoot, '.github', 'workflows', 'pr-build.yml'), 'utf8');

assert.match(
  runner,
  /from 'cross-spawn'/,
  'SHAFT test commands must use cross-spawn so Windows .cmd launchers receive literal argument arrays.',
);
assert.doesNotMatch(
  runner,
  /node:child_process|cmd\.exe/,
  'SHAFT test commands must not forward environment-derived arguments through a command shell.',
);
assert.strictEqual(
  (runner.match(/shell: false/g) ?? []).length,
  2,
  'Both the server and Maven command must explicitly disable shell interpretation.',
);
assert.match(
  runner,
  /'-Dallure\.automaticallyOpen=false'/,
  'Headless Maven verification must explicitly prevent Allure from opening a GUI.',
);
assert.ok(
  homepage.includes('/^https:\\/\\/join\\.slack\\.com\\/t\\/shaft-engine\\/.+$/'),
  'The Slack CTA assertion must anchor both ends of the trusted invite URL.',
);
assert.match(
  prBuild,
  /^permissions:\r?\n {2}contents: read$/m,
  'The PR build workflow must explicitly grant only read access to repository contents.',
);
assert.match(
  prBuild,
  /^\s+run: yarn test:security$/m,
  'The PR build must run the security regression before building the site.',
);
assert.match(
  prBuild,
  /^ {6}- name: Homepage contract\r?\n {8}run: yarn test:homepage$/m,
  'The PR build must run the homepage contract unconditionally before building the site.',
);

console.log('Security regression checks passed.');
