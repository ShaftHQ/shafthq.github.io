const {expect, test} = require('@playwright/test');

// Regression guard for #837 and #851. Several elements render text over a
// composited/blended background (a multi-layer CSS gradient, a translucent
// rgba() fill stacked on one, or an element's own opaque fill sitting on a
// gradient ancestor) that tests/design-contrast.test.js structurally cannot
// audit -- that test only checks solid (fg token, bg token) pairs parsed
// straight out of src/css/custom.css, with no way to represent "the actual
// blended pixel color behind this element" once gradients/opacity/an element's
// own fill are involved. Guards here cover the elements #851's full-page audit
// found most at risk of a silent regression:
//
//   - `.heroBrand` (src/pages/index.module.css .heroBrand) -- the "SHAFT"
//     wordmark on `.hero`'s composited gradient/glow background. (#837)
//   - `.statusChip` (src/pages/index.module.css .statusChip) -- the "Pass" /
//     "evidence attached" pill, whose own rgba(primary, 0.1) fill sits on
//     `.codePanel`/`.handledPanel`'s deep-alt background. (#837)
//   - `.audienceLane h3` (src/pages/index.module.css .audienceLane) -- lane
//     titles on a translucent rgba(deep-alt, 0.5) fill over `.audienceSection`'s
//     deep-to-deep-alt gradient. Demoted from h2 to h3 in #898 finding 23, once
//     AudienceSection gained its own section-level h2.
//   - `.eyebrow` (src/pages/index.module.css .eyebrow) -- section kicker labels
//     ("Guided paths", "Testing surfaces", etc.) on the normal flipping Infima
//     page background layered with a subtle primary-tinted gradient. Found
//     genuinely failing in light theme (~1.3-1.5:1) during #851's audit --
//     `--site-color-muted` is designed for the fixed-dark deep/deep-alt family,
//     not this flipping background. Repointed to `--ifm-color-emphasis-800`.
//   - `.heroMeta` span (src/pages/index.module.css .heroMeta) -- the
//     "io.github.shafthq : shaft-engine" coordinates line (trimmed to just the
//     coordinate in #898 finding 29, since Java 25/MIT/Allure native already
//     live in .footerBadges with more detail), a
//     translucent rgba(muted, 0.82) fill on `.hero`'s composited background.
//   - `.finalKicker` (src/pages/index.module.css .finalKicker) -- the
//     "run complete · evidence attached · exit 0" line on `.finalCta`'s
//     composited gradient/glow background (the same "always-dark" family as
//     `.hero`, with its own radial-gradient glow layer).
//   - hero `button--primary` CTA ("Start a new project") -- an element with
//     its OWN opaque solid fill (Infima's button background, unrelated to the
//     `--site-color-*` palette) sitting on `.hero`'s composited background;
//     included because that "own opaque fill on a gradient ancestor" shape
//     caused a real sampling bug during #851's audit (sampling just outside
//     the button's box reads the hero backdrop, not the button's actual fill)
//     and is worth guarding against the same mistake recurring.
//
// This closes that gap by rendering the real homepage and pixel-sampling the
// actual composited output via Playwright screenshot + canvas getImageData --
// the same technique used to originally discover the `.heroBrand` failure
// (issue #837) and to run the full-page audit (#851).

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
// 4.5:1 otherwise. Computed dynamically from the real measured font metrics (not
// hardcoded) so a future font-size/weight change that crosses the large-text
// exemption boundary is also caught, in either direction.
function requiredRatio(fontSizePx, fontWeight) {
  const isBold = fontWeight >= 700;
  const isLarge = fontSizePx >= 24 || (isBold && fontSizePx >= 18.66);
  return isLarge ? 3 : 4.5;
}

