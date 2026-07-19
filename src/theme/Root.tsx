import { useLocation } from '@docusaurus/router';
import React, { Suspense, useEffect, useState } from 'react';
const LazyAutoBot = React.lazy(() => import('@site/src/components/AutoBot'));

const HASH_SCROLL_RETRY_DELAYS_MS = [0, 150, 450, 900];
// The fixed schedule above assumes layout finishes shifting within 900ms.
// That's true for most pages, but a slow-rendering client-side widget (e.g. a
// Mermaid diagram positioned above the hash target -- see #859) can grow the
// page taller after the schedule is exhausted, permanently stranding the
// target below where the last retry scrolled to (nothing else re-corrects
// it). Once the fixed schedule ends, keep watching for further DOM growth via
// MutationObserver and re-align for this bounded extra window. (ResizeObserver
// on document.body/documentElement was tried first and doesn't work here --
// this site's body has a sticky-footer min-height:100vh layout, so body's own
// rendered box stays pinned at the viewport height and never reports a resize
// even as its content/scrollHeight grows; MutationObserver reacts to the
// actual DOM insertion instead, which is unaffected by that.)
const HASH_SCROLL_OBSERVER_MAX_MS = 6000;
// Real user-initiated scroll gestures (as opposed to our own programmatic
// target.scrollIntoView() calls, which never dispatch these) -- once any of
// these fire, the user has taken control of the scroll position, and we must
// never override it again. Doing so would be a worse UX bug (scroll-jacking)
// than the one this is fixing. Known gap: dragging the scrollbar thumb itself
// isn't covered (no reliable, low-complexity signal for it); wheel/touch/key
// covers the overwhelming majority of real navigation.
const USER_SCROLL_INTENT_EVENTS = ['wheel', 'touchmove', 'keydown'] as const;

function DeferredAutoBot(): JSX.Element | null {
  const AUTOBOT_DEFER_TIMEOUT_MS = 5000;
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    try {
      if (window.self !== window.top) return;
    } catch {
      return;
    }

    let idleId = 0;
    const hydrate = () => setShouldRender(true);
    const hydrateOnIntent = () => hydrate();

    window.addEventListener('pointerdown', hydrateOnIntent, { once: true, passive: true });
    window.addEventListener('keydown', hydrateOnIntent, { once: true });
    window.addEventListener('scroll', hydrateOnIntent, { once: true, passive: true });

    const browserWindow = window as Window & {
      requestIdleCallback?: (
        callback: IdleRequestCallback,
        options?: IdleRequestOptions,
      ) => number;
      cancelIdleCallback?: (handle: number) => void;
    };

    if (typeof browserWindow.requestIdleCallback === 'function') {
      const requestIdle = browserWindow;
      idleId = requestIdle.requestIdleCallback(hydrate, { timeout: AUTOBOT_DEFER_TIMEOUT_MS });
      return () => {
        window.removeEventListener('pointerdown', hydrateOnIntent);
        window.removeEventListener('keydown', hydrateOnIntent);
        window.removeEventListener('scroll', hydrateOnIntent);
        requestIdle.cancelIdleCallback?.(idleId);
      };
    }

    const timeoutId = globalThis.setTimeout(hydrate, AUTOBOT_DEFER_TIMEOUT_MS);
    return () => {
      window.removeEventListener('pointerdown', hydrateOnIntent);
      window.removeEventListener('keydown', hydrateOnIntent);
      window.removeEventListener('scroll', hydrateOnIntent);
      globalThis.clearTimeout(timeoutId);
    };
  }, []);

  if (!shouldRender) return null;
  return (
    <Suspense fallback={null}>
      <LazyAutoBot />
    </Suspense>
  );
}

function HashTargetScrollSync(): JSX.Element | null {
  const location = useLocation();

  useEffect(() => {
    if (!location.hash) return;

    let targetId: string;
    try {
      targetId = decodeURIComponent(location.hash.slice(1));
    } catch {
      targetId = location.hash.slice(1);
    }

    if (!targetId) return;

    let userTookOver = false;
    const markUserTookOver = () => {
      userTookOver = true;
      // Setting the flag alone stops *future* corrections, but html's global
      // `scroll-behavior: smooth` (src/css/custom.css) means a scrollIntoView
      // call already in flight keeps animating toward its target for its own
      // remaining frames regardless -- the flag can't interrupt an animation
      // that already started. Re-issuing an instant scroll to the current
      // position cancels that in-progress animation immediately, so user
      // input always wins outright rather than fighting a settling tail.
      window.scrollTo({top: window.scrollY, left: window.scrollX, behavior: 'auto'});
    };
    USER_SCROLL_INTENT_EVENTS.forEach((eventName) => {
      window.addEventListener(eventName, markUserTookOver, { passive: true, once: true });
    });

    const frameIds: number[] = [];
    const scrollToTarget = () => {
      if (userTookOver) return;
      const target = document.getElementById(targetId);
      if (!target) return;

      target.scrollIntoView({ block: 'start', inline: 'nearest' });
    };

    const timeoutIds = HASH_SCROLL_RETRY_DELAYS_MS.map((delay) => window.setTimeout(() => {
      frameIds.push(window.requestAnimationFrame(scrollToTarget));
    }, delay));

    // Beyond the fixed schedule: watch for the page's content still growing
    // (e.g. a Mermaid diagram finishing its render late, inserting a large
    // SVG) and re-align for as long as that keeps happening, bounded by
    // HASH_SCROLL_OBSERVER_MAX_MS so a continually-mutating page can't hold
    // onto scroll control indefinitely. A busy page can fire many mutation
    // batches in quick succession (React re-renders, reveal-animation state,
    // unrelated widgets); coalesce them into at most one pending correction
    // instead of stacking a redundant rAF per mutation batch.
    let correctionScheduled = false;
    const scheduleCorrection = () => {
      if (userTookOver || correctionScheduled) return;
      correctionScheduled = true;
      frameIds.push(window.requestAnimationFrame(() => {
        correctionScheduled = false;
        scrollToTarget();
      }));
    };

    let mutationObserver: MutationObserver | undefined;
    let observerCapId = 0;
    if (typeof MutationObserver !== 'undefined') {
      mutationObserver = new MutationObserver(scheduleCorrection);
      mutationObserver.observe(document.body, { childList: true, subtree: true });
      observerCapId = window.setTimeout(() => {
        mutationObserver?.disconnect();
      }, HASH_SCROLL_OBSERVER_MAX_MS);
    }

    return () => {
      USER_SCROLL_INTENT_EVENTS.forEach((eventName) => {
        window.removeEventListener(eventName, markUserTookOver);
      });
      timeoutIds.forEach((timeoutId) => window.clearTimeout(timeoutId));
      frameIds.forEach((frameId) => window.cancelAnimationFrame(frameId));
      mutationObserver?.disconnect();
      window.clearTimeout(observerCapId);
    };
  }, [location.hash, location.pathname]);

  return null;
}

// Default implementation, that you can customize
export default function Root({ children }: React.PropsWithChildren) {
  return (
    <>
      <HashTargetScrollSync />
      {children}
      <DeferredAutoBot />
    </>
  );
}
