const {test, expect} = require('@playwright/test');

test('homepage exposes the primary product paths', async ({page}) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/SHAFT/i);
  await expect(page.getByRole('heading', {name: 'One engine for every test surface.'})).toBeVisible();
  await expect(page.getByRole('link', {name: 'Run your first test'})).toHaveAttribute(
    'href',
    '/docs/start/quick-start',
  );
  await expect(page.getByRole('link', {name: 'Connect your AI agent'})).toHaveAttribute(
    'href',
    '/docs/agentic/mcp',
  );
  await expect(page.locator('img[src="/img/shaft-automation-hero.png"]')).toBeVisible();
});

for (const route of [
  '/docs/start/overview',
  '/docs/start/installation',
  '/docs/testing/web',
  '/docs/testing/mobile',
  '/docs/testing/api',
  '/docs/agentic/mcp',
  '/docs/agentic/doctor',
  '/docs/agentic/heal',
]) {
  test(`${route} renders`, async ({page}) => {
    const response = await page.goto(route);
    expect(response?.ok()).toBeTruthy();
    await expect(page.locator('main h1').first()).toBeVisible();
  });
}

test('MCP setup prompt can be copied', async ({page, context}) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  await page.goto('/docs/agentic/mcp');
  const codeBlock = page.locator('pre').filter({hasText: 'Configure shaft-mcp'}).first();
  await expect(codeBlock).toBeVisible();
  await codeBlock
    .locator('xpath=..')
    .getByRole('button', {name: 'Copy code to clipboard'})
    .click();
  await expect.poll(() => page.evaluate(() => navigator.clipboard.readText())).toContain(
    'Query Maven Central for the latest available version',
  );
});

test('dark mode remains readable', async ({page}) => {
  await page.goto('/');
  const toggle = page.getByRole('button', {name: /switch between dark and light mode/i});
  if (await toggle.isVisible()) await toggle.click();
  await expect(page.getByRole('heading', {name: 'One engine for every test surface.'})).toBeVisible();
});

test('release page renders contributor avatars with small size', async ({page}) => {
  await page.goto('/blog/release-10.2.20260501');
  await expect(page.getByRole('heading', {name: /10\.2\.20260501/}).first()).toBeVisible();
  await expect(page.locator('img[alt="@MohabMohie"][width="32"][height="32"]').first()).toBeVisible();
});
