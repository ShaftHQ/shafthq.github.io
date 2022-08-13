module.exports = {
  title: 'SHAFT User Guide',
  tagline: 'Stop reinventing the wheel. Start using SHAFT.',
  url: 'https://shafthq.github.io',
  baseUrl: '/SHAFT_Engine_Docusaurus/',
  onBrokenLinks: 'throw',
  favicon: 'img/shaft.ico',
  organizationName: 'mohabmohie', // Usually your GitHub org/user name.
  projectName: 'SHAFT_Engine_Docusaurus', // Usually your repo name.
  themeConfig: {
    navbar: {
      title: 'User Guide',
      logo: {
        alt: 'SHAFT_Engine',
        src: 'img/shaft_bg.svg',
      },
      items: [
        {
          to: 'docs/',
          activeBasePath: 'docs',
          label: 'Setup',
          position: 'left',
        },
        {
          to: 'docs/Browser_Actions/',
          activeBasePath: 'docs',
          label: 'Web GUI',
          position: 'left',
        },
        {
          to: 'docs/Touch_Actions/',
          activeBasePath: 'docs',
          label: 'Mobile GUI',
          position: 'left',
        },
        {
          to: 'docs/Request_Builder/',
          activeBasePath: 'docs',
          label: 'API',
          position: 'left',
        },
        {
          to: 'docs/Overview/',
          activeBasePath: 'docs',
          label: 'Validations',
          position: 'left',
        },
        {
          to: 'docs/features/retryFailedTests',
          activeBasePath: 'docs',
          label: 'Cool Features',
          position: 'left',
        },
//        {to: 'blog', label: 'Blog', position: 'left'},
        {
          href: 'https://github.com/shafthq/SHAFT_ENGINE',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
//        {
//          title: 'Docs',
//          items: [
//            {
//              label: 'Style Guide',
//              to: 'docs/',
//            },
//            {
//              label: 'Web GUI',
//              to: 'docs/Browser_Actions',
//            },
//          ],
//        },
        {
          title: 'Community',
          items: [
            {
              label: 'Automatest - Software Test Automation Hub (Facebook)',
              href: 'https://www.facebook.com/groups/Automatest',
            },
            {
              label: 'Automatest - Dev Channel (Slack)',
              href: 'https://join.slack.com/t/automatest-workspace/shared_invite/zt-oii5i2gg-0ZGnih_Y34NjK7QqDn01Dw',
            },
          ],
        },
        {
          title: 'More Resources',
          items: [
//            {
//              label: 'Blog',
//              to: 'blog',
//            },
            {
              label: 'Configuration Manager',
              to: 'https://shafthq.github.io/SHAFT_ENGINE/',
            },
            {
              label: 'JavaDocs',
              to: 'https://shafthq.github.io/SHAFT_ENGINE/apidocs/index.html',
            },
//            {
//              label: 'JFrog',
//              to: 'https://automatest.jfrog.io/ui/packages/gav:%2F%2Fio.github.mohabmohie:SHAFT_ENGINE',
//            },
            {
              label: 'Maven Central',
              to: 'https://search.maven.org/search?q=g:%22io.github.mohabmohie%22%20AND%20a:%22SHAFT_ENGINE%22',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} SHAFT_Engine. Built with Docusaurus.`,
    },
  },
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          // It is recommended to set document id as docs home page (`docs/` path).
          homePageId: 'Features',
          sidebarPath: require.resolve('./sidebars.js'),
          // Please change this to your repo.
          editUrl:
            'https://shafthq.github.io/SHAFT_Engine_Docusaurus/edit/master/website/',
        },
//        blog: {
//          showReadingTime: true,
//          // Please change this to your repo.
//          editUrl:
//            'https://shafthq.github.io/SHAFT_Engine_Docusaurus/edit/master/website/blog/',
//        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      },
    ],
  ],
};
