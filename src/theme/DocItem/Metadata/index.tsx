import React, {type ReactNode} from 'react';
import Head from '@docusaurus/Head';
import {useDoc} from '@docusaurus/plugin-content-docs/client';
import {PageMetadata} from '@docusaurus/theme-common';

export default function DocItemMetadata(): ReactNode {
  const {metadata, frontMatter, assets} = useDoc();
  const isInternalOnly = metadata.permalink.includes('/docs/archive/') || metadata.permalink.includes('/docs/superpowers/');

  return (
    <>
      <PageMetadata
        title={metadata.title}
        description={metadata.description}
        keywords={frontMatter.keywords}
        image={assets.image ?? frontMatter.image}
      />
      {isInternalOnly ? (
        <Head>
          <meta name="robots" content="noindex, nofollow" />
        </Head>
      ) : null}
    </>
  );
}
