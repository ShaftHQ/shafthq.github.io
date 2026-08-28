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
  expect(await page.locator('svg[aria-hidden="true"] ellipse').first().evaluate((element) => getComputedStyle(element).animationName)).toBe('none');
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth + 1)).toBe(true);
});

test('footer Slack CTA retains its trusted invite destination', async ({page}) => {
  await page.goto('/');
  await expect(page.getByTestId('landing-footer').getByRole('link', {name: 'Slack'})).toHaveAttribute(
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
  const social = page.getByTestId('landing-footer').getByRole('link', {name: 'Star SHAFT on GitHub'});
  await expect(social).toHaveAttribute('href', 'https://github.com/ShaftHQ/SHAFT_ENGINE');
});

test('landing CTAs remain contained at mobile and 800px widths', async ({page}) => {
  for (const viewport of [{width: 390, height: 844}, {width: 800, height: 900}]) {
    await page.setViewportSize(viewport);
    await page.goto('/');
    for (const placement of ['hero', 'final']) {
      const problems = await page.getByTestId(`landing-${placement}-actions`).locator('a').evaluateAll((links) => links.map((link) => {
        const rect = link.getBoundingClientRect();
        const parent = link.parentElement.getBoundingClientRect();
        return {
          horizontal: rect.left < parent.left - 1 || rect.right > parent.right + 1 || rect.left < -1 || rect.right > document.documentElement.clientWidth + 1,
          vertical: link.scrollHeight > link.clientHeight + 1,
        };
      }).filter(({horizontal, vertical}) => horizontal || vertical));
      expect(problems).toEqual([]);
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth + 1)).toBe(true);
  }
});

test('supporter logos load locally on visible high-contrast plates', async ({page}) => {
  await page.goto('/');
  const logos = page.getByTestId('landing-footer').locator('img[src^="/img/supporters/"]');
  await expect(logos).toHaveCount(4);
  for (const logo of await logos.all()) await logo.scrollIntoViewIfNeeded();
  const states = await logos.evaluateAll((images) => images.map((image) => {
    const plate = getComputedStyle(image.parentElement);
    return {
      loaded: image.complete && image.naturalWidth > 0 && image.naturalHeight > 0,
      background: plate.backgroundColor,
      border: plate.borderTopColor,
    };
  }));
  expect(states.every(({loaded, background, border}) => loaded && background !== 'rgba(0, 0, 0, 0)' && border !== 'rgba(0, 0, 0, 0)')).toBe(true);
});

test('community-reported organizations render as loaded local logos with visible names', async ({page}) => {
  await page.goto('/');
  const cards = page.getByTestId('landing-footer').locator('a:has(img[src^="/img/community/"])');
  await expect(cards).toHaveCount(22);
  for (const card of await cards.all()) await card.scrollIntoViewIfNeeded();
  expect(await cards.evaluateAll((links) => links.every((link) => {
    const image = link.querySelector('img');
    const label = link.querySelector('span');
    return image.complete && image.naturalWidth > 0 && image.naturalHeight > 0 && label.textContent.trim().length > 0;
  }))).toBe(true);
  const lightWordmarks = cards.locator('img[src$="/act.png"], img[src$="/ihorizons.png"], img[src$="/efg-holding.png"]');
  await expect(lightWordmarks).toHaveCount(3);
  expect(await lightWordmarks.evaluateAll((images) => images.every((image) => getComputedStyle(image).backgroundColor === 'rgb(29, 37, 53)'))).toBe(true);
});

test('product screenshots share a keyboard-accessible deep-zoom viewer', async ({page}) => {
  await page.setViewportSize({width: 1440, height: 1000});
  await page.goto('/');
  const cards = page.getByTestId('landing-evidence').locator('figure');
  await expect(cards).toHaveCount(3);
  const geometry = await cards.evaluateAll((figures) => figures.map((figure) => {
    const media = figure.querySelector('button').getBoundingClientRect();
    const caption = figure.querySelector('figcaption').getBoundingClientRect();
    return {mediaTop: media.top, mediaBottom: media.bottom, captionTop: caption.top};
  }));
  expect(Math.max(...geometry.map(({mediaTop}) => mediaTop)) - Math.min(...geometry.map(({mediaTop}) => mediaTop))).toBeLessThanOrEqual(2);
  expect(Math.max(...geometry.map(({mediaBottom}) => mediaBottom)) - Math.min(...geometry.map(({mediaBottom}) => mediaBottom))).toBeLessThanOrEqual(2);
  expect(Math.max(...geometry.map(({captionTop}) => captionTop)) - Math.min(...geometry.map(({captionTop}) => captionTop))).toBeLessThanOrEqual(2);

  const triggers = page.getByTestId('image-viewer-trigger');
  await expect(triggers).toHaveCount(6);
  for (const trigger of await triggers.all()) {
    await trigger.hover({position: {x: 20, y: 20}});
    await expect.poll(() => trigger.locator(':scope > :first-child').evaluate((element) => new DOMMatrixReadOnly(getComputedStyle(element).transform).a)).toBeCloseTo(2, 1);
  }

  const firstTrigger = cards.first().getByRole('button');
  await firstTrigger.focus();
  await page.keyboard.press('Enter');
  await expect(page.getByTestId('image-viewer')).toHaveCount(1);
  const viewer = page.locator('.yarl__root');
  await expect(viewer).toBeVisible();
  await expect(viewer.locator('img[src="/img/evidence/allure-passed-evidence.png"]')).toBeVisible();
  const zoomWrapper = viewer.locator('.yarl__slide_current .yarl__slide_wrapper');
  await page.getByRole('button', {name: 'Zoom in'}).click();
  await expect.poll(() => zoomWrapper.evaluate((element) => new DOMMatrixReadOnly(getComputedStyle(element).transform).a)).toBeGreaterThanOrEqual(2);
  await page.keyboard.press('+');
  await expect.poll(() => zoomWrapper.evaluate((element) => new DOMMatrixReadOnly(getComputedStyle(element).transform).a)).toBeGreaterThanOrEqual(4);
  const beforeWheel = await zoomWrapper.evaluate((element) => new DOMMatrixReadOnly(getComputedStyle(element).transform).a);
  await zoomWrapper.hover();
  await page.mouse.wheel(0, -500);
  await expect.poll(() => zoomWrapper.evaluate((element) => new DOMMatrixReadOnly(getComputedStyle(element).transform).a)).toBeGreaterThan(beforeWheel);
  await page.keyboard.press('Escape');
  await expect(page.getByTestId('image-viewer')).toHaveCount(0);
  await expect(firstTrigger).toBeFocused();
});
