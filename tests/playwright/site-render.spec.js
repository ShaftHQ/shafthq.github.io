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
    '#connect-ai-agent',
  );
  await expect(page.locator('#connect-ai-agent')).toBeVisible();
  await page.getByRole('link', {name: 'Connect your AI agent'}).click();
  await expect.poll(() => page.evaluate(() => window.location.hash)).toBe('#connect-ai-agent');
  await expect(page.locator('img[src="/img/shaft-automation-hero.png"]')).toBeVisible();
});

for (const route of [
  '/docs/start/overview',
  '/docs/start/installation',
  '/docs/testing/web',
  '/docs/testing/mobile',
  '/docs/testing/api',
  '/docs/agentic/mcp',
  '/docs/agentic/mcp/manual',
  '/docs/agentic/doctor',
  '/docs/agentic/heal',
]) {
  test(`${route} renders`, async ({page}) => {
    const response = await page.goto(route);
    expect(response?.ok()).toBeTruthy();
    await expect(page.locator('main h1').first()).toBeVisible();
  });
}

test('installation page embeds the project generator', async ({page}) => {
  await page.goto('/docs/start/installation');
  await expect(page.locator('iframe[title="SHAFT Project Generator"]')).toHaveAttribute(
    'src',
    'https://shafthq.github.io/SHAFT_ENGINE/shaft-engine/resources/index.html',
  );
});

test('MCP application command can be copied', async ({page, context}) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  await page.goto('/docs/agentic/mcp');
  await page.getByRole('button', {name: 'Copy Codex CLI / IDE install command'}).click();
  await expect.poll(() => page.evaluate(() => navigator.clipboard.readText())).toContain(
    'codex',
  );
});

test('Linux hides unsupported desktop applications', async ({page}) => {
  await page.addInitScript(() => {
    Object.defineProperty(navigator, 'platform', {get: () => 'Linux x86_64'});
  });
  await page.goto('/docs/agentic/mcp');
  await expect(page.locator('[data-application="codex"]')).toBeVisible();
  await expect(page.locator('[data-application="copilot-intellij"]')).toBeVisible();
  await expect(page.locator('[data-application="claude-desktop"]')).toHaveCount(0);
});

for (const route of ['/', '/docs/agentic/mcp', '/docs/agentic/mcp/manual']) {
  test(`${route} has no page-level horizontal overflow`, async ({page}) => {
    await page.goto(route);
    await expect.poll(() => page.evaluate(
      () => document.documentElement.scrollWidth === document.documentElement.clientWidth,
    )).toBeTruthy();
  });
}

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
