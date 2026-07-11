import {chromium} from '@playwright/test';

const outDir = process.argv[2] ?? 'test-screenshots';
const base = 'http://127.0.0.1:3000';

const targets = [
  ['[data-testid="landing-hero"]', 'zoom-hero'],
  ['[data-testid="landing-code-proof"]', 'zoom-code-proof'],
  ['[data-testid="landing-evidence-loop"]', 'zoom-evidence-loop'],
  ['[data-testid="landing-surface-matrix"]', 'zoom-matrix'],
  ['[data-testid="landing-allure-evidence"]', 'zoom-allure'],
];

const browser = await chromium.launch();
const context = await browser.newContext({
  viewport: {width: 1440, height: 900},
  colorScheme: 'light',
  reducedMotion: 'reduce',
});
const page = await context.newPage();
await page.goto(base, {waitUntil: 'networkidle'});
await page.waitForTimeout(600);
for (const [selector, name] of targets) {
  await page.locator(selector).scrollIntoViewIfNeeded();
  await page.waitForTimeout(250);
  await page.locator(selector).screenshot({path: `${outDir}/${name}.png`});
  console.log(`captured ${name}`);
}
await context.close();
await browser.close();
