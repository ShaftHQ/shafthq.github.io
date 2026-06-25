const {expect, test} = require('@playwright/test');

test('landing page exposes clear onboarding links with stable hooks', async ({page}) => {
  await page.goto('/');

  await expect(page.getByTestId('landing-hero')).toBeVisible();
  await expect(page.getByTestId('landing-hero-actions')).toBeVisible();
  await expect(page.getByTestId('hero-onboarding-step-1')).toHaveText(
    'Choose the new-project path in the quick start.',
  );
  const onboardingSteps = page.locator('[data-testid^="hero-onboarding-step-"]');
  await expect(onboardingSteps).toHaveText([
    'Choose the new-project path in the quick start.',
    'Run the generated project and validate one passing web flow.',
    'Add native mobile, API, DB, and CLI checks using the same framework controls.',
    'Connect MCP from the quick start after the suite compiles.',
  ]);

  await Promise.all([
    page.waitForURL('**/docs/start/quick-start#new-project-generation'),
    page.getByTestId('landing-hero-install-cta').click(),
  ]);
  await expect(page).toHaveURL(/\/docs\/start\/quick-start#new-project-generation/);

  await page.goto('/');
  await Promise.all([
    page.waitForURL('**/docs/start/quick-start#choose-your-path'),
    page.getByTestId('landing-hero-quickstart-cta').click(),
  ]);
  await expect(page).toHaveURL(/\/docs\/start\/quick-start#choose-your-path/);

  await page.goto('/');
  await expect(onboardingSteps).toHaveCount(4);
  const pathfinder = page.getByTestId('landing-pathfinder');
  await expect(pathfinder).toBeVisible();
  await expect(pathfinder.getByRole('link', {name: /Start a new SHAFT project/})).toHaveAttribute('href', '/docs/start/quick-start#new-project-generation');
  await expect(pathfinder.getByRole('link', {name: /Upgrade an existing project/})).toHaveAttribute('href', '/docs/start/quick-start#existing-project-upgrade');
  await expect(pathfinder.getByRole('link', {name: /Connect MCP after the basics/})).toHaveAttribute('href', '/docs/start/quick-start#mcp-integration');
  await expect(pathfinder.getByRole('link', {name: /Review surfaces/})).toHaveAttribute('href', '#testing-surfaces');
  await expect(page.getByTestId('hero-onboarding-step-3')).toBeVisible();
  await expect(page.getByTestId('hero-onboarding-step-4')).toBeVisible();
  await expect(page.getByTestId('landing-cta-install')).toHaveAttribute('href', '/docs/start/quick-start#new-project-generation');
  await expect(page.getByTestId('landing-cta-quickstart')).toHaveAttribute('href', '/docs/start/quick-start#choose-your-path');
  await page.getByTestId('landing-cta-agent').click();
  await expect(page).toHaveURL(/\/docs\/start\/quick-start#mcp-integration/);

  await page.goto('/');
  await expect(page.locator('#proof-section')).toBeVisible();
  await expect(page.locator('#comparison-section')).toBeVisible();
  await expect(page.locator('#workflow-section')).toBeVisible();
  await expect(page.locator('#get-started')).toBeVisible();
});

test('landing page links to the canonical MCP command page', async ({page}) => {
  await page.goto('/');

  await page.getByTestId('landing-agent').scrollIntoViewIfNeeded();
  await expect(page.getByTestId('landing-agent-mcp-link')).toHaveAttribute('href', '/docs/agentic/mcp');
  await expect(page.locator('[data-testid^="mcp-app-"]')).toHaveCount(0);
});
