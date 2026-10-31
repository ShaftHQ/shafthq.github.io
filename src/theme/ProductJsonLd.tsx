import Head from '@docusaurus/Head';
import {useLocation} from '@docusaurus/router';
import React from 'react';
import {buildShaftJsonLd} from '@site/src/data/shaft-jsonld';

/**
 * Route-conditional SHAFT JSON-LD @graph (non-homepage).
 * Homepage emits the full graph (with FAQPage) from src/pages/index.tsx so FAQ
 * answer strings stay out of the global main bundle (web budget).
 * Suppress on ChaosEngine routes — config headTags cannot vary by route.
 */
export function isChaosEngineRoute(pathname: string): boolean {
  return (
    pathname.startsWith('/docs/agentic/chaos-engine') ||
    pathname.startsWith('/entity/chaos-engine')
  );
}

function isHomepage(pathname: string): boolean {
  return pathname === '/' || pathname === '';
}

export default function ProductJsonLd(): JSX.Element | null {
  const {pathname} = useLocation();
  if (isChaosEngineRoute(pathname) || isHomepage(pathname)) {
    return null;
  }
  return (
    <Head>
      <script type="application/ld+json">{JSON.stringify(buildShaftJsonLd())}</script>
    </Head>
  );
}
