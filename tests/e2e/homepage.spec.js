const {expect, test} = require('@playwright/test');

test('landing page exposes clear onboarding links with stable hooks', async ({page}) => {
  await page.goto('/');

  await expect(page.getByTestId('landing-hero')).toBeVisible();
  await expect(page.getByRole('heading', {name: /One Java test suite for web, mobile, API, DB, and CLI/})).toBeVisible();
  await expect(page.getByTestId('landing-hero-actions')).toBeVisible();
  await expect(page.getByTestId('landing-hero-star-cta')).toHaveAttribute('href', 'https://github.com/ShaftHQ/SHAFT_ENGINE');
  await expect(page.getByText(/Plain stack/)).toHaveCount(0);
  await expect(page.getByText(/With SHAFT/)).toHaveCount(0);

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
  const pathfinder = page.getByTestId('landing-pathfinder');
  await expect(pathfinder).toBeVisible();
  await expect(pathfinder.getByRole('link', {name: /Start a new SHAFT project/})).toHaveAttribute('href', '/docs/start/quick-start#new-project-generation');
  await expect(pathfinder.getByRole('link', {name: /Upgrade an existing project/})).toHaveAttribute('href', '/docs/start/quick-start#existing-project-upgrade');
  await expect(pathfinder.getByRole('link', {name: /Connect MCP after the basics/})).toHaveAttribute('href', '/docs/start/quick-start#mcp-integration');
  await expect(pathfinder.getByRole('link', {name: /Add coverage beyond the browser/})).toHaveAttribute('href', '#testing-surfaces');
  await expect(page.getByTestId('landing-cta-install')).toHaveAttribute('href', '/docs/start/quick-start#new-project-generation');
  await expect(page.getByTestId('landing-cta-quickstart')).toHaveAttribute('href', '/docs/start/quick-start#choose-your-path');

  await page.goto('/');
  await expect(page.locator('#proof-section')).toBeVisible();
  await expect(page.locator('#comparison-section')).toHaveCount(0);
  await expect(page.locator('#workflow-section')).toHaveCount(0);
  await expect(page.locator('#get-started')).toBeVisible();
});

test('landing page links to the canonical MCP command page', async ({page}) => {
  await page.goto('/');

  await page.getByTestId('landing-agent').scrollIntoViewIfNeeded();
  await expect(page.getByTestId('landing-agent-mcp-link')).toHaveAttribute('href', '/docs/agentic/mcp');
  await expect(page.locator('[data-testid^="mcp-app-"]')).toHaveCount(0);
});

test('landing page keeps mobile motion and CTAs inside the viewport', async ({page}) => {
  await page.setViewportSize({width: 375, height: 844});
  await page.goto('/');

  await expect(page.getByTestId('landing-hero')).toBeVisible();
  await expect(page.locator('canvas[aria-hidden="true"]')).toHaveCount(2);
  await expect.poll(async () => {
    return page.locator('canvas[aria-hidden="true"]').first().evaluate((canvas) => {
      const context = canvas.getContext('2d');
      if (!context || canvas.width === 0 || canvas.height === 0) return false;
      const pixels = context.getImageData(0, 0, canvas.width, canvas.height).data;
      for (let index = 3; index < pixels.length; index += 40) {
        if (pixels[index] > 0) return true;
      }
      return false;
    });
  }).toBe(true);

  const overflowingButtons = await page.evaluate(() => {
    const viewportWidth = document.documentElement.clientWidth;
    return Array.from(document.querySelectorAll('[data-testid="landing-hero-actions"] a'))
      .map((link) => {
        const rect = link.getBoundingClientRect();
        const parentRect = link.parentElement.getBoundingClientRect();
        return {
          text: link.textContent.trim().replace(/\s+/g, ' '),
          width: rect.width,
          parentWidth: parentRect.width,
          overflows: rect.left < parentRect.left - 1 ||
            rect.right > parentRect.right + 1 ||
            rect.left < -1 ||
            rect.right > viewportWidth + 1,
        };
      })
      .filter((button) => button.overflows || button.width > button.parentWidth + 1);
  });
  expect(overflowingButtons).toEqual([]);

  const pathfinderReveal = await page.getByTestId('landing-pathfinder').evaluate((section) => {
    const style = getComputedStyle(section);
    return {
      ready: document.documentElement.dataset.revealReady,
      transitionProperty: style.transitionProperty,
    };
  });
  expect(pathfinderReveal.ready).toBe('true');
  expect(pathfinderReveal.transitionProperty).toContain('opacity');

  await page.getByTestId('landing-surfaces').scrollIntoViewIfNeeded();
  await expect.poll(async () => {
    return page.getByTestId('landing-surfaces').evaluate((section) => getComputedStyle(section).opacity);
  }).toBe('1');
});
