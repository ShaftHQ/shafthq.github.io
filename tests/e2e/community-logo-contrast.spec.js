const {expect, test} = require('@playwright/test');
const fs = require('node:fs');
const path = require('node:path');

const WIDTHS = [360, 390, 768, 1280, 1920];
const THEMES = ['light', 'dark'];
const HEIGHT = 900;
const outDir = path.join(__dirname, '../../audit/logo-contrast/matrix');
fs.mkdirSync(outDir, {recursive: true});

const PROBLEM = ['iHorizons', 'Salt Bank', 'EFG Holding', 'InnovationTeam'];

async function setTheme(page, theme) {
  await page.emulateMedia({colorScheme: theme, reducedMotion: 'reduce'});
}

async function gotoThemed(page, theme) {
  await setTheme(page, theme);
  await page.goto(`/?docusaurus-theme=${theme}`);
  await expect(page.locator('html')).toHaveAttribute('data-theme', theme);
  // Open community details if collapsed
  const details = page.locator('[class*="communityDetails"]').first();
  if (await details.count()) {
    const open = await details.getAttribute('open');
    if (open === null) {
      await details.locator('summary').click();
    }
  }
}

test.describe('community logo contrast matrix', () => {
  for (const width of WIDTHS) {
    for (const theme of THEMES) {
      test(`logos visible ${width} ${theme}`, async ({page}) => {
        await page.setViewportSize({width, height: HEIGHT});
        await gotoThemed(page, theme);
        const grid = page.locator('[class*="communityLogos"]');
        await expect(grid).toBeVisible();
        await grid.scrollIntoViewIfNeeded();

        // Every tile image has non-trivial painted ink vs tile (canvas sample)
        const report = await page.evaluate(async () => {
          const tileBg = getComputedStyle(document.querySelector('[class*="communityLogos"] a')).backgroundColor;
          const anchors = [...document.querySelectorAll('[class*="communityLogos"] a')];
          const rows = [];
          for (const a of anchors) {
            const name = (a.querySelector('span')?.textContent || '').trim();
            const img = a.querySelector('img');
            if (!img) {
              rows.push({name, ok: false, reason: 'NO_IMG'});
              continue;
            }
            await new Promise((resolve, reject) => {
              if (img.complete && img.naturalWidth) resolve();
              else {
                img.onload = () => resolve();
                img.onerror = () => reject(new Error('img error ' + name));
              }
            }).catch(() => undefined);
            const canvas = document.createElement('canvas');
            const w = Math.max(1, img.naturalWidth || img.width);
            const h = Math.max(1, img.naturalHeight || img.height);
            canvas.width = w;
            canvas.height = h;
            const ctx = canvas.getContext('2d', {willReadFrequently: true});
            ctx.drawImage(img, 0, 0);
            let data;
            try {
              data = ctx.getImageData(0, 0, w, h).data;
            } catch (e) {
              rows.push({name, ok: false, reason: 'TAINTED'});
              continue;
            }
            // Relative luminance helpers
            const lum = (r, g, b) => {
              const f = (c) => {
                c /= 255;
                return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
              };
              return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
            };
            const contrast = (l1, l2) => {
              const a = Math.max(l1, l2);
              const b = Math.min(l1, l2);
              return (a + 0.05) / (b + 0.05);
            };
            // Tile is light; parse rgb()
            const m = tileBg.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
            const bg = m ? [+m[1], +m[2], +m[3]] : [255, 255, 255];
            const Lbg = lum(...bg);
            let ink = 0;
            let fail = 0;
            let sum = 0;
            for (let i = 0; i < data.length; i += 4) {
              const a = data[i + 3];
              if (a < 128) continue;
              const L = lum(data[i], data[i + 1], data[i + 2]);
              ink += 1;
              sum += L;
              if (contrast(L, Lbg) < 3) fail += 1;
            }
            if (!ink) {
              rows.push({name, ok: false, reason: 'NO_INK', tileBg});
              continue;
            }
            const meanC = contrast(sum / ink, Lbg);
            const failFrac = fail / ink;
            rows.push({name, ok: meanC >= 3 && failFrac <= 0.55, meanC: +meanC.toFixed(2), failFrac: +failFrac.toFixed(3), ink, tileBg});
          }
          return rows;
        });

        fs.writeFileSync(path.join(outDir, `report-${width}-${theme}.json`), JSON.stringify(report, null, 2));
        const shot = path.join(outDir, `grid-${width}-${theme}.png`);
        await grid.screenshot({path: shot});

        const fails = report.filter((r) => !r.ok);
        expect(fails, JSON.stringify(fails, null, 2)).toEqual([]);

        for (const name of PROBLEM) {
          const row = report.find((r) => r.name === name);
          expect(row, name).toBeTruthy();
          expect(row.ok, name + ' ' + JSON.stringify(row)).toBe(true);
        }
      });
    }
  }

  test('mobile emulation pixel-5 light+dark', async ({browser}) => {
    for (const theme of THEMES) {
      const context = await browser.newContext({
        ...require('@playwright/test').devices['Pixel 5'],
        colorScheme: theme,
      });
      const page = await context.newPage();
      await page.goto(`/?docusaurus-theme=${theme}`);
      await expect(page.locator('html')).toHaveAttribute('data-theme', theme);
      const details = page.locator('[class*="communityDetails"]').first();
      if (await details.count()) {
        const open = await details.getAttribute('open');
        if (open === null) await details.locator('summary').click();
      }
      const grid = page.locator('[class*="communityLogos"]');
      await grid.scrollIntoViewIfNeeded();
      await grid.screenshot({path: path.join(outDir, `grid-pixel5-${theme}.png`)});
      // Focus problem tiles
      for (const name of PROBLEM) {
        const tile = page.locator('[class*="communityLogos"] a', {hasText: name});
        await tile.screenshot({path: path.join(outDir, `tile-pixel5-${theme}-${name.replace(/\s+/g, '-')}.png`)});
      }
      await context.close();
    }
  });
});
