// Issue #1085. Prose that used to sit in wide tables is a definition list
// (.fact-list) so a 390px viewport does not scroll the page. Property matrices
// that are real columns stay in .table-scroll (keyboard-reachable). That
// exception is the properties catalog and similar reference grids, not the
// dependency-boundary or reporting quick-reference lists pinned here.
const {expect, test} = require('@playwright/test');

const pins = [
  {
    path: '/docs/start/upgrade/reference',
    ids: ['methods-that-require-shaft-visual', 'functionality-that-remains-in-shaft-engine'],
    width: 390,
  },
  {
    path: '/docs/start/upgrade/run',
    ids: ['missing-provider-troubleshooting'],
    width: 390,
  },
  {
    path: '/docs/reference/reporting',
    ids: ['all-reporting-properties'],
    width: 390,
  },
  {
    path: '/docs/reference/reporting',
    ids: ['all-reporting-properties'],
    width: 1440,
  },
];

async function pageOverflow(page) {
  return page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
}

for (const pin of pins) {
  test(`${pin.path} at ${pin.width}px: restructured lists do not overflow the page`, async ({page}) => {
    await page.setViewportSize({width: pin.width, height: 800});
    await page.goto(pin.path);
    await expect(page.locator('article .fact-list').first()).toBeVisible();
    for (const id of pin.ids) {
      const heading = page.locator(`#${id}`);
      await expect(heading, id).toHaveCount(1);
      const lists = heading.locator('xpath=following-sibling::dl[contains(@class,"fact-list")]');
      await expect(lists.first()).toBeVisible();
      const listOverflow = await lists.first().evaluate((el) => el.scrollWidth - el.clientWidth);
      expect(listOverflow, `${id} list overflows`).toBeLessThanOrEqual(1);
    }
    expect(await pageOverflow(page), 'page horizontal overflow').toBeLessThanOrEqual(1);
  });
}

test('landing page has one primary guide action and no page overflow', async ({page}, testInfo) => {
  for (const width of [390, 1440]) {
    await page.setViewportSize({width, height: 900});
    await page.goto('/');
    const guide = page.getByTestId('landing-hero-documentation');
    await expect(guide).toHaveText(/Read the user guide/);
    await expect(guide).toHaveAttribute('href', '/docs/start/overview');
    await expect(page.getByTestId('landing-hero-actions').locator('a[href="/docs/start/overview"]')).toHaveCount(1);
    expect(await pageOverflow(page), `landing overflow at ${width}`).toBeLessThanOrEqual(1);
    await page.screenshot({path: testInfo.outputPath(`landing-${width}.png`), fullPage: false});
  }
});
