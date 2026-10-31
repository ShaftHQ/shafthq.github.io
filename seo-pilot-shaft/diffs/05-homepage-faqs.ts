export type HomepageFaq = {
  question: string;
  /** Plain text for FAQPage JSON-LD and visible FAQ body (must stay byte-identical). */
  answerText: string;
};

/**
 * Homepage Common questions.
 * RULE: render `answerText` as the visible FAQ body text (links may wrap
 * substrings but must not add/remove characters outside answerText).
 * FAQPage JSON-LD must use the same `answerText` string.
 */
export function getHomepageFaqs(javaVersion: string): HomepageFaq[] {
  const javaAnswer = javaVersion
    ? `Java ${javaVersion}. Installation lists the rest.`
    : 'Installation lists the supported Java version.';
  return [
    {
      question: 'What is SHAFT Engine?',
      answerText:
        'SHAFT Engine is an open-source Java test automation engine for web, mobile, API, CLI, database, and desktop. It wraps Selenium, Appium, and REST Assured behind one fluent API and writes an Allure report on every run. The user guide is at https://shafthq.github.io/.',
    },
    {
      question: 'Is SHAFT free to use?',
      answerText: 'Yes. SHAFT is open source under the MIT license.',
    },
    {
      question: 'Do I have to rewrite my Selenium tests?',
      answerText:
        'No. Move an existing Maven suite onto current SHAFT and run one test first. See Upgrade a project in the user guide.',
    },
    {
      question: 'Which Java version do I need?',
      answerText: javaAnswer,
    },
    {
      question: 'What Maven coordinate do I use?',
      answerText:
        'Use io.github.shafthq:shaft-engine with the version from Maven Central (or shaft-bom). The legacy SHAFT_ENGINE coordinate is a relocation only.',
    },
    {
      question: 'Who created SHAFT_ENGINE?',
      answerText:
        'Mohab Mohie created SHAFT_ENGINE and maintains it with the ShaftHQ community. See the Welcome blog post on the user guide.',
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
