const {expect, test} = require('@playwright/test');
const fs = require('node:fs');
const path = require('node:path');

const WIDTHS = [320, 360, 390, 414, 430, 768, 1024, 1280, 1440, 1920];
const THEMES = ['light', 'dark'];
const HEIGHT = 900;
const outDir = path.join(__dirname, '../../audit/polish-matrix');
fs.mkdirSync(outDir, {recursive: true});

async function setTheme(page, theme) {
  await page.emulateMedia({colorScheme: theme, reducedMotion: 'reduce'});
}

async function gotoThemed(page, theme, path = '/') {
  await setTheme(page, theme);
  const sep = path.includes('?') ? '&' : '?';
  const ink = theme === 'dark' ? 'rgb(227, 227, 227)' : 'rgb(28, 30, 33)';
  for (let attempt = 0; attempt < 4; attempt += 1) {
    await page.goto(`${path}${sep}docusaurus-theme=${theme}`);
    await expect(page.locator('html')).toHaveAttribute('data-theme', theme);
    const settled = await page.evaluate(({ink: expected, theme}) => {
      const heading = document.getElementById('proof-heading');
      const faq = [...document.querySelectorAll('summary')].find((node) => /Java version/i.test(node.textContent || ''));
      const pre = document.querySelector('pre.prism-code');
      const bodyOk = getComputedStyle(document.body).color === expected;
      const headingOk = !!heading && getComputedStyle(heading).color === expected;
      const faqOk = !!faq && getComputedStyle(faq).color === expected;
      const preBg = pre ? getComputedStyle(pre).backgroundColor : '';
      const prismOk = theme === 'dark'
        ? preBg === 'rgb(40, 42, 54)'
        : preBg === 'rgb(246, 248, 250)';
      return bodyOk && headingOk && faqOk && prismOk;
    }, {ink, theme});
    if (settled) return;
    await page.waitForTimeout(150);
  }
  await expect.poll(async () => page.evaluate(({ink: expected, theme}) => {
    const heading = document.getElementById('proof-heading');
    const pre = document.querySelector('pre.prism-code');
    const preBg = pre ? getComputedStyle(pre).backgroundColor : '';
    const prismOk = theme === 'dark'
      ? preBg === 'rgb(40, 42, 54)'
      : preBg === 'rgb(246, 248, 250)';
    return !!heading && getComputedStyle(heading).color === expected && prismOk;
  }, {ink, theme})).toBe(true);
}

