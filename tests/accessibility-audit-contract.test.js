const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');

const repoRoot = path.join(__dirname, '..');
const packageJson = require(path.join(repoRoot, 'package.json'));
const agents = fs.readFileSync(path.join(repoRoot, 'AGENTS.md'), 'utf8');
const contributing = fs.readFileSync(path.join(repoRoot, 'CONTRIBUTING.md'), 'utf8');
const siteOperations = fs.readFileSync(
  path.join(repoRoot, 'docs', 'maintainers', 'site-operations.md'),
  'utf8',
);
const prBuild = fs.readFileSync(
  path.join(repoRoot, '.github', 'workflows', 'pr-build.yml'),
  'utf8',
);
const accessibilityAudit = fs.readFileSync(
  path.join(repoRoot, 'tests', 'e2e', 'accessibility.spec.js'),
  'utf8',
);

assert.strictEqual(
  packageJson.devDependencies['@playwright/test'],
  '1.65.1',
  'Playwright Test must be exact so its managed Chromium revision is reproducible.',
);
assert.strictEqual(
  packageJson.devDependencies['@axe-core/playwright'],
  '4.14.0',
  'The Playwright axe adapter must be exact so local and CI audits use the same rules.',
);
assert.strictEqual(
  packageJson.scripts['test:a11y'],
  'playwright test tests/e2e/accessibility.spec.js --project=chromium',
  'The repository must expose one focused accessibility-audit command.',
);
assert.ok(
  !fs.existsSync(path.join(repoRoot, '.mcp.json')),
  'The unsupported a11ymcp browser lifecycle must not remain configured.',
);

for (const [name, contents] of [
  ['AGENTS.md', agents],
  ['CONTRIBUTING.md', contributing],
  ['docs/maintainers/site-operations.md', siteOperations],
]) {
  assert.match(contents, /yarn test:a11y/, `${name} must document the canonical audit command.`);
  assert.doesNotMatch(contents, /a11ymcp|a11y-mcp-server/, `${name} must not direct contributors to the retired MCP path.`);
}

for (const [name, contents] of [
  ['CONTRIBUTING.md', contributing],
  ['docs/maintainers/site-operations.md', siteOperations],
]) {
  assert.match(contents, /Yarn 1\.22\.22/, `${name} must state the repository's supported Yarn version.`);
  assert.match(
    contents,
    /yarn install[\s\S]*yarn playwright install chromium/,
    `${name} must include the one-time Chromium install after dependency installation.`,
  );
}

assert.match(
  prBuild,
  /^\s+run: yarn playwright install --with-deps chromium firefox webkit$/m,
  'The PR gate must install Playwright\'s version-matched browsers and Linux dependencies.',
);
assert.match(
  prBuild,
  /^\s+run: yarn test:a11y$/m,
  'The PR gate must run the canonical accessibility audit.',
);
assert.match(
  accessibilityAudit,
  /test\.beforeEach[\s\S]*page\.emulateMedia\(\{reducedMotion: 'reduce'\}\)/,
  'The audit must disable reveal animations so axe scans a stable rendered state.',
);

console.log('Accessibility audit contract checks passed.');

(async () => {
  const { pathToFileURL } = require('node:url');
  const { extractThemeStorageKeys } = await import(
    pathToFileURL(path.join(repoRoot, 'scripts', 'a11y-sitewide.mjs')).href,
  );
  const snippet = '<script>window.localStorage.getItem("theme-d4e")</script>';
  assert.deepStrictEqual(extractThemeStorageKeys(snippet), ['theme', 'theme-d4e']);
  assert.deepStrictEqual(extractThemeStorageKeys("no theme key here"), ['theme']);
  assert.deepStrictEqual(extractThemeStorageKeys(null), ['theme']);
  assert.deepStrictEqual(extractThemeStorageKeys(42), ['theme']);
  assert.deepStrictEqual(extractThemeStorageKeys(undefined), ['theme']);
  assert.deepStrictEqual(extractThemeStorageKeys(''), ['theme']);
  assert.deepStrictEqual(
    extractThemeStorageKeys("localStorage.getItem('theme-abc')"),
    ['theme', 'theme-abc'],
  );
  assert.deepStrictEqual(
    extractThemeStorageKeys('localStorage.getItem("theme")'),
    ['theme'],
  );
  assert.deepStrictEqual(
    extractThemeStorageKeys('localStorage.getItem("nottheme")'),
    ['theme'],
  );
  console.log('extractThemeStorageKeys checks passed.');
})();
