export type HomepageFaq = {
  question: string;
  /** Plain text for FAQPage JSON-LD (no markup). */
  answerText: string;
};

/**
 * Homepage Common questions. Keep answers short (1–3 sentences) and identical
 * to the visible FAQ copy so FAQPage JSON-LD stays in sync with the page.
 */
export function getHomepageFaqs(javaVersion: string): HomepageFaq[] {
  return [
    {
      question: 'Is SHAFT free to use?',
      answerText:
        'Yes. SHAFT is open source under the MIT license.',
    },
    {
      question: 'Do I have to rewrite my Selenium tests?',
      answerText:
        'No. Move an existing Maven suite onto current SHAFT and run one test first.',
    },
    {
      question: 'Which Java version do I need?',
      answerText: javaVersion
        ? `Java ${javaVersion}. Installation lists the rest.`
        : 'Installation lists the supported Java version.',
    },
  ];
}

export function homepageFaqPageJsonLd(faqs: HomepageFaq[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
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
