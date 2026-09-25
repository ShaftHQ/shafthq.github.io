// @ts-check
// Issues #1078 and #1079: the upgrade and local-infrastructure guides are
// split by Diátaxis page type. The overview URLs are unchanged, every old
// in-page anchor forwards to the section's new page, and the new pages are
// reachable from the sidebar.
const {test, expect} = require('@playwright/test');
const movedAnchors = require('../../src/data/moved-anchors.json');

// Instant scrolling keeps the landing-position check deterministic; the
// HashTargetScrollSync corrections in src/theme/Root.tsx still run.
test.use({reducedMotion: 'reduce'});

const guides = [
  {
    overview: '/docs/start/upgrade',
    h1: 'Upgrade to modular SHAFT',
    pages: ['/docs/start/upgrade/run', '/docs/start/upgrade/how-it-works', '/docs/start/upgrade/reference'],
    moved: movedAnchors.upgrade,
  },
  {
    overview: '/docs/start/local-infrastructure',
    h1: 'Set up local infrastructure',
    pages: [
      '/docs/start/local-infrastructure/mobile',
      '/docs/start/local-infrastructure/services',
      '/docs/start/local-infrastructure/previews',
      '/docs/start/local-infrastructure/reference',
    ],
    moved: movedAnchors.localInfrastructure,
  },
];

for (const guide of guides) {
  test(`${guide.overview} stays a short overview that links every page in the guide`, async ({page}) => {
    await page.goto(guide.overview);
    await expect(page.locator('article h1')).toHaveText(guide.h1);
    const headings = await page.locator('article h2').count();
    expect(headings, 'overview keeps only a handful of sections').toBeLessThanOrEqual(6);
    for (const path of guide.pages) {
      await expect(page.locator(`article a[href="${path}"]`).first(), `overview links ${path}`).toBeVisible();
      await expect(page.locator(`nav.menu a[href="${path}"]`).first(), `sidebar lists ${path}`).toBeAttached();
    }
  });

  test(`every old ${guide.overview} anchor forwards to its new page`, async ({page}) => {
    test.setTimeout(180_000);
    const entries = Object.entries(guide.moved);
    expect(entries.length).toBeGreaterThan(10);
    for (const [oldId, target] of entries) {
      await page.goto(`${guide.overview}#${oldId}`);
      const [targetPath, targetHash] = target.split('#');
      await expect(page, `#${oldId} forwards`).toHaveURL(new RegExp(`${targetPath}${targetHash ? `#${targetHash}` : ''}$`));
      if (targetHash) await expect(page.locator(`[id="${targetHash}"]`), `#${targetHash} is scrolled into view`).toBeInViewport({timeout: 10_000});
    }
  });
}
