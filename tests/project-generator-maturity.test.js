const assert = require('node:assert');
const fs = require('node:fs');

const playwrightConfig = fs.readFileSync('playwright.config.js', 'utf8');
const workflow = fs.readFileSync('.github/workflows/pr-build.yml', 'utf8');
const generatorCss = fs.readFileSync('src/pages/project-generator.module.css', 'utf8');
const generatorPage = fs.readFileSync('src/pages/project-generator.tsx', 'utf8');
const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));

assert.match(playwrightConfig, /name: 'firefox'/, 'Playwright must cover Firefox.');
assert.match(playwrightConfig, /name: 'webkit'/, 'Playwright must cover WebKit.');
assert.match(workflow, /playwright install --with-deps chromium firefox webkit/, 'CI must install all smoke-test browsers.');
assert.match(workflow, /yarn test:project-generator:cross-browser/, 'CI must run the generator smoke test across browsers.');
assert.equal(
  packageJson.scripts['test:web-budgets'],
  'node scripts/check-web-budgets.mjs',
  'The production build must have a repeatable gzip budget check.',
);
assert.doesNotMatch(generatorCss, /animation:\s*spin/, 'Loading feedback must not use perpetual motion.');
assert.match(generatorCss, /\.moduleOption label[\s\S]*min-height:\s*44px/, 'Module labels must provide a 44px target.');
assert.match(generatorPage, /inert=\{generating/, 'Generation must suspend the underlying wizard.');
assert.equal(packageJson.scripts['test:playwright'], 'npx playwright test --project=chromium');

console.log('Project generator maturity contract passed.');
