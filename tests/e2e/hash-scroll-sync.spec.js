const {expect, test} = require('@playwright/test');

// Regression guard for #859. src/theme/Root.tsx's HashTargetScrollSync
// re-aligns the scroll position against a hash-linked heading after a
// client-side navigation, since Docusaurus's SPA routing doesn't get the
// browser's native hash-scroll behavior for free. It originally did this via
// a fixed retry schedule (0/150/450/900ms) alone -- fine for ordinary pages,
// but a slow-rendering client-side widget positioned above the target (e.g.
// the Mermaid "Workflow map" diagram on docs/start/quick-start.mdx, above
// `#new-project-generation`) can, on a cold cache/JIT, finish growing the
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
  const installCta = page.getByTestId('landing-hero-install-cta');
  await installCta.waitFor({state: 'visible'});

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
      page.waitForURL('**/docs/start/quick-start#new-project-generation'),
      installCta.click(),
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
  }, 'new-project-generation');

  expect(gap, `anchor gap after cold Mermaid render: ${gap}, needs [8,120]`).toBeGreaterThanOrEqual(8);
  expect(gap, `anchor gap after cold Mermaid render: ${gap}, needs [8,120]`).toBeLessThanOrEqual(120);
});

test('anchor auto-correction stops as soon as the user scrolls manually (no scroll-jacking)', async ({page, context}) => {
  const client = await context.newCDPSession(page);

  await page.goto('/');
  const installCta = page.getByTestId('landing-hero-install-cta');
  await installCta.waitFor({state: 'visible'});

  await client.send('Emulation.setCPUThrottlingRate', {rate: 2});
  try {
    await Promise.all([
      page.waitForURL('**/docs/start/quick-start#new-project-generation'),
      installCta.click(),
    ]);

    // Let the fixed retry schedule run at least once, then take over with a
    // real wheel gesture (a trusted input event, not a programmatic
    // window.scrollTo -- Root.tsx specifically listens for wheel/touchmove/
    // keydown to distinguish genuine user intent from its own scrollIntoView
    // calls, which never dispatch those) while Mermaid is still slowly
    // rendering -- exactly the window in which the late MutationObserver-
    // driven correction would otherwise still be armed.
    await page.waitForTimeout(200);
    await page.mouse.wheel(0, 120);
    await page.waitForTimeout(50);
    const scrollYAfterUserTookOver = await page.evaluate(() => window.scrollY);

    // Whether or not Mermaid has finished by now, the auto-correction must
    // never override the user's own position from this point on.
    await expect(page.locator('.docusaurus-mermaid-container svg')).toBeVisible({timeout: 15_000});

    // Give any (incorrectly) still-armed auto-correction every chance to fire.
    await page.waitForTimeout(1500);

    const finalScrollY = await page.evaluate(() => window.scrollY);
    expect(
      finalScrollY,
      `scroll position moved from ${scrollYAfterUserTookOver} to ${finalScrollY} after the user took over -- ` +
        'the auto-correction scroll-jacked the page',
    ).toBe(scrollYAfterUserTookOver);
  } finally {
    await client.send('Emulation.setCPUThrottlingRate', {rate: 1});
  }
});
