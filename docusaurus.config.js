// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const {themes} = require('prism-react-renderer');
const lightTheme = themes.github;
const darkTheme = themes.dracula;

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'SHAFT User Guide',
  tagline: 'Stop reinventing the wheel. Start using SHAFT.',
  url: 'https://shafthq.github.io',
  baseUrl: '/',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/shaft.ico',
  deploymentBranch: 'gh-pages',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'ShaftHQ', // Usually your GitHub org/user name.
  projectName: 'shafthq.github.io', // Usually your repo name.

  // Even if you don't use internalization, you can use this field to set useful
  // metadata like html lang. For example, if your site is Chinese, you may want
  // to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
    path: 'i18n',
    localeConfigs: {
      en: {
        label: 'English',
        direction: 'ltr',
        htmlLang: 'en-US',
        calendar: 'gregory',
        path: 'en',
      },
    },
  },

  // scripts: [
  //   {
  //     async: true,
  //     defer: true,
  //     src: 'https://buttons.github.io/buttons.js',
  //   },
  // ],

  trailingSlash: false,

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        gtag: {
          trackingID: 'G-FQC2XHQTVE',
          anonymizeIP: false,
        },
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/ShaftHQ/shafthq.github.io/blob/master',
        },
        blog: {
          showReadingTime: true,
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/ShaftHQ/shafthq.github.io/blob/master',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      }),
    ],
  ],

  plugins: [
    [
      require.resolve("@cmfcmf/docusaurus-search-local"),
      {
        // whether to index docs pages
        indexDocs: true,
      
        // Whether to also index the titles of the parent categories in the sidebar of a doc page.
        // 0 disables this feature.
        // 1 indexes the direct parent category in the sidebar of a doc page
        // 2 indexes up to two nested parent categories of a doc page
        // 3...
        //
        // Do _not_ use Infinity, the value must be a JSON-serializable integer.
        indexDocSidebarParentCategories: 0,
      
        // whether to index blog pages
        indexBlog: true,
      
        // whether to index static pages
        // /404.html is never indexed
        indexPages: false,
      
        // language of your documentation, see next section
        language: "en",
      
        // setting this to "none" will prevent the default CSS to be included. The default CSS
        // comes from autocomplete-theme-classic, which you can read more about here:
        // https://www.algolia.com/doc/ui-libraries/autocomplete/api-reference/autocomplete-theme-classic/
        // When you want to overwrite CSS variables defined by the default theme, make sure to suffix your
        // overwrites with `!important`, because they might otherwise not be applied as expected. See the
        // following comment for more information: https://github.com/cmfcmf/docusaurus-search-local/issues/107#issuecomment-1119831938.
        style: undefined,
      
        // The maximum number of search results shown to the user. This does _not_ affect performance of
        // searches, but simply does not display additional search results that have been found.
        maxSearchResults: 8,
      
        // lunr.js-specific settings
        lunr: {
          // When indexing your documents, their content is split into "tokens".
          // Text entered into the search box is also tokenized.
          // This setting configures the separator used to determine where to split the text into tokens.
          // By default, it splits the text at whitespace and dashes.
          //
          // Note: Does not work for "ja" and "th" languages, since these use a different tokenizer.
          tokenizerSeparator: /[\s\-]+/,
          // https://lunrjs.com/guides/customising.html#similarity-tuning
          //
          // This parameter controls the importance given to the length of a document and its fields. This
          // value must be between 0 and 1, and by default it has a value of 0.75. Reducing this value
          // reduces the effect of different length documents on a term’s importance to that document.
          b: 0.75,
          // This controls how quickly the boost given by a common word reaches saturation. Increasing it
          // will slow down the rate of saturation and lower values result in quicker saturation. The
          // default value is 1.2. If the collection of documents being indexed have high occurrences
          // of words that are not covered by a stop word filter, these words can quickly dominate any
          // similarity calculation. In these cases, this value can be reduced to get more balanced results.
          k1: 1.2,
          // By default, we rank pages where the search term appears in the title higher than pages where
          // the search term appears in just the text. This is done by "boosting" title matches with a
          // higher value than content matches. The concrete boosting behavior can be controlled by changing
          // the following settings.
          titleBoost: 5,
          contentBoost: 1,
          tagsBoost: 3,
          parentCategoriesBoost: 2, // Only used when indexDocSidebarParentCategories > 0
        }
      },
    ],
  ],
  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      styles: [
      '/css/custom.css',
      ],
      navbar: {
        title: '',
        logo: {
          alt: 'SHAFT_Engine',
          src: 'img/shaft.svg',
        },
        items: [
          {
            type: 'doc',
            docId: 'Getting_Started/first_steps',
            position: 'left',
            label: 'Guide',
          },
          {to: '/blog', label: 'Blog', position: 'left'},
          // {
          //   type:'html',
          //   position: 'right',
          //   value: '<a class="navbar__item navbar__link" href="https://shafthq.github.io/SHAFT_ENGINE/" target="_blank"><b>JavaDocs</b></a>',
          // },
          {
            href: 'https://github.com/shafthq/SHAFT_ENGINE',
            position: 'right',
            className: 'header-github-link',
            target: '_blank',
            'aria-label': 'GitHub repository',
          },
          {
            to: 'https://github.com/sponsors/MohabMohie/',
            label: 'Sponsor',
            position: 'right',
            target: '_blank',
            className: 'sponsorship-link',
          },
          {
            href: 'https://shafthq.github.io/SHAFT_ENGINE/',
            label: 'JavaDocs',
            position: 'right',
            target: '_blank',
          },
        ],
      },
      footer: {
        style: 'light',
        links: [
          {
            title: 'Docs',
            items: [
              {
                label: 'Get Started',
                to: '/docs/Getting_Started/welcome',
              },
              {
                label: 'Support & Community',
                to: '/docs/Getting_Started/support',
              },
              {
                label: 'Integrations',
                to: '/docs/Getting_Started/integrations',
              },
            ],
          },
          {
            title: 'Support',
            items: [
              {
                label: 'Slack',
                href: 'https://join.slack.com/t/shaft-engine/shared_invite/zt-oii5i2gg-0ZGnih_Y34NjK7QqDn01Dw',
              },
              {
                label: 'Facebook',
                href: 'https://www.facebook.com/groups/Automatest',
              },
            ],
          },
          {
            title: 'More',
            items: [
              {
                label: 'Blog',
                to: '/blog',
              },
              {
                html: `
                <a href="https://www.netlify.com" target="_blank" rel="noreferrer noopener" aria-label="Deploys by Netlify">
                  <img src="https://www.netlify.com/img/global/badges/netlify-color-accent.svg" alt="Deploys by Netlify" width="114" height="51" />
                </a>
              `,
              },
            ],
          },
        ],
        logo: {
          style: {
            height: '150px',
          },
          alt: 'ShaftHQ Logo',
          src: '/img/shaft.svg',
          href: 'https://github.com/ShaftHQ',
        },
        copyright: `Copyright © ${new Date().getFullYear()} ShaftHQ. Built with Docusaurus.`,
      },
      prism: {
        theme: lightTheme,
        darkTheme: darkTheme,
        additionalLanguages: ['java', 'json', 'json5', 'gherkin', 'properties', 'powershell', 'regex', 'sql', 'xml-doc', 'yaml', 'javadoc', 'javastacktrace', 'javadoclike'],
      },
    }),
};

export default config;
