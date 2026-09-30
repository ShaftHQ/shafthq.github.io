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

function compareSemver(left, right) {
  const a = left.split('.').map((part) => Number(part));
  const b = right.split('.').map((part) => Number(part));
  const width = Math.max(a.length, b.length);
  for (let index = 0; index < width; index += 1) {
    const delta = (a[index] || 0) - (b[index] || 0);
    if (delta !== 0) {
      return delta;
    }
  }
  return 0;
}

function lockedPackages(lockText, name) {
  const entries = [];
  const blocks = lockText.split(/\n(?=\S)/);
  for (const block of blocks) {
    const header = block.slice(0, block.indexOf('\n') === -1 ? block.length : block.indexOf('\n'));
    const requests = header.split(',').map((part) => part.trim().replace(/^"|"$/g, ''));
    if (!requests.some((request) => request === name || request.startsWith(`${name}@`))) {
      continue;
    }
    const version = block.match(/\n  version "([^"]+)"/);
    assert.ok(version, `yarn.lock entry for ${name} must record an installed version`);
    entries.push({ requests, version: version[1] });
  }
  assert.ok(entries.length > 0, `yarn.lock must install ${name}`);
  return entries;
}

const lockText = fs.readFileSync(path.join(repoRoot, 'yarn.lock'), 'utf8');
const packageJson = JSON.parse(fs.readFileSync(path.join(repoRoot, 'package.json'), 'utf8'));
const qsFloor = '6.16.0';
for (const pin of [packageJson.resolutions.qs, packageJson.overrides.qs]) {
  const floor = String(pin).replace(/^[^\d]*/, '');
  assert.ok(
    compareSemver(floor, qsFloor) >= 0,
    `qs pin ${pin} must be at least ${qsFloor}`,
  );
}
for (const entry of lockedPackages(lockText, 'qs')) {
  assert.ok(
    compareSemver(entry.version, qsFloor) >= 0,
    `installed qs ${entry.version} (${entry.requests.join(', ')}) must be >= ${qsFloor}`,
  );
  console.log(`qs ${entry.version} >= ${qsFloor}`);
}
for (const entry of lockedPackages(lockText, 'postcss-selector-parser')) {
  const major = Number(entry.version.split('.')[0]);
  const floor = major === 6 ? '6.1.3' : major === 7 ? '7.1.3' : null;
  assert.ok(floor, `unexpected postcss-selector-parser major in ${entry.version}`);
  assert.ok(
    compareSemver(entry.version, floor) >= 0,
    `installed postcss-selector-parser ${entry.version} (${entry.requests.join(', ')}) must be >= ${floor}`,
  );
  console.log(`postcss-selector-parser ${entry.version} >= ${floor}`);
}

console.log('Security regression checks passed.');
