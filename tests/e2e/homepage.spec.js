const {expect, test} = require('@playwright/test');

const anchorGap = (page, id) => page.evaluate((targetId) => {
  const target = document.getElementById(targetId);
  const navbar = document.querySelector('.navbar');
  if (!target || !navbar) return null;
  return Math.round(target.getBoundingClientRect().top - navbar.getBoundingClientRect().bottom);
}, id);

test('hero routes users to a workflow H2 clear of the sticky nav without a GitHub distraction', async ({page}) => {
  await page.goto('/');
  await expect(page.getByRole('heading', {name: 'Release decisions backed by inspectable evidence.'})).toBeVisible();
  await expect(page.getByTestId('landing-hero')).toContainText('Run one Java project across web, mobile, API, database, and CLI.');
  await expect(page.getByTestId('landing-hero-actions').getByRole('link', {name: 'Star on GitHub'})).toHaveCount(0);
  await page.getByTestId('landing-hero-workflow').click();
  await expect(page).toHaveURL(/#agent-workflow$/);
  await expect(page.getByTestId('landing-agent-workflow')).toBeInViewport();
  await expect.poll(() => anchorGap(page, 'agent-workflow'), {timeout: 5_000}).toBeLessThanOrEqual(120);
  expect(await anchorGap(page, 'agent-workflow')).toBeGreaterThanOrEqual(8);
  await expect(page.getByTestId('landing-final').getByRole('link', {name: 'Star on GitHub'})).toHaveAttribute('href', 'https://github.com/ShaftHQ/SHAFT_ENGINE');
});

test('landing CTAs retain destinations and conversion payloads', async ({page}) => {
  const ctas = [
    ['landing-hero-create-project', '/project-generator', 'create_project', 'hero'],
    ['landing-hero-documentation', '/docs/start/overview', 'explore_documentation', 'hero'],
    ['landing-hero-workflow', '#agent-workflow', 'view_agent_workflow', 'hero'],
    ['landing-final-create-project', '/project-generator', 'create_project', 'final'],
    ['landing-final-documentation', '/docs/start/overview', 'explore_documentation', 'final'],
    ['landing-final-star', 'https://github.com/ShaftHQ/SHAFT_ENGINE', 'star_github', 'final'],
  ];
  await page.addInitScript(() => {
    window.__landingEvents = [];
    window.gtag = (...args) => window.__landingEvents.push(args);
  });
  await page.goto('/');
  for (const [testId, destination] of ctas) {
    const link = page.getByTestId(testId);
    await expect(link).toHaveAttribute('href', destination);
    await link.evaluate((element) => element.addEventListener('click', (event) => event.preventDefault(), {once: true}));
    await link.click();
  }
  const events = await page.evaluate(() => window.__landingEvents);
  expect(events).toEqual(ctas.map(([, destination, ctaName, placement]) => [
    'event',
    'landing_conversion',
    {cta_name: ctaName, placement, destination},
  ]));
});

test('footer Slack CTA retains its trusted invite destination', async ({page}) => {
  await page.goto('/');
  await expect(page.getByTestId('landing-footer').getByRole('link', {name: 'Slack'})).toHaveAttribute(
    'href',
    /^https:\/\/join\.slack\.com\/t\/shaft-engine\/.+$/,
  );
});

async function assertTabs(page, tablistName, first, second, last = second) {
  const tablist = page.getByRole('tablist', {name: tablistName});
  const firstTab = tablist.getByRole('tab', {name: first});
  const secondTab = tablist.getByRole('tab', {name: second});
  const lastTab = tablist.getByRole('tab', {name: last});
  await expect(firstTab).toHaveAttribute('aria-selected', 'true');
  await firstTab.focus();
  await page.keyboard.press('ArrowRight');
  await expect(secondTab).toBeFocused();
  await expect(secondTab).toHaveAttribute('aria-selected', 'true');
  await page.keyboard.press('Home');
  await expect(firstTab).toBeFocused();
  await expect(firstTab).toHaveAttribute('aria-selected', 'true');
  await page.keyboard.press('End');
  await expect(lastTab).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(lastTab).toHaveAttribute('aria-selected', 'true');
  await page.keyboard.press(' ');
  await expect(lastTab).toHaveAttribute('aria-selected', 'true');
}

test('workflow and surface tabs support shared keyboard behavior', async ({page}) => {
  await page.goto('/');
  await assertTabs(page, 'Agent-to-evidence workflow', 'Author and prove', 'Diagnose and review');
  await expect(page.getByRole('tabpanel').filter({hasText: 'doctor_analyze_failed_allure'})).toBeVisible();
  await assertTabs(page, 'Testing surfaces', 'Web', 'Mobile', 'CLI');
  await expect(page.getByRole('tabpanel').filter({hasText: 'performTerminalCommand'})).toBeVisible();
  await page.getByRole('tab', {name: 'API'}).click();
  await expect(page.getByRole('tabpanel').filter({hasText: 'performRequest'})).toBeVisible();
});

test('landing remains visible, motion-free, and contained at narrow widths', async ({page}) => {
  await page.emulateMedia({reducedMotion: 'reduce'});
  for (const viewport of [{width: 390, height: 844}, {width: 800, height: 900}]) {
    await page.setViewportSize(viewport);
    await page.goto('/');
    await expect(page.getByTestId('landing-main')).toBeVisible();
    await expect(page.locator('svg').filter({hasText: 'Intent · Java · Run · Evidence'})).toHaveCSS('display', 'none');
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth + 1)).toBe(true);
  }
});

