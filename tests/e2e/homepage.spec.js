const {expect, test} = require('@playwright/test');

test('landing page exposes clear onboarding links with stable hooks', async ({page}) => {
  await page.goto('/');

  await expect(page.getByTestId('landing-hero')).toBeVisible();
  await expect(page.getByTestId('landing-hero-actions')).toBeVisible();
  await expect(page.getByTestId('hero-onboarding-step-1')).toHaveText(/Generate a project from installation docs/);
  await page.getByTestId('hero-onboarding-step-2').scrollIntoViewIfNeeded();
  await expect(page.getByTestId('hero-onboarding-step-2')).toHaveText(/Run the quick start and validate one passing web flow/);

  await Promise.all([
    page.waitForURL('**/docs/start/installation*'),
    page.getByTestId('landing-hero-install-cta').click(),
  ]);
  await expect(page).toHaveURL(/\/docs\/start\/installation/);

  await page.goto('/');
  await Promise.all([
    page.waitForURL('**/docs/start/quick-start*'),
    page.getByTestId('landing-hero-quickstart-cta').click(),
  ]);
  await expect(page).toHaveURL(/\/docs\/start\/quick-start/);

  await page.goto('/');
  await expect(page.locator('[data-testid^="hero-onboarding-step-"]')).toHaveCount(4);
  await expect(page.getByTestId('hero-onboarding-step-3')).toBeVisible();
  await expect(page.getByTestId('hero-onboarding-step-4')).toBeVisible();
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
