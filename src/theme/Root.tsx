import React, { Suspense, useEffect, useState } from 'react';
const LazyAutoBot = React.lazy(() => import('@site/src/components/AutoBot'));

function DeferredAutoBot(): JSX.Element | null {
  const AUTOBOT_DEFER_TIMEOUT_MS = 5000;
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
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

// Default implementation, that you can customize
export default function Root({ children }: React.PropsWithChildren) {
  return (
    <>
      {children}
      <DeferredAutoBot />
    </>
  );
}
