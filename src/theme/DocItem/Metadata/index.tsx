import React, {type ReactNode} from 'react';
import Head from '@docusaurus/Head';
import {
  useDoc,
  useSidebarBreadcrumbs,
} from '@docusaurus/plugin-content-docs/client';
import {PageMetadata} from '@docusaurus/theme-common';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import {isChaosEngineRoute} from '@site/src/theme/ProductJsonLd';
import chaosEngineJsonLd from '@site/src/data/chaosengine-jsonld';

type Crumb = {label: string; href?: string};

function absoluteUrl(siteUrl: string, path: string): string {
  if (/^https?:\/\//i.test(path)) {
    return path;
  }
  const base = siteUrl.replace(/\/$/, '');
  const suffix = path.startsWith('/') ? path : `/${path}`;
  return `${base}${suffix}`;
}

function breadcrumbListJsonLd(
  siteUrl: string,
  crumbs: Crumb[],
  pageUrl: string,
  pageTitle: string,
) {
  const items: Array<{'@type': 'ListItem'; position: number; name: string; item: string}> = [
    {
      '@type': 'ListItem',
      position: 1,
      name: 'Home',
      item: siteUrl.replace(/\/$/, '') + '/',
    },
  ];
  crumbs.forEach((crumb, index) => {
    const href = crumb.href
      ? absoluteUrl(siteUrl, crumb.href)
      : index === crumbs.length - 1
        ? pageUrl
        : undefined;
    if (!href) {
      return;
    }
    items.push({
      '@type': 'ListItem',
      position: items.length + 1,
      name: crumb.label,
      item: href,
    });
  });
  // Ensure the trail ends at the current page even when the last crumb has no href.
  const last = items[items.length - 1];
  if (!last || last.item !== pageUrl) {
    items.push({
      '@type': 'ListItem',
      position: items.length + 1,
      name: pageTitle,
      item: pageUrl,
    });
  }
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items,
  };
}

export default function DocItemMetadata(): ReactNode {
  const {siteConfig} = useDocusaurusContext();
  const {metadata, frontMatter, assets} = useDoc();
  const sidebarBreadcrumbs = useSidebarBreadcrumbs() ?? [];
  const isInternalOnly = metadata.permalink.includes('/docs/archive/');
  const pageUrl = absoluteUrl(siteConfig.url, metadata.permalink);
  const crumbs: Crumb[] = sidebarBreadcrumbs.map((crumb) => ({
    label: crumb.label,
    href: 'href' in crumb ? crumb.href : undefined,
  }));

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
      ) : (
        <Head>
          <script type="application/ld+json">
            {JSON.stringify(
              breadcrumbListJsonLd(
                siteConfig.url,
                crumbs,
                pageUrl,
                metadata.title,
              ),
            )}
          </script>
          {isChaosEngineRoute(metadata.permalink) ? (
            <script type="application/ld+json">
              {JSON.stringify(chaosEngineJsonLd)}
            </script>
          ) : null}
        </Head>
      )}
    </>
  );
}
