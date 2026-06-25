const {expect, test} = require('@playwright/test');

test('landing page exposes clear onboarding links with stable hooks', async ({page}) => {
  await page.goto('/');

  await expect(page.getByTestId('landing-hero')).toBeVisible();
  await expect(page.getByTestId('landing-hero-actions')).toBeVisible();
  await expect(page.getByTestId('hero-onboarding-step-1')).toHaveText(
    'Generate a project from installation docs.',
  );
  const onboardingSteps = page.locator('[data-testid^="hero-onboarding-step-"]');
  await expect(onboardingSteps).toHaveText([
    'Generate a project from installation docs.',
    'Run the quick start and validate one passing web flow.',
    'Add native mobile, API, DB, and CLI checks using the same framework controls.',
    'Enable MCP only after evidence review, then tighten prompts and approval policy.',
  ]);

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
  await expect(onboardingSteps).toHaveCount(4);
  const pathfinder = page.getByTestId('landing-pathfinder');
  await expect(pathfinder).toBeVisible();
  await expect(pathfinder.getByRole('link', {name: /Generate a runnable project/})).toHaveAttribute('href', '/docs/start/installation');
  await expect(pathfinder.getByRole('link', {name: /Review surfaces/})).toHaveAttribute('href', '#testing-surfaces');
  await expect(page.getByTestId('hero-onboarding-step-3')).toBeVisible();
  await expect(page.getByTestId('hero-onboarding-step-4')).toBeVisible();
  await expect(page.getByTestId('landing-cta-install')).toHaveAttribute('href', '/docs/start/installation');
  await expect(page.getByTestId('landing-cta-quickstart')).toHaveAttribute('href', '/docs/start/quick-start');
  await page.getByTestId('landing-cta-agent').click();
  await expect(page).toHaveURL('/#connect-ai-agent');

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
  await expect(page.getByTestId('landing-agent-commands')).toHaveAttribute('open', '');

  const visibleApplications = page.locator('[data-testid^="mcp-app-"]');
  const visibleCount = await visibleApplications.count();
  expect(visibleCount).toBeGreaterThan(0);

  for (let i = 0; i < visibleCount; i += 1) {
    const row = visibleApplications.nth(i);
    const command = row.locator('code[data-testid^="mcp-command-"]');
    const copyButton = row.locator('button[data-testid^="mcp-copy-"]');
    await expect(command).toBeVisible();
    await expect(copyButton).toBeVisible();
  }
});
