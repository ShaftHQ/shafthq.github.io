const {expect, test} = require('@playwright/test');

test('whats-new map nodes navigate to catalog sections', async ({page}) => {
  await page.goto('/docs/features/whats-new');
  const map = page.getByRole('navigation', {name: "What's new map"});
  await expect(map).toBeVisible();
  await map.getByRole('link', {name: 'Platform', exact: true}).click();
  await expect(page).toHaveURL(/\/docs\/features\/whats-new\/platform\/?$/);

  await page.goto('/docs/features/whats-new');
  await page.getByRole('navigation', {name: "What's new map"}).getByRole('link', {name: 'Capture'}).click();
  await expect(page).toHaveURL(/\/docs\/features\/whats-new\/agentic#capture/);
});

test('whats-new cover does not embed screenshots of itself', async ({page}) => {
  await page.goto('/docs/features/whats-new');
  await expect(page.locator('img[src*="catalog-desktop"]')).toHaveCount(0);
  await expect(page.locator('img[src*="catalog-mobile"]')).toHaveCount(0);
});
