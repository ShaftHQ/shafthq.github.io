// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const {themes} = require('prism-react-renderer');
const lightTheme = themes.github;
const darkTheme = themes.dracula;
const siteUrl = 'https://shafthq.github.io';
const siteAsset = (path) => new URL(path, siteUrl).toString();

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'SHAFT User Guide',
  tagline: 'Stop reinventing the wheel. Start using SHAFT.',
  url: siteUrl,
  baseUrl: '/',
  onBrokenLinks: 'throw',
  onBrokenAnchors: 'throw',
  favicon: 'img/shaft.ico',
  deploymentBranch: 'gh-pages',

  // GitHub Pages deployment config for the canonical public guide URL.
  organizationName: 'ShaftHQ', // Usually your GitHub org/user name.
  projectName: 'shafthq.github.io', // Usually your repo name.

  headTags: [
    {
      tagName: 'meta',
      attributes: {
        name: 'keywords',
        content: 'test automation framework, selenium test framework, java test automation, web testing, mobile testing, api testing, appium, rest assured, testng, junit, cucumber, page object model, SHAFT engine, open source testing',
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
        content: siteAsset('/img/shaft.svg'),
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
        url: siteUrl,
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
        url: siteUrl,
        logo: siteAsset('/img/shaft.svg'),
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
  // Opt in to every Docusaurus v4 future flag now so the guide is ready for the
  // v4 upgrade: site storage namespacing, Docusaurus Faster (Rspack/SWC/
  // LightningCSS) by default, MDX v1 compat disabled, and CSS cascade layers.
  // `future.v4: true` requires the @docusaurus/faster dependency.
  future: {
    v4: true,
  },
  markdown: {
    mermaid: true,
    // v4's `mdx1CompatDisabledByDefault` flag (enabled above via `v4: true`)
    // turns MDX v1 compatibility off by default. We keep HTML-comment support
    // on because the release blog posts double as GitHub release `bodyFile`s
    // (see the "SHAFT_ENGINE Release Body Template" comment in blog/*.md), and
    // GitHub release notes are GFM where `<!-- -->` is the correct comment
    // syntax — MDX `{/* */}` comments would render as literal text there.
    mdx1Compat: {
      comments: true,
    },
    hooks: {
      onBrokenMarkdownLinks: 'throw',
    },
  },
  themes: ['@docusaurus/theme-mermaid'],

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
              if (item.url.includes('/docs/start/overview')) {
                return {...item, priority: 0.9};
              }
              if (item.url.includes('/docs/start/') || item.url.includes('/docs/testing/')) {
                return {...item, priority: 0.8};
              }
              if (item.url.match(/\/docs\/reference\/actions\/GUI\/(Browser_Actions|Element_Actions|Element_Identification)/)) {
                return {...item, priority: 0.8};
              }
              if (item.url.includes('/docs/reference/')) {
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
      require.resolve('@docusaurus/plugin-client-redirects'),
      /** @type {import('@docusaurus/plugin-client-redirects').Options} */
      ({
        // GitHub Pages (the canonical host) can't serve netlify.toml's
        // server-side 301s, so this plugin emits static meta-refresh pages
        // for the same legacy URLs. Keep this list mirroring netlify.toml's
        // `[[redirects]]` entries — netlify.toml stays authoritative for the
        // secondary/fallback Netlify host.
        createRedirects(existingPath) {
          const wildcardPrefixMap = {
            '/docs/reference/actions/': '/docs/Keywords/',
            '/docs/reference/configuration/': '/docs/Basic_Config/',
            '/docs/reference/guides/': '/docs/Best_Practices/',
            '/docs/reference/properties/': '/docs/Properties/',
            '/docs/reference/reporting/': '/docs/Reporting/',
          };
          const oldPaths = [];
          for (const [newPrefix, oldPrefix] of Object.entries(wildcardPrefixMap)) {
            if (existingPath.startsWith(newPrefix)) {
              oldPaths.push(existingPath.replace(newPrefix, oldPrefix));
            }
          }
          return oldPaths;
        },
        redirects: [
          // Renamed config pages.
          {to: '/docs/reference/configuration/webConfig', from: '/docs/reference/configuration/basicConfig'},
          {to: '/docs/reference/configuration/mobileConfig', from: '/docs/reference/configuration/basicConfig2'},
          {to: '/docs/reference/configuration/apiConfig', from: '/docs/reference/configuration/basicConfig3'},
          // Retired Getting_Started tree.
          {to: '/docs/start/overview', from: ['/docs/Getting_Started/first_steps', '/docs/Getting_Started/support']},
          {to: '/docs/start/quick-start', from: ['/docs/Getting_Started/first_steps_2', '/docs/Getting_Started/first_steps_3']},
          {to: '/docs/start/installation', from: ['/docs/Getting_Started/first_steps_4', '/docs/Getting_Started/first_steps_5', '/docs/Getting_Started/first_steps_6', '/docs/Getting_Started/shaft_wizard']},
          {to: '/docs/testing/web', from: ['/docs/Getting_Started/setup_web', '/docs/Demos/web']},
          {to: '/docs/testing/mobile', from: ['/docs/Getting_Started/setup_mobile', '/docs/Getting_Started/flutter_testing', '/docs/Demos/mobile']},
          {to: '/docs/testing/api', from: '/docs/Getting_Started/setup_api'},
          {to: '/docs/features/modules', from: '/docs/Getting_Started/integrations'},
          // NOTE: netlify.toml's target for this redirect is the stale
          // `/docs/reference/guides/JUnit5_Integration` slug, but the page's
          // frontmatter `id` (and therefore its real route) is
          // `JUnit_Integration` (no "5") — that netlify.toml entry has been
          // a dead 301 on the fallback host; tracked as a follow-up. Point
          // this redirect at the page that actually exists.
          {to: '/docs/reference/guides/JUnit_Integration', from: '/docs/Getting_Started/JUnit5_Integration'},
          // Retired agentic/mcp-manual tombstone (deleted; canonical content
          // lives on the main MCP setup page).
          {to: '/docs/agentic/mcp', from: '/docs/agentic/mcp/manual'},
          // Docs IA PR B (issue #842): Validations 10-pages -> 1 page merge,
          // plus GUI/Element_Validations folded into the same page as a
          // duplicate-resolution. Section anchors are documented in the
          // page itself since meta-refresh redirects can't target a
          // fragment reliably.
          {
            to: '/docs/reference/actions/Validations',
            from: [
              '/docs/reference/actions/Validations/Overview',
              '/docs/reference/actions/Validations/Browser',
              '/docs/reference/actions/Validations/Elements',
              '/docs/reference/actions/Validations/Files',
              '/docs/reference/actions/Validations/Objects',
              '/docs/reference/actions/Validations/Nums',
              '/docs/reference/actions/Validations/Response',
              '/docs/reference/actions/Validations/JSON_Schema_Validation',
              '/docs/reference/actions/Validations/ForceFail',
              '/docs/reference/actions/Validations/Soft_vs_Hard_Assertions',
              '/docs/reference/actions/GUI/Element_Validations',
            ],
          },
          // Docs IA PR B (issue #842): didYouKnow 19 pages + the old
          // Did_You_Know.md hub -> 3 themed GUI tips pages. Async_Element_Actions
          // and Visual_Testing were duplicate pairs, not theme content — they
          // redirect to their existing GUI-set/integrations canonical page
          // instead. Section anchors are documented on each themed page since
          // meta-refresh redirects can't target a fragment reliably.
          {
            to: '/docs/reference/actions/GUI/Locators_And_Self_Healing',
            from: [
              '/docs/reference/actions/GUI/Did_You_Know',
              '/docs/reference/actions/GUI/didYouKnow/ARIA_Locators',
              '/docs/reference/actions/GUI/didYouKnow/Self_Healing_Locators',
              '/docs/reference/actions/GUI/didYouKnow/Shadow_Dom_Locator_Builder',
              '/docs/reference/actions/GUI/didYouKnow/Shaft_Locator_Builder',
              '/docs/reference/actions/GUI/didYouKnow/Smart_Locators',
              '/docs/reference/actions/GUI/didYouKnow/iFrame_Handling',
            ],
          },
          {
            to: '/docs/reference/actions/GUI/Waits_And_Synchronization',
            from: [
              '/docs/reference/actions/GUI/didYouKnow/Explicit_Waits',
              '/docs/reference/actions/GUI/didYouKnow/Clipboard_Actions',
            ],
          },
          {
            to: '/docs/reference/actions/GUI/Infrastructure_Network_And_Visual',
            from: [
              '/docs/reference/actions/GUI/didYouKnow/Native_selenium_Webdriver',
              '/docs/reference/actions/GUI/didYouKnow/Custom_Capabilities',
              '/docs/reference/actions/GUI/didYouKnow/Mobile_Emulation',
              '/docs/reference/actions/GUI/didYouKnow/Local_Selenium_Grid_Execution',
              '/docs/reference/actions/GUI/didYouKnow/Kubernetes_Selenium_Grid',
              '/docs/reference/actions/GUI/didYouKnow/Network_Mocking',
              '/docs/reference/actions/GUI/didYouKnow/Using_Cookies_In_Your_Tests',
              '/docs/reference/actions/GUI/didYouKnow/Accessibility_Testing',
              '/docs/reference/actions/GUI/didYouKnow/Integrate_JIRA_With_SHAFT_Engine',
            ],
          },
          // Duplicate resolution (issue #842 item 3): Async Element Actions —
          // the didYouKnow copy redirects to the surviving GUI top-level page.
          {
            to: '/docs/reference/actions/GUI/Async_Element_Actions',
            from: '/docs/reference/actions/GUI/didYouKnow/Async_Element_Actions',
          },
          // Duplicate resolution (issue #842 item 3): Visual Testing — the
          // didYouKnow copy's unique matchesScreenshot()/engine content was
          // folded into integrations/visual.md, the canonical page.
          {
            to: '/docs/integrations/visual',
            from: '/docs/reference/actions/GUI/didYouKnow/Visual_Testing',
          },
          // Pre-2026-06-19 release posts consolidated into one history post
          // (issue #841).
          {
            to: '/blog/release-history',
            from: [
              '/blog/release_announcement_7.1.20230309',
              '/blog/release-10.1.20260324',
              '/blog/release-10.1.20260331',
              '/blog/release-10.2.20260501',
              '/blog/release-10.2.20260505',
              '/blog/release-10.2.20260506',
              '/blog/release-10.2.20260605',
              '/blog/release-10.2.20260610',
              '/blog/release-10.2.20260612',
              '/blog/release-10.2.20260614',
              '/blog/release-10.2.20260615',
              '/blog/release-10.2.20260617',
              '/blog/release-10.2.20260618',
            ],
          },
        ],
      }),
    ],
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
      mermaid: {
        theme: {
          light: 'neutral',
          dark: 'neutral',
        },
        options: {
          themeVariables: {
            primaryColor: '#006ec0',
            primaryTextColor: '#102a31',
            primaryBorderColor: '#006ec0',
            secondaryColor: '#c8d6e7',
            tertiaryColor: '#102a31',
            lineColor: '#006ec0',
            textColor: '#102a31',
            edgeLabelBackground: '#ffffff',
            nodeTextColor: '#102a31',
            clusterBkg: '#c8d6e7',
            clusterBorder: '#006ec0',
          },
        },
      },
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
            docId: 'start/overview',
            position: 'left',
            label: 'Docs',
          },
          {to: '/blog', label: 'Blog', position: 'left'},
          // {
          //   type:'html',
          //   position: 'right',
          //   value: '<a class="navbar__item navbar__link" href="https://shafthq.github.io/SHAFT_ENGINE/" target="_blank"><b>JavaDocs</b></a>',
          // },
          {
            href: 'https://github.com/ShaftHQ/SHAFT_ENGINE',
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
                to: '/docs/start/overview',
              },
              {
                label: 'Connect MCP',
                to: '/docs/agentic/mcp',
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
                label: 'GitHub Pages',
                href: 'https://shafthq.github.io/',
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
        copyright: `Copyright © ${new Date().getFullYear()} ShaftHQ. Built with Docusaurus and GitHub Pages.`,
      },
      prism: {
        theme: lightTheme,
        darkTheme: darkTheme,
        additionalLanguages: ['java', 'json', 'properties', 'yaml', 'xml-doc'],
      },
    }),
};

export default config;

