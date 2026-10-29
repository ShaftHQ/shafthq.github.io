import React, {type ReactNode} from 'react';
import Head from '@docusaurus/Head';
import SearchPage from '@theme-original/SearchPage';

/**
 * /search is a thin client UI. Mark it noindex and keep it out of the sitemap
 * (see docusaurus.config.js sitemap filter) so crawlers do not index the shell.
 */
export default function SearchPageWrapper(props: unknown): ReactNode {
  return (
    <>
      <Head>
        <meta name="robots" content="noindex, follow" />
      </Head>
      <SearchPage {...(props as object)} />
    </>
  );
}
