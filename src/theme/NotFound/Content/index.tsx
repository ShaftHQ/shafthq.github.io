import React, {type ReactNode} from 'react';
import Head from '@docusaurus/Head';
import Content from '@theme-original/NotFound/Content';
import type {Props} from '@theme/NotFound/Content';

/** Soft-404 shells must not be indexed by search or AI answer engines. */
export default function NotFoundContentWrapper(props: Props): ReactNode {
  return (
    <>
      <Head>
        <meta name="robots" content="noindex, follow" />
      </Head>
      <Content {...props} />
    </>
  );
}
