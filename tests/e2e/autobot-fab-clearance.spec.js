const {expect, test, devices} = require('@playwright/test');
const fs = require('node:fs');
const path = require('node:path');

const WIDTHS = [360, 390, 768, 1280, 1920];
const THEMES = ['light', 'dark'];
const outDir = path.join(__dirname, '../../audit/fab-clearance');
fs.mkdirSync(outDir, {recursive: true});

async function openCommunity(page) {
  const details = page.locator('[class*="communityDetails"]').first();
  if (await details.count()) {
    const open = await details.getAttribute('open');
    if (open === null) await details.locator('summary').click();
  }
}

async function measureOverlap(page) {
  return page.evaluate(() => {
    const fabEl = document.querySelector('[class*="autoBotContainer"]');
    if (!fabEl) return {fabFound: false, hits: []};
    const fr = fabEl.getBoundingClientRect();
    const hits = [];
    for (const a of document.querySelectorAll('[class*="communityLogos"] a')) {
      const r = a.getBoundingClientRect();
      const ox = Math.max(0, Math.min(fr.right, r.right) - Math.max(fr.left, r.left));
      const oy = Math.max(0, Math.min(fr.bottom, r.bottom) - Math.max(fr.top, r.top));
      if (ox > 0 && oy > 0) {
        hits.push({
          name: (a.querySelector('span')?.textContent || '').trim(),
          ox: +ox.toFixed(1),
          oy: +oy.toFixed(1),
        });
      }
    }
    return {fabFound: true, hits, fab: {w: +fr.width.toFixed(1), h: +fr.height.toFixed(1)}};
  });
}

test.describe('AutoBot FAB clearance vs community grid', () => {
  for (const width of WIDTHS) {
    for (const theme of THEMES) {
      test(`no FAB/tile overlap at bottom ${width} ${theme}`, async ({page}) => {
        await page.setViewportSize({width, height: 900});
        await page.emulateMedia({colorScheme: theme, reducedMotion: 'reduce'});
        await page.goto(`/?docusaurus-theme=${theme}`);
        await expect(page.locator('html')).toHaveAttribute('data-theme', theme);
        await openCommunity(page);
        await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
        await page.waitForTimeout(300);
        const overlap = await measureOverlap(page);
        fs.writeFileSync(
          path.join(outDir, `overlap-${width}-${theme}.json`),
          JSON.stringify(overlap, null, 2),
        );
        expect(overlap.fabFound, 'FAB present').toBe(true);
        expect(overlap.fab.w, 'FAB still sized').toBeGreaterThan(40);
        expect(overlap.hits, JSON.stringify(overlap.hits)).toEqual([]);
      });
    }
  }

  test('Pixel 5: EFG/InnovationTeam clear when scrolled into FAB corner', async ({browser}) => {
    for (const theme of THEMES) {
      const context = await browser.newContext({
        ...devices['Pixel 5'],
        colorScheme: theme,
      });
      const page = await context.newPage();
      await page.goto(`/?docusaurus-theme=${theme}`);
      await openCommunity(page);
      for (const name of ['EFG Holding', 'InnovationTeam']) {
        await page.evaluate((n) => {
          const a = [...document.querySelectorAll('[class*="communityLogos"] a')].find((el) =>
            (el.querySelector('span')?.textContent || '').includes(n.split(' ')[0]),
          );
          const fab = document.querySelector('[class*="autoBotContainer"]');
          if (!a || !fab) return;
          const fr = fab.getBoundingClientRect();
          const r = a.getBoundingClientRect();
          window.scrollTo(0, Math.max(0, window.scrollY + r.bottom - fr.top - fr.height * 0.4));
        }, name);
        await page.waitForTimeout(250);
        const overlap = await measureOverlap(page);
        fs.writeFileSync(
          path.join(outDir, `align-${name.replace(/\s+/g, '-')}-${theme}.json`),
          JSON.stringify(overlap, null, 2),
        );
        await page.screenshot({
          path: path.join(outDir, `align-${name.replace(/\s+/g, '-')}-${theme}.png`),
          fullPage: false,
        });
        expect(overlap.hits.filter((h) => h.name.includes(name.split(' ')[0])), JSON.stringify(overlap)).toEqual([]);
      }
      await context.close();
    }
  });
});
