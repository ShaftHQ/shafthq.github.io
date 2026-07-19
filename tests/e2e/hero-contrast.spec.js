const {expect, test} = require('@playwright/test');

// Regression guard for #837: `.heroBrand` (the "SHAFT" wordmark) sits on the hero's
// composited/gradient background (src/pages/index.module.css .hero), which
// tests/design-contrast.test.js structurally cannot model -- that test only audits
// solid (fg token, bg token) pairs parsed straight out of src/css/custom.css, and has
// no way to represent "the actual blended pixel color behind this element" for a
// multi-layer gradient background. This test closes that gap by rendering the real
// homepage and pixel-sampling the actual composited output via Playwright screenshot +
// canvas getImageData, the same technique used to originally discover the failure.

function relativeLuminance({r, g, b}) {
  const channel = (c) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  };
  const [rl, gl, bl] = [r, g, b].map(channel);
  return 0.2126 * rl + 0.7152 * gl + 0.0722 * bl;
}

function contrastRatio(a, b) {
  const lA = relativeLuminance(a);
  const lB = relativeLuminance(b);
  const [lighter, darker] = lA >= lB ? [lA, lB] : [lB, lA];
  return (lighter + 0.05) / (darker + 0.05);
}

// WCAG 2.x SC 1.4.3: 3:1 for text >=24px, or >=18.66px (14pt) at bold (>=700) weight;
// 4.5:1 otherwise. Computed dynamically (not hardcoded) so a future font-size/weight
// change that drops the wordmark out of the "large text" exemption is also caught.
function requiredRatio(fontSizePx, fontWeight) {
  const isBold = fontWeight >= 700;
  const isLarge = fontSizePx >= 24 || (isBold && fontSizePx >= 18.66);
  return isLarge ? 3 : 4.5;
}

async function measureHeroBrandContrast(page) {
  const glyph = await page.evaluate(() => {
    const el = document.querySelector('a[class*="heroBrand"]');
    const rect = el.getBoundingClientRect();
    const style = getComputedStyle(el);
    const colorMatch = style.color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
    return {
      rect: {x: rect.x, y: rect.y, width: rect.width, height: rect.height},
      fg: {r: +colorMatch[1], g: +colorMatch[2], b: +colorMatch[3]},
      fontSizePx: parseFloat(style.fontSize),
      fontWeight: parseFloat(style.fontWeight),
    };
  });

  const screenshot = (await page.screenshot()).toString('base64');

  // Sample the plate background at the horizontal midpoint of the top and bottom
  // padding rows: safely inside the pill's straight (non-rounded) edge and clear of
  // the glyph ink, regardless of the wordmark's exact letterforms.
  const bg = await page.evaluate(async ({screenshot, rect}) => {
    const img = new Image();
    img.src = `data:image/png;base64,${screenshot}`;
    await new Promise((resolve, reject) => {
      img.onload = resolve;
      img.onerror = reject;
    });
    const canvas = document.createElement('canvas');
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0);

    const pixelAt = (x, y) => {
      const d = ctx.getImageData(Math.round(x), Math.round(y), 1, 1).data;
      return {r: d[0], g: d[1], b: d[2]};
    };

    const midX = rect.x + rect.width / 2;
    return [pixelAt(midX, rect.y + 2), pixelAt(midX, rect.y + rect.height - 2)];
  }, {screenshot, rect: glyph.rect});

  const bgAvg = {
    r: (bg[0].r + bg[1].r) / 2,
    g: (bg[0].g + bg[1].g) / 2,
    b: (bg[0].b + bg[1].b) / 2,
  };

  return {
    ratio: contrastRatio(glyph.fg, bgAvg),
    required: requiredRatio(glyph.fontSizePx, glyph.fontWeight),
    fg: glyph.fg,
    bg: bgAvg,
  };
}

test('hero wordmark clears WCAG AA contrast against its real composited background', async ({page}) => {
  await page.setViewportSize({width: 1280, height: 900});

  await page.goto('/');
  const light = await measureHeroBrandContrast(page);
  expect(
    light.ratio,
    `light theme: fg rgb(${light.fg.r},${light.fg.g},${light.fg.b}) on measured bg ` +
      `rgb(${light.bg.r.toFixed(1)},${light.bg.g.toFixed(1)},${light.bg.b.toFixed(1)}) = ` +
      `${light.ratio.toFixed(2)}:1, needs >= ${light.required}:1`,
  ).toBeGreaterThanOrEqual(light.required);

  await page.getByLabel(/Switch between dark and light mode/).click();
  await page.waitForTimeout(200);
  const dark = await measureHeroBrandContrast(page);
  expect(
    dark.ratio,
    `dark theme: fg rgb(${dark.fg.r},${dark.fg.g},${dark.fg.b}) on measured bg ` +
      `rgb(${dark.bg.r.toFixed(1)},${dark.bg.g.toFixed(1)},${dark.bg.b.toFixed(1)}) = ` +
      `${dark.ratio.toFixed(2)}:1, needs >= ${dark.required}:1`,
  ).toBeGreaterThanOrEqual(dark.required);
});
