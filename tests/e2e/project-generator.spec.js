const {expect, test} = require('@playwright/test');

async function useBundledOptions(page, delay = 0) {
  await page.route('https://api.github.com/**', async route => {
    if (delay) await new Promise(resolve => setTimeout(resolve, delay));
    await route.fulfill({status: 503, body: 'Unavailable'});
  });
}

async function chooseWebProject(page) {
  await page.getByLabel('TestNG').click();
  await page.getByRole('button', {name: 'Next'}).click();
  await page.getByLabel('Web').click();
  await page.getByRole('button', {name: 'Next'}).click();
}

test('generator announces progress, moves focus, and reflows at 320 CSS pixels', async ({page}) => {
  await page.emulateMedia({reducedMotion: 'reduce'});
  await page.setViewportSize({width: 320, height: 800});
  await useBundledOptions(page);
  await page.goto('/project-generator');

  await expect(page.getByRole('heading', {name: 'Which test runner do you want to use?'})).not.toBeFocused();
  const progress = page.getByRole('progressbar', {name: 'Project setup progress'});
  await expect(progress).toHaveAttribute('aria-valuenow', '1');
  await expect(progress).toContainText('Step 1 of 6');
  await chooseWebProject(page);
  await expect(progress).toHaveAttribute('aria-valuenow', '3');
  await expect(page.getByRole('heading', {name: 'What would you like to name your new project?'})).toBeFocused();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth + 1)).toBe(true);
});

test('generator exposes a layout-matched loading status', async ({page}) => {
  await useBundledOptions(page, 500);
  await page.goto('/project-generator');

  await expect(page.getByRole('status', {name: 'Loading project options'})).toBeVisible();
  await expect(page.getByTestId('project-options-skeleton').locator('span')).toHaveCount(3);
  await expect(page.getByLabel('TestNG')).toBeVisible();
});

test('generator loading stays within the CLS good threshold', async ({page, browserName}) => {
  test.skip(browserName !== 'chromium', 'Layout Instability API proof runs in Chromium.');
  await page.addInitScript(() => {
    const score = {current: 0, max: 0, startedAt: 0, lastAt: 0};
    window.__layoutShiftScore = score;
    new PerformanceObserver(list => {
      for (const entry of list.getEntries()) {
        if (entry.hadRecentInput) continue;
        if (!score.startedAt || entry.startTime - score.lastAt > 1000 || entry.startTime - score.startedAt > 5000) {
          score.current = 0;
          score.startedAt = entry.startTime;
        }
        score.current += entry.value;
        score.max = Math.max(score.max, score.current);
        score.lastAt = entry.startTime;
      }
    }).observe({type: 'layout-shift', buffered: true});
  });
  await useBundledOptions(page, 500);
  await page.goto('/project-generator');
  await expect(page.getByLabel('TestNG')).toBeVisible();

  expect(await page.evaluate(() => window.__layoutShiftScore.max)).toBeLessThanOrEqual(0.1);
});

test('generation failure renders an inline alert with retry and back actions', async ({page}) => {
  await useBundledOptions(page);
  await page.goto('/project-generator');
  await chooseWebProject(page);
  await page.getByRole('button', {name: 'Next'}).click();
  await page.getByRole('button', {name: 'Next'}).click();
  await page.getByRole('button', {name: 'Next'}).click();
  await page.evaluate(() => {
    window.JSZip = class {
      file() { throw new Error('test failure'); }
    };
  });
  await page.getByRole('button', {name: 'Generate Project'}).click();

  const alert = page.getByRole('alert');
  await expect(alert).toContainText('We could not generate your project');
  await expect(alert).toBeFocused();
  await expect(alert.getByRole('button', {name: 'Retry'})).toBeVisible();
  await alert.getByRole('button', {name: 'Back'}).click();
  await expect(page.getByRole('heading', {name: /GitHub Actions workflow/})).toBeFocused();
});
