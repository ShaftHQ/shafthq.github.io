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
