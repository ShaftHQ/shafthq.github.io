const {expect, test} = require('@playwright/test');
const AxeBuilder = require('@axe-core/playwright').default;

const wcagTags = [
  'wcag2a',
  'wcag2aa',
  'wcag21a',
  'wcag21aa',
  'wcag22a',
  'wcag22aa',
];

const scan = (page) => new AxeBuilder({page}).withTags(wcagTags).analyze();

test.beforeEach(async ({page}) => {
  await page.emulateMedia({reducedMotion: 'reduce'});
});

test('built homepage has no automatically detectable WCAG A or AA violations', async ({page}) => {
  await page.goto('/');
  await expect(page.getByTestId('landing-main')).toBeVisible();

  const {violations} = await scan(page);

  expect(violations, JSON.stringify(violations, null, 2)).toEqual([]);
});

test('built homepage dark theme has no automatically detectable WCAG A or AA violations', async ({page}) => {
  await page.goto('/');
  await page.getByRole('button', {name: /Switch between dark and light mode/}).click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');

  const {violations} = await scan(page);

  expect(violations, JSON.stringify(violations, null, 2)).toEqual([]);
});

test('project generator has no automatically detectable WCAG A or AA violations', async ({page}) => {
  await page.goto('/project-generator');
  await expect(page.getByRole('heading', {name: 'SHAFT Project Generator'})).toBeVisible();

  const {violations} = await scan(page);

  expect(violations, JSON.stringify(violations, null, 2)).toEqual([]);
});

test('audit detects an injected unnamed button', async ({page}) => {
  await page.goto('/');
  await expect(page.getByTestId('landing-main')).toBeVisible();
  await page.evaluate(() => {
    const button = document.createElement('button');
    button.id = 'injected-accessibility-violation';
    document.body.append(button);
  });

  const {violations} = await scan(page);
  const buttonNameViolation = violations.find(({id}) => id === 'button-name');

  expect(buttonNameViolation, JSON.stringify(violations, null, 2)).toBeDefined();
  expect(
    buttonNameViolation.nodes.some(({target}) =>
      target.some((selector) => selector.includes('injected-accessibility-violation')),
    ),
  ).toBe(true);
});

// Docs-site UX regressions (user-guide UX polish): the audit above only covered
// the homepage, so these checks extend it to the getting-started docs path,
// the navigation chrome, and the 320px-3840px viewport range.
const docsPages = ['/docs/start/overview', '/docs/start/quick-start'];

for (const theme of ['light', 'dark']) {
  for (const path of docsPages) {
    test(`${path} ${theme} theme has no automatically detectable WCAG A or AA violations`, async ({page}) => {
      await page.goto(`${path}?docusaurus-theme=${theme}`);
      await expect(page.locator('html')).toHaveAttribute('data-theme', theme);
      await expect(page.locator('article h1')).toBeVisible();

      const {violations} = await new AxeBuilder({page})
        .withTags(wcagTags)
        // Mermaid SVG output is third-party layout; its labels are audited by design review.
        .exclude('.docusaurus-mermaid-container')
        .analyze();

      expect(violations, JSON.stringify(violations, null, 2)).toEqual([]);
    });
  }
}

const viewportWidths = [320, 390, 768, 1440, 2560, 3840];
const overflowPages = ['/', '/docs/start/overview', '/docs/features/whats-new/evidence'];

test('pages never scroll horizontally from 320px to 3840px wide', async ({page}) => {
  const overflows = [];
  for (const width of viewportWidths) {
    await page.setViewportSize({width, height: 900});
    for (const path of overflowPages) {
      await page.goto(path);
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
      if (overflow > 0) overflows.push(`${path} @${width}px overflows by ${overflow}px`);
    }
  }
  expect(overflows).toEqual([]);
});