// Measures the real rendered contrast of `selector`'s text against the actual
// composited pixels behind it. `samplePoints(rect)` returns CSS-px viewport
// coordinates -- picked per element to land on background and clear of glyph
// ink/rounded corners (see each call site). Each point is averaged over a
// small block (not a single pixel) to damp getImageData's 8-bit quantization
// noise, which otherwise swings near-threshold ratios by several hundredths.
async function measureContrast(page, selector, samplePoints) {
  const locator = page.locator(selector).first();
  await locator.scrollIntoViewIfNeeded();

  // Sections below the hero use a scroll-triggered reveal (`[data-reveal]` /
  // `.reveal`, src/pages/index.module.css:971-991): opacity 0 -> 1 over a
  // 540ms transition (plus up to 240ms of stagger delay) once scrolled into
  // view. Sampling before that settles reads a still-fading-in (or, on a
  // fresh page load, still fully transparent/white) element instead of its
  // real composited color. Poll for the reveal to finish instead of guessing
  // a fixed wait, matching tests/e2e/homepage.spec.js's own reveal-state checks.
  await expect.poll(() =>
    locator.evaluate((el) => {
      const revealRoot = el.closest('[data-reveal]');
      return revealRoot ? getComputedStyle(revealRoot).opacity : '1';
    }),
  ).toBe('1');

  const info = await locator.evaluate((el) => {
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

  const screenshot = (await page.screenshot({
    animations: 'disabled',
    scale: 'css',
  })).toString('base64');
  const points = samplePoints(info.rect);

  const bgSamples = await page.evaluate(async ({screenshot, points}) => {
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

    const blockSize = 6;
    return points.map(({x, y}) => {
      const d = ctx.getImageData(
        Math.round(x - blockSize / 2),
        Math.round(y - blockSize / 2),
        blockSize,
        blockSize,
      ).data;
      let r = 0, g = 0, b = 0;
      const n = d.length / 4;
      for (let i = 0; i < d.length; i += 4) {
        r += d[i]; g += d[i + 1]; b += d[i + 2];
      }
      return {r: r / n, g: g / n, b: b / n};
    });
  }, {screenshot, points});

  const bg = {
    r: bgSamples.reduce((s, p) => s + p.r, 0) / bgSamples.length,
    g: bgSamples.reduce((s, p) => s + p.g, 0) / bgSamples.length,
    b: bgSamples.reduce((s, p) => s + p.b, 0) / bgSamples.length,
  };

  return {
    ratio: contrastRatio(info.fg, bg),
    required: requiredRatio(info.fontSizePx, info.fontWeight),
    fg: info.fg,
    bg,
  };
}

async function assertClearsContrast(page, label, selector, samplePoints) {
  const light = await measureContrast(page, selector, samplePoints);
  expect(
    light.ratio,
    `[light] ${label}: fg rgb(${light.fg.r},${light.fg.g},${light.fg.b}) on measured bg ` +
      `rgb(${light.bg.r.toFixed(1)},${light.bg.g.toFixed(1)},${light.bg.b.toFixed(1)}) = ` +
      `${light.ratio.toFixed(2)}:1, needs >= ${light.required}:1`,
  ).toBeGreaterThanOrEqual(light.required);

  await page.getByLabel(/Switch between dark and light mode/).click();
  await page.waitForTimeout(200);

  const dark = await measureContrast(page, selector, samplePoints);
  expect(
    dark.ratio,
    `[dark] ${label}: fg rgb(${dark.fg.r},${dark.fg.g},${dark.fg.b}) on measured bg ` +
      `rgb(${dark.bg.r.toFixed(1)},${dark.bg.g.toFixed(1)},${dark.bg.b.toFixed(1)}) = ` +
      `${dark.ratio.toFixed(2)}:1, needs >= ${dark.required}:1`,
  ).toBeGreaterThanOrEqual(dark.required);
}

// Default sampler for plain text with no background of its own: a thin sliver
// just above and below the element's box, at horizontal center. Safe whenever
// the element isn't its own filled/padded box (the common case: text painted
// directly on an ancestor section's background).
function adjacentSampler(rect) {
  const cx = rect.x + rect.width / 2;
  return [{x: cx, y: rect.y - 4}, {x: cx, y: rect.y + rect.height + 4}];
}

// Sampler for elements with their OWN filled box (button chrome, pill plates):
// sampling just outside the box would read the ancestor's (different)
// background instead of the element's real fill. Samples the left/right
// padding gutters at vertical mid-height, inset far enough to clear icons/text.
function interiorSampler(inset) {
  return (rect) => {
    const midY = rect.y + rect.height / 2;
    return [{x: rect.x + inset, y: midY}, {x: rect.x + rect.width - inset, y: midY}];
  };
}

// Composites `fg` (with alpha) over `bg` using the standard "over" formula.
function compositeOver(fg, bg) {
  return {
    r: fg.r * fg.a + bg.r * (1 - fg.a),
    g: fg.g * fg.a + bg.g * (1 - fg.a),
    b: fg.b * fg.a + bg.b * (1 - fg.a),
  };
}

// Regression guard for #898 finding 14. Measures the hero/final secondary
// button's border -- a UI component boundary under WCAG 1.4.11 (>=3:1
// against the adjacent surrounding color) -- without needing sub-pixel
// screenshot sampling of the 1px stroke itself (the existing 6x6-block
// averaging used elsewhere in this file would blur a 1px line into the
// fill/background either side of it). Instead: read the border's own rgba
// color (a flat, non-gradient value) via getComputedStyle, sample the real
// composited backdrop just outside the button's box, then composite the
// border color over that background analytically and measure contrast
// against the same background -- i.e. the boundary color vs. its adjacent
// color, which is exactly what 1.4.11 asks for.
async function measureBorderContrast(page, selector) {
  const locator = page.locator(selector).first();
  await locator.scrollIntoViewIfNeeded();

  const info = await locator.evaluate((el) => {
    const rect = el.getBoundingClientRect();
    const style = getComputedStyle(el);
    const borderMatch = style.borderTopColor.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
    return {
      rect: {x: rect.x, y: rect.y, width: rect.width, height: rect.height},
      border: {
        r: +borderMatch[1],
        g: +borderMatch[2],
        b: +borderMatch[3],
        a: borderMatch[4] !== undefined ? +borderMatch[4] : 1,
      },
    };
  });

  // Sample the hero backdrop just above the button: clear of the button's
  // own fill/border/box-shadow and of any neighbouring button.
  const bgPoint = {x: info.rect.x + info.rect.width / 2, y: info.rect.y - 10};

  const screenshot = (await page.screenshot({
    animations: 'disabled',
    scale: 'css',
  })).toString('base64');
  const bg = await page.evaluate(async ({screenshot, point}) => {
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
    const blockSize = 6;
    const d = ctx.getImageData(
      Math.round(point.x - blockSize / 2),
      Math.round(point.y - blockSize / 2),
      blockSize,
      blockSize,
    ).data;
    let r = 0, g = 0, b = 0;
    const n = d.length / 4;
    for (let i = 0; i < d.length; i += 4) {
      r += d[i]; g += d[i + 1]; b += d[i + 2];
    }
    return {r: r / n, g: g / n, b: b / n};
  }, {screenshot, point: bgPoint});

  const compositedBorder = compositeOver(info.border, bg);
  return {ratio: contrastRatio(compositedBorder, bg), border: info.border, bg};
}

test.beforeEach(async ({page}) => {
  await page.setViewportSize({width: 1280, height: 900});
  await page.goto('/');
});

test('hero wordmark clears WCAG AA contrast against its real composited background', async ({page}) => {
  // Sample the plate's horizontal padding gutters (before "S" / after "T") at
  // vertical mid-height: at the pill's vertical center the `border-radius: 999px`
  // curvature hasn't cut in yet (rounding only bites near the top/bottom), so
  // this stays on the flat solid plate and clear of the glyph ink regardless of
  // sample-block size.
  const samplePoints = (rect) => {
    const midY = rect.y + rect.height / 2;
    return [{x: rect.x + 4, y: midY}, {x: rect.x + rect.width - 4, y: midY}];
  };
  // Non-interactive span since #898 finding 29 (was a self-referential Link
  // from / to /); selector drops the `a` tag requirement accordingly.
  await assertClearsContrast(page, '.heroBrand', '[class*="heroBrand"]', samplePoints);
});

test('status chip clears WCAG AA contrast against its real composited background', async ({page}) => {
  // Sample the pill's left/right interior edges at vertical mid-height: inside
  // the rounded pill's straight side, clear of the short uppercase label.
  const samplePoints = (rect) => {
    const midY = rect.y + rect.height / 2;
    return [{x: rect.x + 3, y: midY}, {x: rect.x + rect.width - 3, y: midY}];
  };
  await assertClearsContrast(page, '.statusChip', '[class*="statusChip"]', samplePoints);
});

test('audience lane heading clears WCAG AA contrast against its real composited background', async ({page}) => {
  // The h3 is a block-level grid cell wider than its own text run; sample its
  // empty right-hand margin and a thin sliver above the cap-height, both clear
  // of the glyphs regardless of the lane's actual heading text.
  const samplePoints = (rect) => [
    {x: rect.x + rect.width - 5, y: rect.y + rect.height / 2},
    {x: rect.x + rect.width - 5, y: rect.y + 2},
  ];
  await assertClearsContrast(page, '.audienceLane h3', '[class*="audienceLane"] h3', samplePoints);
});

test('section eyebrow labels clear WCAG AA contrast against their real composited background', async ({page}) => {
  await assertClearsContrast(page, '.eyebrow', '[class*="eyebrow"]', adjacentSampler);
});

test('hero coordinates line clears WCAG AA contrast against its real composited background', async ({page}) => {
  await assertClearsContrast(page, '.heroMeta span', '[class*="heroMeta"] span', adjacentSampler);
});

test('final CTA kicker clears WCAG AA contrast against its real composited background', async ({page}) => {
  await assertClearsContrast(page, '.finalKicker', '[class*="finalKicker"]', adjacentSampler);
});

test('hero primary CTA clears WCAG AA contrast against its own button fill', async ({page}) => {
  await assertClearsContrast(
    page,
    'hero button--primary',
    '[data-testid="landing-hero-generator-cta"]',
    interiorSampler(10),
  );
});

test('hero secondary CTA border clears WCAG 1.4.11 non-text contrast (#898 finding 14)', async ({page}) => {
  const {ratio, border, bg} = await measureBorderContrast(page, '[data-testid="landing-hero-quickstart-cta"]');
  expect(
    ratio,
    `secondary button border rgba(${border.r},${border.g},${border.b},${border.a}) composited over measured bg ` +
      `rgb(${bg.r.toFixed(1)},${bg.g.toFixed(1)},${bg.b.toFixed(1)}) = ${ratio.toFixed(2)}:1, needs >= 3:1`,
  ).toBeGreaterThanOrEqual(3);
});

test('hero trust links clear WCAG AA text contrast against their real composited background (#898 finding 14)', async ({page}) => {
  await assertClearsContrast(page, '.heroTrustLinks a', '[class*="heroTrustLinks"] a', adjacentSampler);
});
