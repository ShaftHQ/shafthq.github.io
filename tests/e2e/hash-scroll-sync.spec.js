const {expect, test} = require('@playwright/test');

// Regression guard for #859. src/theme/Root.tsx's HashTargetScrollSync
// re-aligns the scroll position against a hash-linked heading after a
// client-side navigation, since Docusaurus's SPA routing doesn't get the
// browser's native hash-scroll behavior for free. It originally did this via
// a fixed retry schedule (0/150/450/900ms) alone -- fine for ordinary pages,
// but a slow-rendering client-side widget positioned above the target (e.g.
// the Mermaid "Workflow map" diagram on docs/start/quick-start.mdx, above
// `#existing-project-upgrade`) can, on a cold cache/JIT, finish growing the
// page *after* that fixed schedule is exhausted. Nothing then re-corrects the
// scroll, permanently stranding the target far below where the last retry
// landed -- a real bug for first-time/slow-device visitors, not just a test
// artifact (see #859 for the full empirical trace).
//
// #860's homepage.spec.js test intentionally pre-warms the Mermaid renderer
// before its navigation (to avoid *that* test flaking on this exact race) --
// which means it is structurally unable to exercise the cold-cache path this
// bug lives in. This spec is the only coverage for that path: it forces a
// cold render by CPU-throttling the page (Chrome DevTools Protocol) rather
// than relying on ambient system load, so the race is reproducible on
// demand instead of intermittent.

test('anchor scroll self-corrects when a Mermaid diagram above the target renders slowly (cold cache, #859)', async ({page, context}) => {
  const client = await context.newCDPSession(page);

  await page.goto('/');
  const upgradePath = page.getByTestId('landing-pathfinder').getByRole('link', {name: /Upgrade an existing project/});
  await upgradePath.scrollIntoViewIfNeeded();

  // Throttle CPU only for the navigation itself, so the click action and
  // initial homepage hydration aren't affected -- this isolates the slowdown
  // to the target page's own rendering (including Mermaid), matching a real
  // slower device rather than a generally sluggish test browser. 2x reliably
  // pushes Mermaid's first render past the fixed retry schedule's 900ms
  // budget (empirically: ~3-5s to finish under this rate, vs ~1.5-2s
  // unthrottled) without making the test itself slow.
  await client.send('Emulation.setCPUThrottlingRate', {rate: 2});
  try {
    await Promise.all([
      page.waitForURL('**/docs/start/quick-start#existing-project-upgrade'),
      upgradePath.click(),
    ]);

    // Confirm this test actually exercises the slow-render path it claims to
    // -- if Mermaid doesn't even show up, the rest of the assertion would be
    // meaningless (a passing gap check for the wrong reason).
    await expect(page.locator('.docusaurus-mermaid-container svg')).toBeVisible({timeout: 15_000});
  } finally {
    await client.send('Emulation.setCPUThrottlingRate', {rate: 1});
  }

  // Give MutationObserver-driven corrections (src/theme/Root.tsx) a moment to
  // settle after Mermaid's DOM insertion, then assert the final position --
  // same [8,120] navbar-clearance window as tests/e2e/homepage.spec.js's
  // warm-cache assertion, since this is testing the same real UX guarantee.
  await page.waitForTimeout(500);

  const gap = await page.evaluate((id) => {
    const target = document.getElementById(id);
    const navbar = document.querySelector('.navbar');
    if (!target || !navbar) return null;
    return Math.round(target.getBoundingClientRect().top - navbar.getBoundingClientRect().bottom);
  }, 'existing-project-upgrade');

  expect(gap, `anchor gap after cold Mermaid render: ${gap}, needs [8,120]`).toBeGreaterThanOrEqual(8);
  expect(gap, `anchor gap after cold Mermaid render: ${gap}, needs [8,120]`).toBeLessThanOrEqual(120);
});

test('anchor auto-correction stops as soon as the user scrolls manually (no scroll-jacking)', async ({page, context}) => {
  const client = await context.newCDPSession(page);

  await page.goto('/');
  const upgradePath = page.getByTestId('landing-pathfinder').getByRole('link', {name: /Upgrade an existing project/});
  await upgradePath.scrollIntoViewIfNeeded();

  await client.send('Emulation.setCPUThrottlingRate', {rate: 2});
  try {
    await Promise.all([
      page.waitForURL('**/docs/start/quick-start#existing-project-upgrade'),
      upgradePath.click(),
    ]);

    // Let the fixed retry schedule run at least once. Require a stable
    // pre-gesture baseline so the expected wheel destination is computed from
    // an observed state rather than from an in-flight anchor correction.
    await page.waitForTimeout(200);
    let previousScrollY = await page.evaluate(() => Math.round(window.scrollY));
    let stableSamples = 0;
    await expect.poll(async () => {
      const currentScrollY = await page.evaluate(() => Math.round(window.scrollY));
      stableSamples = currentScrollY === previousScrollY ? stableSamples + 1 : 0;
      previousScrollY = currentScrollY;
      return stableSamples;
    }, {
      message: 'anchor position did not settle before the trusted wheel gesture',
      timeout: 5_000,
      intervals: [50],
    }).toBeGreaterThanOrEqual(10);

    const wheelState = await page.evaluate(() => {
      const start = Math.round(window.scrollY);
      const maximum = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
      window.__hashScrollEnd = new Promise((resolve) => {
        document.addEventListener('scrollend', () => resolve(Math.round(window.scrollY)), {once: true});
      });
      return {
        start,
        expected: Math.min(start + 120, Math.round(maximum)),
      };
    });

    // A real wheel gesture is required: Root.tsx listens for trusted user
    // input to disarm its own MutationObserver-driven corrections. Playwright
    // does not wait for the wheel's default scroll action, so install the
    // semantic scrollend listener first, then require the exact clamped delta.
    await page.mouse.wheel(0, 120);
    await page.evaluate(() => Promise.race([
      window.__hashScrollEnd,
      new Promise((_, reject) => setTimeout(() => reject(new Error('trusted wheel did not emit scrollend')), 5_000)),
    ]));
    await expect.poll(
      () => page.evaluate(() => Math.round(window.scrollY)),
      {
        message: `trusted wheel did not reach expected position ${wheelState.expected}`,
        timeout: 5_000,
        intervals: [25, 50, 100],
      },
    ).toBe(wheelState.expected);
    const scrollYAfterUserTookOver = await page.evaluate(() => Math.round(window.scrollY));

    // Whether or not Mermaid has finished by now, the auto-correction must
    // never override the user's own position from this point on.
    await expect(page.locator('.docusaurus-mermaid-container svg')).toBeVisible({timeout: 15_000});

    // Give any (incorrectly) still-armed auto-correction every chance to fire.
    await page.waitForTimeout(1500);

    const finalScrollY = await page.evaluate(() => Math.round(window.scrollY));
    expect(
      finalScrollY,
      `scroll position moved from ${scrollYAfterUserTookOver} to ${finalScrollY} after the user took over -- ` +
        'the auto-correction scroll-jacked the page',
    ).toBe(scrollYAfterUserTookOver);
  } finally {
    await client.send('Emulation.setCPUThrottlingRate', {rate: 1});
  }
});
