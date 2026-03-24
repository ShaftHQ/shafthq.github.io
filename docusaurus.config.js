// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const {themes} = require('prism-react-renderer');
const lightTheme = themes.github;
const darkTheme = themes.dracula;

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'SHAFT User Guide',
  tagline: 'Stop reinventing the wheel. Start using SHAFT.',
  url: 'https://shaftengine.netlify.app',
  baseUrl: '/',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/shaft.ico',
  deploymentBranch: 'gh-pages',

  // GitHub pages deployment config (GitHub Pages now redirects to Netlify).
  // Primary deployment is now on Netlify.
  organizationName: 'ShaftHQ', // Usually your GitHub org/user name.
  projectName: 'shafthq.github.io', // Usually your repo name.

  headTags: [
    {
      tagName: 'meta',
      attributes: {
        name: 'keywords',
        content: 'test automation framework, selenium alternative, java test automation, web testing, mobile testing, api testing, appium, rest assured, testng, junit5, cucumber, page object model, SHAFT engine, open source testing',
      },
    },
    {
      tagName: 'meta',
      attributes: {
        property: 'og:type',
        content: 'website',
      },
    },
    {
      tagName: 'meta',
      attributes: {
        property: 'og:site_name',
        content: 'SHAFT User Guide',
      },
    },
    {
      tagName: 'meta',
      attributes: {
        property: 'og:image',
        content: 'https://shaftengine.netlify.app/img/shaft.svg',
      },
    },
    {
      tagName: 'meta',
      attributes: {
        name: 'twitter:card',
        content: 'summary_large_image',
      },
    },
    {
      tagName: 'script',
      attributes: {
        type: 'application/ld+json',
      },
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'SoftwareApplication',
        name: 'SHAFT Engine',
        applicationCategory: 'DeveloperApplication',
        operatingSystem: 'Windows, macOS, Linux',
        description: 'Unified test automation engine for Web, Mobile, API, CLI, and Database testing. Built on Selenium, Appium, and REST Assured.',
        url: 'https://shaftengine.netlify.app',
        license: 'https://github.com/ShaftHQ/SHAFT_ENGINE/blob/master/LICENSE',
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
      }),
    },
    {
      tagName: 'script',
      attributes: {
        type: 'application/ld+json',
      },
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: 'ShaftHQ',
        url: 'https://shaftengine.netlify.app',
        logo: 'https://shaftengine.netlify.app/img/shaft.svg',
        sameAs: [
          'https://github.com/ShaftHQ',
          'https://www.facebook.com/groups/Automatest',
        ],
        description: 'Open-source test automation organization behind SHAFT Engine — a unified testing framework for Web, Mobile, API, CLI, and Database testing.',
      }),
    },
  ],

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
        ...(process.env.GTAG_TRACKING_ID
          ? {
              gtag: {
                trackingID: process.env.GTAG_TRACKING_ID,
                anonymizeIP: false,
              },
            }
          : {}),
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          showLastUpdateTime: true,
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
        sitemap: {
          changefreq: 'weekly',
          priority: 0.5,
          createSitemapItems: async ({defaultCreateSitemapItems, ...params}) => {
            const items = await defaultCreateSitemapItems(params);
            return items.map((item) => {
              // Boost priority for high-value entry pages.
              if (item.url.includes('/docs/Getting_Started/first_steps')) {
                return {...item, priority: 0.9};
              }
              if (item.url.includes('/docs/Getting_Started/')) {
                return {...item, priority: 0.8};
              }
              if (item.url.match(/\/docs\/Keywords\/GUI\/(Browser_Actions|Element_Actions|Element_Identification)/)) {
                return {...item, priority: 0.8};
              }
              if (item.url.includes('/docs/Keywords/')) {
                return {...item, priority: 0.7};
              }
              if (item.url.includes('/docs/')) {
                return {...item, priority: 0.6};
              }
              return item;
            });
          },
        },
      }),
    ],
  ],

  plugins: [
    [
      require.resolve("@cmfcmf/docusaurus-search-local"),
      {
        indexDocs: true,

        // Index up to 3 nested parent categories so users can find docs
        // by searching for sidebar category names (e.g. "Actions > GUI").
        indexDocSidebarParentCategories: 3,

        indexBlog: true,

        // Index static pages (homepage, etc.) for broader search coverage.
        indexPages: true,

        language: "en",

        style: undefined,

        // Show more search results for better discoverability.
        maxSearchResults: 12,

        lunr: {
          // Split tokens on whitespace, hyphens, underscores, and dots
          // so code-like identifiers (e.g. "BrowserActions", "setup_web",
          // "shaft.properties") are searchable by each segment.
          tokenizerSeparator: /[\s\-_./]+/,

          // Lower b value reduces the effect of document length on ranking,
          // ensuring shorter reference pages still surface for relevant queries.
          b: 0.6,

          // Slightly higher k1 slows term-frequency saturation, giving more
          // nuanced ranking for documentation with repeated technical terms.
          k1: 1.4,

          // Stronger title boost so exact-title matches rank first.
          titleBoost: 7,
          contentBoost: 1,
          // Higher tags boost rewards the curated per-page tags we add.
          tagsBoost: 4,
          // Now effective since indexDocSidebarParentCategories > 0.
          parentCategoriesBoost: 3,
        }
      },
    ],
  ],
  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      metadata: [
        {name: 'description', content: 'SHAFT is a unified test automation engine for Web, Mobile, API, CLI, and Database testing. Built on Selenium, Appium, and REST Assured with zero boilerplate.'},
        {name: 'robots', content: 'index, follow'},
      ],
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
                label: 'Start here',
                to: '/docs/Getting_Started/first_steps',
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
        additionalLanguages: ['java', 'json', 'properties', 'yaml', 'xml-doc'],
      },
    }),
};

export default config;
