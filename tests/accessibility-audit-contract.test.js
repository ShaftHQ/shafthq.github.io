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

assert.strictEqual(
  packageJson.devDependencies['@playwright/test'],
  '1.62.1',
  'Playwright Test must be exact so its managed Chromium revision is reproducible.',
);
assert.strictEqual(
  packageJson.devDependencies['@axe-core/playwright'],
  '4.13.0',
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
  /^\s+run: yarn playwright install --with-deps chromium$/m,
  'The PR gate must install Playwright\'s version-matched Chromium and Linux dependencies.',
);
assert.match(
  prBuild,
  /^\s+run: yarn test:a11y$/m,
  'The PR gate must run the canonical accessibility audit.',
);

console.log('Accessibility audit contract checks passed.');
