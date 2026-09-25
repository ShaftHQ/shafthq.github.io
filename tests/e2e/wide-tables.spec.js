// Wide data tables (issue #1076). Rules and sources: WCAG 2.2 SC 1.4.10 (the
// table is excepted, the page is not), 2.1.1 (scroll container reachable by
// keyboard), 4.1.2 (focusable region has a role and a name), 2.4.7 (visible
// focus). Pattern: Roselli "Under-engineered responsive tables" and
// Pickering "Inclusive Components: Data tables" (tab stop only when it scrolls).
const {expect, test} = require('@playwright/test');
const AxeBuilder = require('@axe-core/playwright').default;

const widePages = ['/docs/reference/reporting', '/docs/testing/flutter'];

// Every element around a <table> (the table itself included) that currently
// scrolls horizontally, tagged so the tests can address it.
async function tagScrollContainers(page) {
  return page.evaluate(() => {
    const found = [];
    for (const table of document.querySelectorAll('article table')) {
      for (const el of [table, table.parentElement]) {
        const style = getComputedStyle(el);
        if (/(auto|scroll)/.test(style.overflowX) && el.scrollWidth > el.clientWidth + 1) {
          el.setAttribute('data-test-scroller', String(found.length));
          found.push(found.length);
          break;
        }
      }
    }
    return found.length;
  });
}

test.beforeEach(async ({page}) => {
  await page.emulateMedia({reducedMotion: 'reduce'});
});

for (const theme of ['light', 'dark']) {
  for (const path of widePages) {
    test(`${path} ${theme}: axe scrollable-region-focusable passes`, async ({page}) => {
      await page.setViewportSize({width: 1440, height: 900});
      await page.goto(`${path}?docusaurus-theme=${theme}`);
      await expect(page.locator('html')).toHaveAttribute('data-theme', theme);
      await expect(page.locator('article table').first()).toBeVisible();
      const {violations} = await new AxeBuilder({page}).withRules(['scrollable-region-focusable']).analyze();
      expect(violations, JSON.stringify(violations.map((v) => v.nodes.map((n) => n.target)), null, 2)).toEqual([]);
    });
  }
}

for (const path of widePages) {
  test(`${path} at 320px: wide tables scroll in a named, keyboard-operable region, not the page`, async ({page}) => {
    await page.setViewportSize({width: 320, height: 700});
    await page.goto(path);
    await expect(page.locator('article table').first()).toBeVisible();

    const pageOverflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(pageOverflow, 'the page itself must not scroll horizontally at 320px (WCAG 1.4.10)').toBeLessThanOrEqual(0);

    const scrollers = await tagScrollContainers(page);
    expect(scrollers, 'at 320px this page has at least one horizontally scrolling table').toBeGreaterThan(0);

    const names = [];
    for (let i = 0; i < scrollers; i++) {
      const scroller = page.locator(`[data-test-scroller="${i}"]`);
      // The scroller must not be the <table> itself: CSS display on a table breaks its semantics.
      expect(await scroller.evaluate((el) => el.tagName), 'scroll a wrapper, not the table').not.toBe('TABLE');
      await expect(scroller).toHaveAttribute('tabindex', '0');
      await expect(scroller).toHaveAttribute('role', 'region');
      const name = await scroller.evaluate((el) => {
        const ids = el.getAttribute('aria-labelledby');
        if (ids) return ids.split(/\s+/).map((id) => document.getElementById(id)?.textContent.trim() ?? '').join(' ').trim();
        return (el.getAttribute('aria-label') ?? '').trim();
      });
      expect(name, 'the focusable region needs an accessible name (WCAG 4.1.2)').not.toBe('');
      names.push(name);
      await expect(scroller.locator('table')).toHaveCSS('display', 'table');

      // Reach it with Tab from the element just before it (sequential focus order).
      await scroller.evaluate((el) => {
        const probe = document.createElement('button');
        probe.textContent = 'probe';
        probe.setAttribute('data-test-probe', '');
        el.before(probe);
        probe.focus();
      });
      await page.keyboard.press('Tab');
      expect(await scroller.evaluate((el) => document.activeElement === el), 'Tab reaches the scroll region').toBe(true);
      const outline = await scroller.evaluate((el) => {
        const s = getComputedStyle(el);
        return {style: s.outlineStyle, width: parseFloat(s.outlineWidth)};
      });
      expect(outline.style, 'visible focus indicator (WCAG 2.4.7)').not.toBe('none');
      expect(outline.width).toBeGreaterThanOrEqual(2);
      await page.keyboard.press('ArrowRight');
      await page.keyboard.press('ArrowRight');
      await expect.poll(() => scroller.evaluate((el) => el.scrollLeft), {message: 'arrow keys scroll the focused region'}).toBeGreaterThan(0);
      await page.locator('[data-test-probe]').evaluate((el) => el.remove());
    }
    expect(new Set(names).size, `region names are unique: ${JSON.stringify(names)}`).toBe(names.length);
  });
}

test('tables that fit add no tab stop and no landmark', async ({page}) => {
  await page.setViewportSize({width: 1440, height: 900});
  await page.goto('/docs/testing/flutter');
  await expect(page.locator('article table').first()).toBeVisible();
  const fitting = () =>
    page.evaluate(() =>
      [...document.querySelectorAll('article table')]
        .map((table) => table.parentElement)
        .filter((wrapper) => wrapper.scrollWidth <= wrapper.clientWidth + 1)
        .map((wrapper) => ({tabindex: wrapper.getAttribute('tabindex'), role: wrapper.getAttribute('role')})),
    );
  expect((await fitting()).length, 'flutter has tables that fit at 1440px').toBeGreaterThan(0);
  await expect
    .poll(async () => (await fitting()).filter((w) => w.tabindex !== null || w.role !== null).length, {
      message: 'fitting tables must not stay focusable regions after hydration',
    })
    .toBe(0);
});
