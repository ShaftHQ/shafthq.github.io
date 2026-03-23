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

    if ('requestIdleCallback' in window) {
      const requestIdle = (
        window as Window & {
          requestIdleCallback: (
            callback: IdleRequestCallback,
            options?: IdleRequestOptions,
          ) => number;
          cancelIdleCallback?: (handle: number) => void;
        }
      );
      idleId = requestIdle.requestIdleCallback(hydrate, { timeout: AUTOBOT_DEFER_TIMEOUT_MS });
      return () => {
        window.removeEventListener('pointerdown', hydrateOnIntent);
        window.removeEventListener('keydown', hydrateOnIntent);
        window.removeEventListener('scroll', hydrateOnIntent);
        requestIdle.cancelIdleCallback?.(idleId);
      };
    }

    const timeoutId = window.setTimeout(hydrate, AUTOBOT_DEFER_TIMEOUT_MS);
    return () => {
      window.removeEventListener('pointerdown', hydrateOnIntent);
      window.removeEventListener('keydown', hydrateOnIntent);
      window.removeEventListener('scroll', hydrateOnIntent);
      window.clearTimeout(timeoutId);
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
