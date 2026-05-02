const { test, expect } = require('@playwright/test');

test('homepage renders', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/SHAFT/i);
  await expect(page.locator('main')).toContainText('SHAFT');
});

test('release page renders contributor avatars with small size', async ({ page }) => {
  await page.goto('/blog/release-10.2.20260501');
  await expect(page.getByRole('heading', { name: /10\.2\.20260501/ }).first()).toBeVisible();
  await expect(
    page.locator('img[alt="@MohabMohie"][width="32"][height="32"]').first(),
  ).toBeVisible();
});
