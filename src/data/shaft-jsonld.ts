import type {HomepageFaq} from './homepage-faqs';

/** Shared SHAFT @graph nodes (SEO pilot2). FAQPage is optional (homepage only). */
export const SHAFT_ORGANIZATION = {
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

export const SHAFT_PERSON = {
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

export const SHAFT_SOFTWARE_APPLICATION = {
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

export const SHAFT_SOFTWARE_SOURCE_CODE = {
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

export function buildShaftJsonLd(faqs?: HomepageFaq[]) {
  const graph: object[] = [
    SHAFT_ORGANIZATION,
    SHAFT_PERSON,
    SHAFT_SOFTWARE_APPLICATION,
    SHAFT_SOFTWARE_SOURCE_CODE,
  ];
  if (faqs) {
    graph.push({
      '@type': 'FAQPage',
      '@id': 'https://shafthq.github.io/#faq',
      mainEntity: faqs.map((faq) => ({
        '@type': 'Question',
        name: faq.question,
        acceptedAnswer: {'@type': 'Answer', text: faq.answerText},
      })),
    });
  }
  return {'@context': 'https://schema.org', '@graph': graph};
}
