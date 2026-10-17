// @ts-check
// Review of #1130: Docusaurus collapsibles finish closing on `transitionend`.
// A global zero transition duration under reduced motion never fires it, so a
// collapsed <details> stays open at 0 px and Tab lands in hidden content.
const {test, expect} = require('@playwright/test');

test.use({reducedMotion: 'reduce'});

test('with reduced motion, collapsing a docs <details> leaves open === false', async ({page}) => {
  await page.goto('/docs/start/quick-start');
  const details = page.locator('main article details').first();
  const summary = details.locator('summary').first();
  await summary.scrollIntoViewIfNeeded();
  await summary.click();
  await expect.poll(() => details.evaluate((element) => element.open)).toBe(true);
  await summary.click();
  await expect.poll(() => details.evaluate((element) => element.open), {timeout: 2_000}).toBe(false);
  await expect(details).toHaveAttribute('data-collapsed', 'true');
});

test('with reduced motion, a collapsed sidebar category hides its links', async ({page}) => {
  await page.setViewportSize({width: 1280, height: 900});
  await page.goto('/docs/start/quick-start');
  const categories = page.locator('.theme-doc-sidebar-menu li.theme-doc-sidebar-item-category');
  const index = await categories.evaluateAll((items) => items.findIndex((item) => !item.classList.contains('menu__list-item--collapsed')));
  expect(index).toBeGreaterThanOrEqual(0);
  const category = categories.nth(index);
  const caret = category.locator(':scope > .menu__list-item-collapsible > button.menu__caret');
  const toggle = await caret.count() ? caret : category.locator(':scope > .menu__list-item-collapsible > .menu__link--sublist');
  const list = category.locator(':scope > ul');
  await expect(list).toBeVisible();
  await toggle.click();
  await expect(category).toHaveClass(/menu__list-item--collapsed/);
  await expect.poll(() => list.evaluate((element) => getComputedStyle(element).display), {timeout: 2_000}).toBe('none');
});
