import {chaosEngineFaqs} from './chaosengine-faqs';
import {SHAFT_ORGANIZATION, SHAFT_PERSON} from './shaft-jsonld';

/**
 * ChaosEngine page @graph. Organization + Person are the shared SHAFT nodes
 * (same @id and body as the homepage graph). FAQPage text comes from the same
 * source as the visible <details>, so it matches byte-for-byte.
 */
export const CHAOSENGINE_VERSION = '0.4.20261104.2';
export const CHAOSENGINE_DISAMBIGUATION =
  'ChaosEngine is not The Chaos Engine, the 1993 Bitmap Brothers video game; it is not chaos-engineering or fault-injection tooling; and it is not a standalone ShaftHQ repository.';
const DESCRIPTION =
  'An MIT-licensed provider-neutral AI agent harness (portable working contract for coding agents). Installs one canonical skill, host adapters, and verified local tooling for Codex, Claude, Gemini, Grok, and GitHub Copilot without tying a project to one model or client. Ships as the chaos-engine/ tree inside ShaftHQ/SHAFT_ENGINE. ' +
  CHAOSENGINE_DISAMBIGUATION;
const PAGE = 'https://shafthq.github.io/docs/agentic/chaos-engine';
const SOURCE = 'https://github.com/ShaftHQ/SHAFT_ENGINE/tree/main/chaos-engine';
const ORG_REF = {'@id': SHAFT_ORGANIZATION['@id']};
const PERSON_REF = {'@id': SHAFT_PERSON['@id']};

const chaosEngineJsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    SHAFT_ORGANIZATION,
    SHAFT_PERSON,
    {
      '@type': 'SoftwareApplication',
      '@id': `${PAGE}#software`,
      name: 'ChaosEngine',
      alternateName: ['chaos-engine'],
      applicationCategory: 'DeveloperApplication',
      operatingSystem: 'Windows, macOS, Linux',
      description: DESCRIPTION,
      url: PAGE,
      codeRepository: SOURCE,
      license: 'https://opensource.org/licenses/MIT',
      softwareVersion: CHAOSENGINE_VERSION,
      author: ORG_REF,
      creator: PERSON_REF,
      offers: {'@type': 'Offer', price: '0', priceCurrency: 'USD'},
    },
    {
      '@type': 'SoftwareSourceCode',
      '@id': `${PAGE}#source`,
      name: 'chaos-engine',
      description: DESCRIPTION,
      codeRepository: SOURCE,
      url: PAGE,
      license: 'https://opensource.org/licenses/MIT',
      author: ORG_REF,
      creator: PERSON_REF,
    },
    {
      '@type': 'FAQPage',
      '@id': `${PAGE}#faq`,
      mainEntity: chaosEngineFaqs.map((faq) => ({
        '@type': 'Question',
        name: faq.question,
        inLanguage: faq.lang,
        acceptedAnswer: {'@type': 'Answer', text: faq.answerText},
      })),
    },
  ],
};

/** Same graph without FAQPage, for CE routes that do not render the visible FAQ. */
export const chaosEngineJsonLdNoFaq = {
  ...chaosEngineJsonLd,
  '@graph': chaosEngineJsonLd['@graph'].filter(
    (node) => (node as {'@type': string})['@type'] !== 'FAQPage',
  ),
};

export default chaosEngineJsonLd;
