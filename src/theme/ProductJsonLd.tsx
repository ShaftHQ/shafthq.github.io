import Head from '@docusaurus/Head';
import {useLocation} from '@docusaurus/router';
import React from 'react';

/**
 * Route-conditional SHAFT SoftwareApplication / SoftwareSourceCode JSON-LD.
 *
 * Docusaurus `headTags` in docusaurus.config.js are site-global and cannot vary
 * by route (see docusaurus.io/docs/api/docusaurus-config#headtags and discussion
 * #9075). Move product schema here so ChaosEngine docs/entity routes can omit
 * the SHAFT Engine Software* labels without dropping them on the rest of the
 * guide.
 *
 * Match: pathname starts with /docs/agentic/chaos-engine or /entity/chaos-engine
 * (covers chaos-engine, chaos-engine-install-guide, chaos-engine-addons, entity).
 *
 * Keep Organization (+ meta) in config headTags — shared across products.
 * Page-level CE @graph (pilot diffs/01) still applies on CE MDX via <Head>.
 */

const SHAFT_SOFTWARE_APPLICATION = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'SHAFT Engine',
  applicationCategory: 'DeveloperApplication',
  operatingSystem: 'Windows, macOS, Linux',
  description:
    'Unified test automation engine for Web, Mobile, API, CLI, and Database testing. Built on Selenium, Appium, and REST Assured.',
  url: 'https://shafthq.github.io',
  codeRepository: 'https://github.com/ShaftHQ/SHAFT_ENGINE',
  license: 'https://github.com/ShaftHQ/SHAFT_ENGINE/blob/main/LICENSE',
  author: {
    '@type': 'Organization',
    name: 'ShaftHQ',
    url: 'https://github.com/ShaftHQ',
  },
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
  },
} as const;

const SHAFT_SOFTWARE_SOURCE_CODE = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareSourceCode',
  name: 'SHAFT_ENGINE',
  alternateName: ['SHAFT', 'SHAFT Engine', 'shaft-engine'],
  description:
    'Unified test automation engine for Web, Mobile, API, CLI, and Database testing. Built on Selenium, Appium, and REST Assured.',
  codeRepository: 'https://github.com/ShaftHQ/SHAFT_ENGINE',
  url: 'https://shafthq.github.io',
  programmingLanguage: 'Java',
  runtimePlatform: 'JVM',
  license: 'https://opensource.org/licenses/MIT',
  identifier: 'io.github.shafthq:shaft-engine',
  author: {
    '@type': 'Organization',
    name: 'ShaftHQ',
    url: 'https://github.com/ShaftHQ',
  },
} as const;

export function isChaosEngineRoute(pathname: string): boolean {
  return (
    pathname.startsWith('/docs/agentic/chaos-engine') ||
    pathname.startsWith('/entity/chaos-engine')
  );
}

export default function ProductJsonLd(): JSX.Element | null {
  const {pathname} = useLocation();
  if (isChaosEngineRoute(pathname)) {
    return null;
  }
  return (
    <Head>
      <script type="application/ld+json">
        {JSON.stringify(SHAFT_SOFTWARE_APPLICATION)}
      </script>
      <script type="application/ld+json">
        {JSON.stringify(SHAFT_SOFTWARE_SOURCE_CODE)}
      </script>
    </Head>
  );
}
