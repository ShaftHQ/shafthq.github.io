const {expect, test} = require('@playwright/test');

async function expectAnchorBelowNavbar(page, targetId) {
  const readGap = () => page.evaluate((id) => {
    const target = document.getElementById(id);
    const navbar = document.querySelector('.navbar');
    if (!target || !navbar) return NaN;
    return Math.round(target.getBoundingClientRect().top - navbar.getBoundingClientRect().bottom);
  }, targetId);

  // src/theme/Root.tsx's HashTargetScrollSync re-issues target.scrollIntoView()
  // at staggered delays (HASH_SCROLL_RETRY_DELAYS_MS = [0, 150, 450, 900]ms) to
  // correct the anchor position against async layout shifts after the hash
  // navigation. Each retry leaves its own short-lived "settled" plateau before
  // the next fires, so the gap swings through [8,120] transiently at an early
  // plateau (measured directly: 296 -> 504 -> 195 -> 80 -> ... -> 16) before
  // its true final value. Poll until two consecutive reads agree (the page has
  // actually stopped moving), not the first sample that happens to land in
  // range -- see the warm-up comment in the test below for the actual root
  // cause this is defending against.
  let previous = NaN;
  let stableGap;
  await expect.poll(async () => {
    const current = await readGap();
    const isStable = !Number.isNaN(current) && current === previous;
    previous = current;
    if (isStable) stableGap = current;
    return isStable;
  }).toBe(true);

  expect(stableGap).toBeGreaterThanOrEqual(8);
  expect(stableGap).toBeLessThanOrEqual(120);
}