test('large monitors scale the type and content width instead of leaving a narrow column', async ({page}) => {
  const measure = async () => page.evaluate(() => ({
    rootFont: parseFloat(getComputedStyle(document.documentElement).fontSize),
    article: document.querySelector('article').getBoundingClientRect().width,
  }));
  await page.setViewportSize({width: 1440, height: 900});
  await page.goto('/docs/start/overview');
  const laptop = await measure();
  await page.setViewportSize({width: 2560, height: 1440});
  await page.goto('/docs/start/overview');
  const desktop = await measure();
  await page.setViewportSize({width: 3840, height: 2160});
  await page.goto('/docs/start/overview');
  const uhd = await measure();

  expect(laptop.rootFont).toBe(16);
  expect(desktop.rootFont).toBeGreaterThanOrEqual(18);
  expect(uhd.rootFont).toBeGreaterThan(desktop.rootFont);
  expect(desktop.article).toBeGreaterThan(laptop.article * 1.2);
  expect(uhd.article).toBeGreaterThan(desktop.article);
});

test('mobile navigation targets are at least 44px and search stays a visible box', async ({page}) => {
  await page.setViewportSize({width: 390, height: 844});
  await page.goto('/docs/start/overview');
  const search = page.locator('.navbar__search-input');
  const searchBox = await search.boundingBox();
  expect(searchBox.width, 'unfocused search must read as a search box, not an icon').toBeGreaterThanOrEqual(120);
  expect(searchBox.height).toBeGreaterThanOrEqual(44);

  const toggle = await page.locator('.navbar__toggle').boundingBox();
  expect(toggle.height).toBeGreaterThanOrEqual(44);
  expect(toggle.width).toBeGreaterThanOrEqual(44);

  await page.locator('.navbar__toggle').click();
  const drawerLinks = page.locator('.navbar-sidebar .menu__link');
  await expect(drawerLinks.first()).toBeVisible();
  const heights = await drawerLinks.evaluateAll((links) => links.filter((link) => link.offsetParent).map((link) => link.getBoundingClientRect().height));
  expect(heights.length).toBeGreaterThan(5);
  expect(Math.min(...heights)).toBeGreaterThanOrEqual(44);
});

test('sidebar and navbar expose a clear active state and a visible keyboard focus ring', async ({page}) => {
  await page.goto('/docs/start/quick-start');
  const active = page.locator('.theme-doc-sidebar-menu .menu__link--active:not(.menu__link--sublist)');
  await expect(active).toHaveText('Quick start');
  const activeStyle = await active.evaluate((element) => {
    const style = getComputedStyle(element);
    return {weight: Number(style.fontWeight), indicator: style.boxShadow};
  });
  expect(activeStyle.weight).toBeGreaterThanOrEqual(700);
  expect(activeStyle.indicator).not.toBe('none');

  const navActive = page.locator('.navbar__link--active').first();
  await expect(navActive).toHaveText('Docs');
  expect(await navActive.evaluate((element) => getComputedStyle(element).boxShadow)).not.toBe('none');

  await page.locator('.theme-doc-sidebar-menu .menu__link').first().focus();
  await page.keyboard.press('Tab');
  const ring = await page.evaluate(() => {
    const style = getComputedStyle(document.activeElement);
    return {style: style.outlineStyle, width: parseFloat(style.outlineWidth)};
  });
  expect(ring.style).toBe('solid');
  expect(ring.width).toBeGreaterThanOrEqual(2);
});

test('code block copy buttons are discoverable without hovering', async ({page}) => {
  await page.goto('/docs/start/quick-start');
  const copy = page.locator('.theme-code-block button[aria-label="Copy code to clipboard"]').first();
  await expect(copy).toBeAttached();
  expect(Number(await copy.evaluate((element) => getComputedStyle(element).opacity))).toBeGreaterThanOrEqual(0.6);
});

test('homepage hero states what SHAFT is and links the install path', async ({page}) => {
  await page.goto('/');
  const hero = page.getByTestId('landing-hero');
  await expect(hero.getByTestId('landing-hero-kicker')).toHaveText(/open-source Java test automation framework/i);
  await expect(hero.getByRole('link', {name: /Install SHAFT/})).toHaveAttribute('href', '/docs/start/installation');
});
