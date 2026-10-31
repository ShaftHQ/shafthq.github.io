import Head from '@docusaurus/Head';
import {useLocation} from '@docusaurus/router';
import React from 'react';
import projectSignals from '@site/src/data/project-signals.json';
import {getHomepageFaqs, HomepageFaq} from '@site/src/data/homepage-faqs';

/**
 * Route-conditional SHAFT JSON-LD @graph (exactly one application/ld+json).
 *
 * Docusaurus `headTags` are site-global and cannot vary by route
 * (docusaurus.io/docs/api/docusaurus-config#headtags, discussion #9075).
 * Emit the full SHAFT @graph here so ChaosEngine docs/entity routes can omit
 * SHAFT Software* labels without dropping them on the rest of the guide.
 *
 * Match (suppress): pathname starts with /docs/agentic/chaos-engine or
 * /entity/chaos-engine. Meta tags stay in config headTags. Organization lives
 * inside this single @graph (W1: exactly one ld+json per page — not a separate
 * config script). FAQPage is homepage-only so Answer.text stays byte-identical
 * to visible FAQ copy.
 */

const ORGANIZATION = {
  '@type': 'Organization',
  '@id': 'https://shafthq.github.io/#organization',
  name: 'ShaftHQ',
  url: 'https://shafthq.github.io/',
  logo: 'https://shafthq.github.io/img/shaft.svg',
  description:
    'Open-source organization behind SHAFT Engine — a MIT-licensed Java test automation engine for web, mobile, API, CLI, database, and desktop.',
  sameAs: [
    'https://github.com/ShaftHQ',
    'https://github.com/ShaftHQ/SHAFT_ENGINE',
    'https://central.sonatype.com/artifact/io.github.shafthq/shaft-engine',
    'https://www.selenium.dev/ecosystem/#frameworks',
    'https://www.youtube.com/@MohabMohieElDeen',
    'https://www.facebook.com/groups/Automatest',
  ],
} as const;

const PERSON = {
  '@type': 'Person',
  '@id': 'https://shafthq.github.io/#person-mohab-mohie',
  name: 'Mohab Mohie',
  url: 'https://shafthq.github.io/entity',
  jobTitle: 'Creator of SHAFT_ENGINE',
  description:
    'Creator and maintainer of SHAFT_ENGINE, the open-source Java test automation engine documented at shafthq.github.io.',
  sameAs: [
    'https://github.com/MohabMohie',
    'https://www.linkedin.com/in/mohabmohie',
    'https://www.youtube.com/@MohabMohieElDeen',
    'https://github.com/ShaftHQ/SHAFT_ENGINE',
  ],
} as const;

const SOFTWARE_APPLICATION = {
  '@type': 'SoftwareApplication',
  '@id': 'https://shafthq.github.io/#software',
  name: 'SHAFT Engine',
  alternateName: ['SHAFT', 'SHAFT_ENGINE', 'shaft-engine'],
  applicationCategory: 'DeveloperApplication',
  operatingSystem: 'Windows, macOS, Linux',
  description:
    'Open-source Java test automation engine for web, mobile, API, CLI, database, and desktop, with an Allure report on every run.',
  url: 'https://shafthq.github.io/',
  codeRepository: 'https://github.com/ShaftHQ/SHAFT_ENGINE',
  license: 'https://opensource.org/licenses/MIT',
  downloadUrl: 'https://central.sonatype.com/artifact/io.github.shafthq/shaft-engine',
  author: {'@id': 'https://shafthq.github.io/#organization'},
  creator: {'@id': 'https://shafthq.github.io/#person-mohab-mohie'},
  offers: {'@type': 'Offer', price: '0', priceCurrency: 'USD'},
} as const;

const SOFTWARE_SOURCE_CODE = {
  '@type': 'SoftwareSourceCode',
  '@id': 'https://shafthq.github.io/#source',
  name: 'SHAFT_ENGINE',
  alternateName: ['SHAFT', 'SHAFT Engine', 'shaft-engine'],
  description:
    'Unified test automation engine for web, mobile, API, CLI, database, and desktop testing. Built on Selenium, Appium, and REST Assured.',
  codeRepository: 'https://github.com/ShaftHQ/SHAFT_ENGINE',
  url: 'https://shafthq.github.io/',
  programmingLanguage: 'Java',
  runtimePlatform: 'JVM',
  license: 'https://opensource.org/licenses/MIT',
  identifier: 'io.github.shafthq:shaft-engine',
  author: {'@id': 'https://shafthq.github.io/#organization'},
  creator: {'@id': 'https://shafthq.github.io/#person-mohab-mohie'},
} as const;

function faqPageNode(faqs: HomepageFaq[]) {
  return {
    '@type': 'FAQPage',
    '@id': 'https://shafthq.github.io/#faq',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answerText,
      },
    })),
  };
}

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
  if (isChaosEngineRoute(pathname)) {
    return null;
  }

  const graph: object[] = [
    ORGANIZATION,
    PERSON,
    SOFTWARE_APPLICATION,
    SOFTWARE_SOURCE_CODE,
  ];
  if (isHomepage(pathname)) {
    const faqs = getHomepageFaqs(projectSignals.javaVersion);
    graph.push(faqPageNode(faqs));
  }

  const payload = {
    '@context': 'https://schema.org',
    '@graph': graph,
  };

  return (
    <Head>
      <script type="application/ld+json">{JSON.stringify(payload)}</script>
    </Head>
  );
}