test.describe('landing polish matrix', () => {
  for (const width of WIDTHS) {
    for (const theme of THEMES) {
      test(`geometry ${width} ${theme}`, async ({page}, testInfo) => {
        await page.setViewportSize({width, height: HEIGHT});
        const errors = [];
        page.on('pageerror', (err) => errors.push(String(err)));
        page.on('console', (msg) => {
          if (msg.type() !== 'error') return;
          const text = msg.text();
          // WebKit warns on the standard interactive-widget viewport key; not a page defect.
          if (text.includes('interactive-widget') && text.includes('not recognized')) return;
          errors.push(text);
        });
        await gotoThemed(page, theme);
        const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1);
        expect(overflow, 'horizontal overflow').toBe(false);
        for (const id of ['landing-hero-create-project', 'landing-hero-documentation']) {
          const box = await page.getByTestId(id).boundingBox();
          expect(box, id).not.toBeNull();
          if (width <= 1440) expect(box.y + box.height).toBeLessThanOrEqual(HEIGHT - 24);
        }
        // Tab affordance on small phones
        if (width <= 430) {
          const metrics = await page.getByRole('tablist', {name: 'Testing surfaces'}).evaluate((el) => ({
            scrollWidth: el.scrollWidth,
            clientWidth: el.clientWidth,
          }));
          if (metrics.scrollWidth > metrics.clientWidth + 2) {
            const mask = await page.getByRole('tablist', {name: 'Testing surfaces'}).evaluate((el) => getComputedStyle(el).maskImage || getComputedStyle(el).webkitMaskImage);
            expect(mask && mask !== 'none').toBeTruthy();
          }
        }
        // Mobile proof thumb (P2-01): at least one evidence image visible in workflow
        if (width <= 760) {
          await page.getByTestId('landing-agent-workflow').scrollIntoViewIfNeeded();
          const visibleCount = await page.locator('[data-testid="landing-agent-workflow"] img').evaluateAll((imgs) =>
            imgs.filter((img) => {
              const style = getComputedStyle(img);
              const rect = img.getBoundingClientRect();
              return style.display !== 'none' && style.visibility !== 'hidden' && rect.width > 0 && rect.height > 0;
            }).length
          );
          expect(visibleCount).toBeGreaterThanOrEqual(1);
        }
        // Footer: no duplicate Slack in landing band
        await expect(page.getByTestId('landing-footer').getByRole('link', {name: 'Slack'})).toHaveCount(0);
        await expect(page.locator('footer.footer, .theme-layout-footer').getByRole('link', {name: 'Slack'})).toHaveCount(1);
        // brand H1
        await expect(page.getByRole('heading', {level: 1})).toContainText('Write the test.');
        // CLS proxy: layout shift observer quick sample
        const cls = await page.evaluate(() => new Promise((resolve) => {
          let score = 0;
          const observer = new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) {
              if (!entry.hadRecentInput) score += entry.value;
            }
          });
          observer.observe({type: 'layout-shift', buffered: true});
          setTimeout(() => { observer.disconnect(); resolve(score); }, 500);
        }));
        expect(cls).toBeLessThanOrEqual(0.01);
        expect(errors, `console/page errors @${width}/${theme}: ${errors.join(' | ')}`).toEqual([]);
        if ([390, 1440].includes(width)) {
          const shot = path.join(outDir, `${testInfo.project.name}-${theme}-${width}-fold.png`);
          await page.screenshot({path: shot, fullPage: false});
        }
      });
    }
  }

  test('axe gated cells', async ({page}, testInfo) => {
    const AxeBuilder = require('@axe-core/playwright').default;
    for (const width of [390, 1440]) {
      for (const theme of THEMES) {
        await page.setViewportSize({width, height: HEIGHT});
        await gotoThemed(page, theme);
        const results = await new AxeBuilder({page}).withTags(['wcag2a', 'wcag2aa', 'best-practice']).analyze();
        expect(results.violations, JSON.stringify(results.violations, null, 2)).toEqual([]);
      }
    }
  });

  test('community hrefs reachable from DOM', async ({page}) => {
    await page.goto('/');
    await page.getByTestId('landing-footer').locator('summary').click();
    const hrefs = await page.getByTestId('landing-footer').locator('.communityLogos a, a').evaluateAll((nodes) =>
      [...new Set(nodes.map((n) => n.href).filter((h) => /^https?:/.test(h)))]
    );
    // Prefer reportedUse tiles only
    const tileHrefs = await page.locator('[data-testid="landing-footer"] details a[href^="http"]').evaluateAll((nodes) => nodes.map((n) => n.href));
    expect(tileHrefs.length).toBeGreaterThanOrEqual(20);
    expect(tileHrefs.some((h) => h.includes('euronet.com'))).toBeTruthy();
    expect(tileHrefs.some((h) => h.includes('solutionsbystc'))).toBeTruthy();
    expect(tileHrefs.some((h) => h.includes('hrsd.gov.sa'))).toBeTruthy();
    expect(tileHrefs.some((h) => h.includes('innovationteam.com'))).toBeTruthy();
    expect(tileHrefs.some((h) => h.includes('euronetworldwide.com'))).toBeFalsy();
    expect(tileHrefs.some((h) => h.includes('solutions.com.sa'))).toBeFalsy();
  });
});
