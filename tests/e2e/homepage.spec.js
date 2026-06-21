const {expect, test} = require('@playwright/test');

test('landing page exposes clear onboarding links with stable hooks', async ({page}) => {
  await page.goto('/');

  await expect(page.getByTestId('landing-hero')).toBeVisible();
  await expect(page.getByTestId('landing-hero-actions')).toBeVisible();
  await page.getByTestId('landing-hero-install-cta').click();
  await expect(page).toHaveURL(/\/docs\/start\/installation/);

  await page.goBack();
  await page.getByTestId('landing-hero-quickstart-cta').click();
  await expect(page).toHaveURL(/\/docs\/start\/quick-start/);

  await page.goto('/');
  await expect(page.locator('#proof-section')).toBeVisible();
  await expect(page.locator('#comparison-section')).toBeVisible();
  await expect(page.locator('#workflow-section')).toBeVisible();
  await expect(page.locator('#get-started')).toBeVisible();
});

test('landing page exposes deterministic MCP action rows', async ({page}) => {
  await page.goto('/');

  await page.getByTestId('landing-agent').scrollIntoViewIfNeeded();
  await page.getByTestId('landing-agent-commands-summary').click();
  await expect(page.getByTestId('landing-agent-commands')).toBeVisible();

  const visibleApplications = page.locator('[data-testid^="mcp-app-"]');
  expect(await visibleApplications.count()).toBeGreaterThan(3);
  await expect(page.getByTestId('mcp-copy-codex')).toBeVisible();
  await expect(page.getByTestId('mcp-command-codex')).toBeVisible();
});
