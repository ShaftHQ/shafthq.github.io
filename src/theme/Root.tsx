import React from 'react';
import AutoBot from '@site/src/components/AutoBot';

// Default implementation, that you can customize
export default function Root({ children }: React.PropsWithChildren) {
  return (
    <>
      {children}
      <AutoBot />
    </>
  );
}
