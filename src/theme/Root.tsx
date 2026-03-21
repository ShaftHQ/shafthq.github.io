import React, { Suspense, useEffect, useState } from 'react';
import AutoBot from '@site/src/components/AutoBot';

function DeferredAutoBot(): JSX.Element | null {
  const AUTOBOT_DEFER_TIMEOUT_MS = 2000;
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    const hydrate = () => setShouldRender(true);

    if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
      const requestIdle = (
        window as Window & {
          requestIdleCallback: (
            callback: IdleRequestCallback,
            options?: IdleRequestOptions,
          ) => number;
        }
      );
      const idleId = requestIdle.requestIdleCallback(hydrate, { timeout: AUTOBOT_DEFER_TIMEOUT_MS });
      return () => {
        (
          window as Window & {
            cancelIdleCallback?: (handle: number) => void;
          }
        ).cancelIdleCallback?.(idleId);
      };
    }

    const timeoutId = window.setTimeout(hydrate, AUTOBOT_DEFER_TIMEOUT_MS);
    return () => window.clearTimeout(timeoutId);
  }, []);

  if (!shouldRender) return null;
  return <AutoBot />;
}

// Default implementation, that you can customize
export default function Root({ children }: React.PropsWithChildren) {
  return (
    <>
      {children}
      <Suspense fallback={null}>
        <DeferredAutoBot />
      </Suspense>
    </>
  );
}
