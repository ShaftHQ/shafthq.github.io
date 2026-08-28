const {expect, test} = require('@playwright/test');
const AxeBuilder = require('@axe-core/playwright').default;

test('capability atlas searches, filters, resets, and opens direct feature links', async ({page}) => {
  await page.goto('/docs/features/whats-new');
  const atlas = page.getByRole('region', {name: 'Find the feature for your goal'});
  await expect(atlas.getByText('61 features')).toBeVisible();

  await atlas.getByLabel('Search capabilities').fill('GraphQL');
  await expect(atlas.getByRole('link', {name: /GraphQL API actions/})).toBeVisible();
  await expect(atlas.getByText('1 feature')).toBeVisible();
  await atlas.getByRole('link', {name: /GraphQL API actions/}).click();
  await expect(page).toHaveURL(/\/docs\/features\/whats-new\/testing#graphql$/);
  await expect(page.locator('#graphql')).toBeVisible();

  await page.goto('/docs/features/whats-new');
  await atlas.getByRole('button', {name: 'Test mobile'}).click();
  await expect(atlas.getByRole('button', {name: 'Test mobile'})).toHaveAttribute('aria-pressed', 'true');
  await expect(atlas.getByRole('link', {name: /Flutter mobile API/})).toBeVisible();
  await atlas.getByLabel('Search capabilities').fill('not-a-feature');
  await expect(atlas.getByText('No matching capabilities')).toBeVisible();
  await atlas.getByRole('button', {name: 'Reset filters'}).click();
  await expect(atlas.getByText('61 features')).toBeVisible();
});

test('atlas and trace rail remain usable on mobile, dark mode, and reduced motion', async ({page}) => {
  await page.emulateMedia({colorScheme: 'dark', reducedMotion: 'reduce'});
  await page.setViewportSize({width: 390, height: 844});
  await page.goto('/docs/features/whats-new');
  const search = page.getByLabel('Search capabilities');
  await expect(search).toBeVisible();
  await search.focus();
  await expect(search).toBeFocused();
  await page.goto('/docs/features/whats-new/capture#recorder-workbench');
  await expect(page.locator('#recorder-workbench')).toBeVisible();
  await expect(page.getByRole('navigation', {name: "What's new groups"})).toBeVisible();
  const {violations} = await new AxeBuilder({page}).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
  expect(violations, JSON.stringify(violations, null, 2)).toEqual([]);
});

test('whats-new cover has one atlas and no duplicated group-card grid or BOM snippet', async ({page}) => {
  await page.goto('/docs/features/whats-new');
  await expect(page.locator('#capability-atlas-title')).toHaveCount(1);
  await expect(page.locator('.doc-card-grid')).toHaveCount(0);
  await expect(page.getByText('shaft-bom', {exact: true})).toHaveCount(0);
});

test('atlas and trace rail have no detectable WCAG A or AA violations', async ({page}) => {
  for (const path of ['/docs/features/whats-new', '/docs/features/whats-new/capture']) {
    await page.goto(path);
    const {violations} = await new AxeBuilder({page}).withTags([
      'wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22a', 'wcag22aa',
    ]).analyze();
    expect(violations, `${path}\n${JSON.stringify(violations, null, 2)}`).toEqual([]);
  }
});
