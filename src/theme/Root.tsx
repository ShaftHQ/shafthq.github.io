import { useLocation } from '@docusaurus/router';
import React, { Suspense, useEffect, useState } from 'react';
const LazyAutoBot = React.lazy(() => import('@site/src/components/AutoBot'));

const HASH_SCROLL_RETRY_DELAYS_MS = [0, 150, 450, 900];

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

    const frameIds: number[] = [];
    const scrollToTarget = () => {
      const target = document.getElementById(targetId);
      if (!target) return;

      target.scrollIntoView({ block: 'start', inline: 'nearest' });
    };

    const timeoutIds = HASH_SCROLL_RETRY_DELAYS_MS.map((delay) => window.setTimeout(() => {
      frameIds.push(window.requestAnimationFrame(scrollToTarget));
    }, delay));

    return () => {
      timeoutIds.forEach((timeoutId) => window.clearTimeout(timeoutId));
      frameIds.forEach((frameId) => window.cancelAnimationFrame(frameId));
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