test('full-resolution evidence waits for activation, supports control/keyboard/wheel zoom, and restores focus', async ({page}) => {
  const fullResolutionRequests = [];
  page.on('request', (request) => {
    if (new URL(request.url()).pathname === '/img/evidence/allure-passed-evidence.png') fullResolutionRequests.push(request.url());
  });
  await page.setViewportSize({width: 1440, height: 1000});
  await page.goto('/');
  await expect(page.getByTestId('landing-hero').locator('img[src*="previews/allure-passed-evidence"]')).toBeVisible();
  expect(fullResolutionRequests).toEqual([]);
  const trigger = page.getByTestId('landing-hero').getByTestId('image-viewer-trigger');
  await trigger.focus();
  await page.keyboard.press('Enter');
  await expect(page.getByRole('dialog', {name: 'Lightbox'})).toBeVisible();
  await expect(page.locator('.yarl__root img[src="/img/evidence/allure-passed-evidence.png"]')).toBeVisible();
  await expect.poll(() => fullResolutionRequests.length).toBeGreaterThan(0);
  const zoomWrapper = page.locator('.yarl__slide_current .yarl__slide_wrapper');
  await page.getByRole('button', {name: 'Zoom in'}).click();
  await expect.poll(() => zoomWrapper.evaluate((element) => new DOMMatrixReadOnly(getComputedStyle(element).transform).a)).toBeGreaterThan(1);
  const afterControlZoom = await zoomWrapper.evaluate((element) => new DOMMatrixReadOnly(getComputedStyle(element).transform).a);
  await page.keyboard.press('+');
  await expect.poll(() => zoomWrapper.evaluate((element) => new DOMMatrixReadOnly(getComputedStyle(element).transform).a)).toBeGreaterThan(afterControlZoom);
  const beforeWheelZoom = await zoomWrapper.evaluate((element) => new DOMMatrixReadOnly(getComputedStyle(element).transform).a);
  await zoomWrapper.hover();
  await page.mouse.wheel(0, -500);
  await expect.poll(() => zoomWrapper.evaluate((element) => new DOMMatrixReadOnly(getComputedStyle(element).transform).a)).toBeGreaterThan(beforeWheelZoom);
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog', {name: 'Lightbox'})).toHaveCount(0);
  await expect(trigger).toBeFocused();
});

test('community-reported logos stay behind their native disclosure', async ({page}) => {
  await page.goto('/');
  const details = page.getByTestId('landing-footer').locator('details');
  await details.locator('summary').click();
  await expect(details.locator('a:has(img[src^="/img/community/"])')).toHaveCount(22);
  await expect(page.getByText('Organization names were reported through anonymous community surveys. This list is unaudited and does not imply endorsement.')).toBeVisible();
});
