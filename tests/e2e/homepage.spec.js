const {expect, test} = require('@playwright/test');

const destinations = {
  create_project: '/project-generator',
  explore_documentation: '/docs/start/overview',
  star_github: 'https://github.com/ShaftHQ/SHAFT_ENGINE',
};

const hooks = {
  create_project: 'create-project',
  explore_documentation: 'documentation',
  star_github: 'star',
};

for (const placement of ['hero', 'final']) {
  test(`landing ${placement} CTAs use approved destinations and analytics`, async ({page}) => {
    await page.addInitScript(() => { window.__landingEvents = []; window.gtag = (...args) => window.__landingEvents.push(args); });
    await page.goto('/');
    for (const [name, destination] of Object.entries(destinations)) {
      const testId = `landing-${placement}-${hooks[name]}`;
      const link = page.getByTestId(testId);
      await expect(link).toHaveAttribute('href', destination);
      await link.evaluate((element) => element.addEventListener('click', (event) => event.preventDefault(), {once: true}));
      await link.click();
    }
    const events = await page.evaluate(() => window.__landingEvents);
    expect(events).toHaveLength(3);
    expect(events.map((event) => event[2].cta_name).sort()).toEqual(Object.keys(destinations).sort());
    expect(events.every((event) => event[0] === 'event' && event[1] === 'landing_conversion' && event[2].placement === placement)).toBe(true);
  });
}

test('landing evidence remains visible and decorative motion stops when reduced', async ({page}) => {
  await page.emulateMedia({reducedMotion: 'reduce'});
  await page.setViewportSize({width: 390, height: 844});
  await page.goto('/');
  await expect(page.locator('main')).toHaveCount(1);
  await expect(page.getByRole('heading', {name: 'Release decisions backed by inspectable evidence.'})).toBeVisible();
  await expect(page.locator('#evidence-heading')).toHaveCount(1);
  await expect(page.getByTestId('landing-evidence').getByRole('img')).toHaveCount(5);
  expect(await page.locator('svg[aria-hidden="true"] path').first().evaluate((element) => getComputedStyle(element).animationName)).toBe('none');
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth + 1)).toBe(true);
});

test('footer Slack CTA retains its trusted invite destination', async ({page}) => {
  await page.goto('/');
  await expect(page.getByRole('link', {name: 'Slack'})).toHaveAttribute(
    'href',
    /^https:\/\/join\.slack\.com\/t\/shaft-engine\/.+$/,
  );
});

test('landing preserves semantic IDs, internal navigation, and safe external links', async ({page}) => {
  await page.goto('/');
  const ids = await page.locator('[id]').evaluateAll((nodes) => nodes.map((node) => node.id));
  expect(new Set(ids).size).toBe(ids.length);
  await expect(page.getByTestId('landing-hero-actions')).toContainText('Create new project');
  await page.getByTestId('landing-hero-create-project').click();
  await expect(page).toHaveURL(/\/project-generator$/);
  await page.goto('/');
  await page.getByTestId('landing-hero-documentation').click();
  await expect(page).toHaveURL(/\/docs\/start\/overview$/);
  await page.goto('/');
  await page.getByRole('link', {name: 'AI-assisted Heal'}).click();
  await expect(page).toHaveURL(/\/docs\/agentic\/heal$/);
  await page.goto('/');
  const star = page.getByTestId('landing-hero-star');
  await expect(star).toHaveAttribute('target', '_blank');
  await expect(star).toHaveAttribute('rel', /noreferrer/);
  const social = page.getByRole('link', {name: 'Star SHAFT on GitHub'});
  await expect(social).toHaveAttribute('href', 'https://github.com/ShaftHQ/SHAFT_ENGINE');
});

test('landing CTAs remain contained at mobile and 800px widths', async ({page}) => {
  for (const viewport of [{width: 390, height: 844}, {width: 800, height: 900}]) {
    await page.setViewportSize(viewport);
    await page.goto('/');
    const box = await page.getByTestId('landing-hero-actions').boundingBox();
    expect(box.x).toBeGreaterThanOrEqual(0);
    expect(box.x + box.width).toBeLessThanOrEqual(viewport.width + 1);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth + 1)).toBe(true);
  }
});