test('landing page exposes clear onboarding links with stable hooks', async ({page}) => {
  // Root cause of #855's flake: this test navigates (via the hero install CTA)
  // to /docs/start/quick-start#new-project-generation, a page with a Mermaid
  // flowchart ("Workflow map") ABOVE the target heading. Mermaid renders
  // client-side after mount, and on a cold cache/JIT that first render can take
  // longer than HashTargetScrollSync's fixed 900ms retry budget (src/theme/
  // Root.tsx) -- when it does, the diagram finishes growing the page *after*
  // the last scroll retry has already fired, permanently leaving the target
  // ~480px further down than the scroll landed (confirmed empirically: with a
  // cold mermaid cache this reproduced 100% of the time; with mermaid
  // pre-warmed, 0/6). No amount of test-side waiting after the click fixes
  // this -- the site never re-scrolls once its retries are exhausted, so the
  // wrong position is permanent, not transient. Pre-warm mermaid's one-time
  // render cost with a throwaway visit before the real navigation, matching
  // what any returning visitor's browser cache would already have done.
  await page.goto('/docs/start/quick-start#new-project-generation');
  await expect(page.locator('.docusaurus-mermaid-container svg')).toBeVisible();

  await page.goto('/');

  await expect(page.getByTestId('landing-hero')).toBeVisible();
  await expect(page.getByRole('heading', {name: /Ship automation evidence, not boilerplate code/})).toBeVisible();
  // #898 finding 10: the hero -- including the page's only <h1> and every hero
  // CTA -- must be inside <main> so Docusaurus's "Skip to main content" link
  // (which resolves to main:first-of-type) actually lands on it.
  await expect(page.locator('main[data-testid="landing-main"] h1')).toHaveCount(1);
  await expect(page.locator('main[data-testid="landing-main"] [data-testid="landing-hero-install-cta"]')).toBeVisible();
  await expect(page.getByTestId('landing-command-center')).toHaveCount(0);
  await expect(page.getByTestId('landing-hero-signals')).toHaveCount(0);
  await expect(page.getByTestId('landing-audience-split')).toBeVisible();
  await expect(page.getByTestId('landing-hero-actions')).toBeVisible();
  await expect(page.getByTestId('landing-hero-star-cta')).toHaveAttribute('href', 'https://github.com/ShaftHQ/SHAFT_ENGINE');
  await expect(page.getByText(/Plain stack/)).toHaveCount(0);
  await expect(page.getByText(/With SHAFT/)).toHaveCount(0);
  await expect(page.getByText('mvn test')).toHaveCount(0);

  await Promise.all([
    page.waitForURL('**/docs/start/quick-start#new-project-generation'),
    page.getByTestId('landing-hero-install-cta').click(),
  ]);
  await expect(page).toHaveURL(/\/docs\/start\/quick-start#new-project-generation/);
  await expectAnchorBelowNavbar(page, 'new-project-generation');

  await page.goto('/');
  await Promise.all([
    page.waitForURL('**/docs/start/quick-start#choose-your-path'),
    page.getByTestId('landing-hero-quickstart-cta').click(),
  ]);
  await expect(page).toHaveURL(/\/docs\/start\/quick-start#choose-your-path/);

  await page.goto('/');
  const pathfinder = page.getByTestId('landing-pathfinder');
  await expect(pathfinder).toBeVisible();
  await expect(pathfinder.getByRole('link', {name: /Start a new SHAFT project/})).toHaveAttribute('href', '/docs/start/quick-start#new-project-generation');
  await expect(pathfinder.getByRole('link', {name: /Upgrade an existing project/})).toHaveAttribute('href', '/docs/start/quick-start#existing-project-upgrade');
  await expect(pathfinder.getByRole('link', {name: /Connect MCP after the basics/})).toHaveAttribute('href', '/docs/start/quick-start#mcp-integration');
  await expect(pathfinder.getByRole('link', {name: /Add coverage beyond the browser/})).toHaveAttribute('href', '#testing-surfaces');
  await expect(page.getByTestId('landing-cta-install')).toHaveAttribute('href', '/docs/start/quick-start#new-project-generation');
  await expect(page.getByTestId('landing-cta-slack')).toHaveAttribute('href', /^https:\/\/join\.slack\.com\/t\/shaft-engine\/.+$/);

  await page.goto('/');
  await expect(page.locator('#proof-section')).toBeVisible();
  await page.getByTestId('landing-code-proof').scrollIntoViewIfNeeded();
  await expect(page.getByTestId('landing-code-proof')).toBeVisible();
  await expect(page.getByTestId('landing-code-proof').locator('pre.language-java')).toBeVisible();
  await expect(page.getByTestId('landing-java-code')).toBeVisible();
  await expect(page.getByText('.and().click(checkout)')).toBeVisible();
  const codeProofVisuals = await page.getByTestId('landing-code-proof').evaluate((root) => {
    const codePanel = root.children[0];
    const handledPanel = root.children[1];
    const figcaption = codePanel.querySelector('figcaption');
    const handledTitle = handledPanel.querySelector('span');
    const tokenColors = Array.from(root.querySelectorAll('[data-testid="landing-java-code"] code span span'))
      .map((span) => getComputedStyle(span).color);

    return {
      copyButtons: root.querySelectorAll('button').length,
      titleTopDiff: Math.abs(figcaption.getBoundingClientRect().top - handledTitle.getBoundingClientRect().top),
      uniqueTokenColors: Array.from(new Set(tokenColors)).length,
    };
  });
  expect(codeProofVisuals.copyButtons).toBe(0);
  expect(codeProofVisuals.titleTopDiff).toBeLessThanOrEqual(2);
  expect(codeProofVisuals.uniqueTokenColors).toBeGreaterThanOrEqual(3);
  await page.getByTestId('landing-allure-evidence').scrollIntoViewIfNeeded();
  await expect(page.getByTestId('landing-allure-evidence').getByRole('img', {name: /Official Allure 3 demo report screenshot/})).toBeVisible();
  await expect(page.locator('#comparison-section')).toHaveCount(0);
  await expect(page.locator('#workflow-section')).toHaveCount(0);
  await expect(page.locator('#get-started')).toBeVisible();
  await expect(page.getByTestId('landing-footer')).toBeVisible();
});

test('landing page links to the canonical MCP command page', async ({page}) => {
  await page.goto('/');

  await page.getByTestId('landing-agent').scrollIntoViewIfNeeded();
  await expect(page.getByTestId('landing-agent-mcp-link')).toHaveAttribute('href', '/docs/agentic/mcp');
  await expect(page.locator('[data-testid^="mcp-app-"]')).toHaveCount(0);
  const loopAlignment = await page.getByTestId('landing-evidence-loop').evaluate((loop) => {
    const spread = (values) => Math.max(...values) - Math.min(...values);
    const cards = Array.from(loop.children);

    return {
      numbers: spread(cards.map((card) => card.querySelector('small').getBoundingClientRect().top)),
      titles: spread(cards.map((card) => card.querySelector('strong').getBoundingClientRect().top)),
      bodies: spread(cards.map((card) => card.querySelector('span').getBoundingClientRect().top)),
    };
  });
  expect(loopAlignment.numbers).toBeLessThanOrEqual(2);
  expect(loopAlignment.titles).toBeLessThanOrEqual(2);
  expect(loopAlignment.bodies).toBeLessThanOrEqual(2);
});

// Regression guard for #898 findings 12/13. .loopStep shares the same
// translateY(-3px) hover-lift as .pathCard/.proofCard, and [data-hover-glow]
// drives a 260ms scaling radial gradient on pointer move -- both must stop
// for users who asked for less motion, matching the reduced-motion handling
// already correct for .pathCard/.proofCard and ParticleBackground.
test('landing page neutralizes hover-lift and hover-glow motion under prefers-reduced-motion (#898 findings 12/13)', async ({page}) => {
  await page.emulateMedia({reducedMotion: 'reduce'});
  await page.goto('/');

  await page.getByTestId('landing-agent').scrollIntoViewIfNeeded();
  const loopStep = page.locator('[class*="loopStep"]').first();
  await loopStep.hover();
  await expect.poll(() => loopStep.evaluate((el) => getComputedStyle(el).transform)).toBe('none');

  const heroInstallCta = page.getByTestId('landing-hero-install-cta');
  await heroInstallCta.hover();
  const glowTransitionDuration = await heroInstallCta.evaluate(
    (el) => getComputedStyle(el, '::before').transitionDuration,
  );
  expect(glowTransitionDuration).toBe('0s');
});

// Regression guard for #898 finding 15. useScrollReveal previously indexed
// [data-reveal] elements globally across the whole document and capped the
// stagger delay at 240ms (Math.min(index * 34, 240)) -- so every group past
// the 8th element (all proof/path cards) popped in simultaneously instead of
// cascading. The fix computes each element's index within its own parent.
test('landing page computes the scroll-reveal stagger per section group, not globally (#898 finding 15)', async ({page}) => {
  await page.goto('/');
  const readDelay = (locator) => locator.evaluate((el) => el.style.getPropertyValue('--reveal-delay'));

  const proofCards = page.locator('[data-testid="landing-proof"] [data-reveal]');
  const pathCards = page.locator('[data-testid="landing-pathfinder"] [data-reveal]');
  await expect(proofCards).toHaveCount(3);
  await expect(pathCards).toHaveCount(5);

  const lastProofDelay = await readDelay(proofCards.last());
  const lastPathDelay = await readDelay(pathCards.last());

  // Under the old global-index code both of these sat well past index 7 and
  // would both have been capped identically at 240ms.
  expect(lastProofDelay).toBe('68ms');
  expect(lastPathDelay).toBe('136ms');
});

test('landing page keeps mobile motion and CTAs inside the viewport', async ({page}) => {
  await page.setViewportSize({width: 375, height: 844});
  await page.goto('/');

  await expect(page.getByTestId('landing-hero')).toBeVisible();
  await expect(page.locator('canvas[aria-hidden="true"]')).toHaveCount(2);
  await expect.poll(async () => {
    return page.locator('canvas[aria-hidden="true"]').first().evaluate((canvas) => {
      const context = canvas.getContext('2d');
      if (!context || canvas.width === 0 || canvas.height === 0) return false;
      const pixels = context.getImageData(0, 0, canvas.width, canvas.height).data;
      for (let index = 3; index < pixels.length; index += 40) {
        if (pixels[index] > 0) return true;
      }
      return false;
    });
  }).toBe(true);

  const overflowingButtons = await page.evaluate(() => {
    const viewportWidth = document.documentElement.clientWidth;
    return Array.from(document.querySelectorAll('[data-testid="landing-hero-actions"] a'))
      .map((link) => {
        const rect = link.getBoundingClientRect();
        const parentRect = link.parentElement.getBoundingClientRect();
        return {
          text: link.textContent.trim().replace(/\s+/g, ' '),
          width: rect.width,
          parentWidth: parentRect.width,
          overflows: rect.left < parentRect.left - 1 ||
            rect.right > parentRect.right + 1 ||
            rect.left < -1 ||
            rect.right > viewportWidth + 1,
          // #898 finding 21: height: 3.45rem -> min-height must mean a
          // wrapped two-line label no longer overflows its own button box.
          overflowsVertically: link.scrollHeight > link.clientHeight + 1,
        };
      })
      .filter((button) => button.overflows || button.width > button.parentWidth + 1 || button.overflowsVertically);
  });
  expect(overflowingButtons).toEqual([]);

  const pathfinderReveal = await page.getByTestId('landing-pathfinder').evaluate((section) => {
    const style = getComputedStyle(section);
    return {
      ready: document.documentElement.dataset.revealReady,
      transitionProperty: style.transitionProperty,
    };
  });
  expect(pathfinderReveal.ready).toBe('true');
  expect(pathfinderReveal.transitionProperty).toContain('opacity');

  await page.getByTestId('landing-surfaces').scrollIntoViewIfNeeded();
  await expect.poll(async () => {
    return page.getByTestId('landing-surfaces').evaluate((section) => getComputedStyle(section).opacity);
  }).toBe('1');

  await page.evaluate(() => window.scrollTo({top: 0, behavior: 'instant'}));
  await expect.poll(async () => {
    return page.getByTestId('landing-surfaces').evaluate((section) => ({
      opacity: getComputedStyle(section).opacity,
      state: section.getAttribute('data-reveal-state'),
    }));
  }).toEqual({opacity: '0', state: 'rolled-back'});
});

// Regression guard for #898 finding 21. The 761-900px band keeps the
// 3-column-turned-2-column CTA grid active (single-column starts at 760px)
// while each column is narrow enough to wrap a label like "Read quick
// start" -- previously unguarded, since the mobile check above only runs at
// 375px and only checked horizontal overflow.
test('landing page CTA buttons do not overflow when their label wraps at 800px (#898 finding 21)', async ({page}) => {
  await page.setViewportSize({width: 800, height: 900});
  await page.goto('/');

  const checkOverflow = async (testId) => page.evaluate((id) => {
    return Array.from(document.querySelectorAll(`[data-testid="${id}"] .button`))
      .map((button) => ({
        text: button.textContent.trim().replace(/\s+/g, ' '),
        overflowsVertically: button.scrollHeight > button.clientHeight + 1,
      }))
      .filter((button) => button.overflowsVertically);
  }, testId);

  expect(await checkOverflow('landing-hero-actions')).toEqual([]);
  await page.getByTestId('landing-final').scrollIntoViewIfNeeded();
  await expect.poll(() => page.getByTestId('landing-final').evaluate((el) => getComputedStyle(el).opacity)).toBe('1');
  expect(await checkOverflow('landing-final')).toEqual([]);
});

// Regression guard for #898 finding 19. The 5-column path/loop/badge grids
// previously collapsed straight from 5 columns to 1 at 980px, with no
// intermediate step -- leaving ~150px-wide cards in the 981-1180px band.
// A 1180px breakpoint now gives them a 2-column step first.
for (const width of [1000, 1100, 1180]) {
  test(`landing page path/loop grids use an intermediate column step at ${width}px (#898 finding 19)`, async ({page}) => {
    await page.setViewportSize({width, height: 900});
    await page.goto('/');

    const countColumns = async (selector) => page.locator(selector).evaluate((el) => {
      return getComputedStyle(el).gridTemplateColumns.trim().split(/\s+/).length;
    });

    const pathColumns = await countColumns('[data-testid="landing-pathfinder"] [aria-labelledby="guide-paths-heading"]');
    const loopColumns = await countColumns('[data-testid="landing-evidence-loop"]');

    expect(pathColumns).toBeGreaterThanOrEqual(2);
    expect(pathColumns).toBeLessThan(5);
    expect(loopColumns).toBeGreaterThanOrEqual(2);
    expect(loopColumns).toBeLessThan(5);

    const overflowsHorizontally = await page.evaluate(() => {
      return document.documentElement.scrollWidth > document.documentElement.clientWidth + 1;
    });
    expect(overflowsHorizontally).toBe(false);
  });
}
