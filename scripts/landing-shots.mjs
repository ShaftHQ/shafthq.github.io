import {chromium} from '@playwright/test';

const outDir = process.argv[2] ?? 'test-screenshots';
const base = 'http://127.0.0.1:3000';

const shots = [
  {name: 'landing-desktop-light', width: 1440, height: 900, scheme: 'light', full: true},
  {name: 'landing-desktop-dark', width: 1440, height: 900, scheme: 'dark', full: true},
  {name: 'landing-mobile-light', width: 375, height: 844, scheme: 'light', full: true},
];

const browser = await chromium.launch();
for (const shot of shots) {
  const context = await browser.newContext({
    viewport: {width: shot.width, height: shot.height},
    colorScheme: shot.scheme,
    reducedMotion: 'reduce',
  });
  const page = await context.newPage();
  await page.addInitScript((theme) => window.localStorage.setItem('theme', theme), shot.scheme);
  await page.goto(base, {waitUntil: 'networkidle'});
  await page.waitForTimeout(600);
  await page.screenshot({path: `${outDir}/${shot.name}.png`, fullPage: shot.full});
  await context.close();
  console.log(`captured ${shot.name}`);
}
await browser.close();
