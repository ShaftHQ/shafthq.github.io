module.exports = {
  title: 'SHAFT User Guide',
  tagline: 'This is the official user guide for using SHAFT; The Unified Test Automation Engine.',
  url: 'https://mohabmohie.github.io',
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
          to: 'docs/Features',
          activeBasePath: 'docs',
          label: 'Setup',
          position: 'left',
        },
        {
          to: 'docs/Browser_Actions',
          activeBasePath: 'docs',
          label: 'Web GUI',
          position: 'left',
        },
//        {to: 'blog', label: 'Blog', position: 'left'},
        {
          href: 'https://github.com/MohabMohie/SHAFT_ENGINE',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Docs',
          items: [
            {
              label: 'Setup',
              to: 'docs/Features',
            },
            {
              label: 'Web GUI',
              to: 'docs/Browser_Actions',
            },
          ],
        },
        {
          title: 'Community',
          items: [
            {
              label: 'Automatest - Software Test Automation Hub',
              href: 'https://www.facebook.com/groups/Automatest',
            },
          ],
        },
        {
          title: 'More',
          items: [
//            {
//              label: 'Blog',
//              to: 'blog',
//            },
            {
              label: 'Configuration Manager',
              to: 'https://mohabmohie.github.io/SHAFT_ENGINE/',
            },
            {
              label: 'JavaDocs',
              to: 'https://mohabmohie.github.io/SHAFT_ENGINE/apidocs/index.html',
            },
            {
              label: 'JFrog',
              to: 'https://automatest.jfrog.io/ui/packages/gav:%2F%2Fio.github.mohabmohie:SHAFT_ENGINE',
            },
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
            'https://mohabmohie.github.io/SHAFT_Engine_Docusaurus/edit/master/website/',
        },
//        blog: {
//          showReadingTime: true,
//          // Please change this to your repo.
//          editUrl:
//            'https://mohabmohie.github.io/SHAFT_Engine_Docusaurus/edit/master/website/blog/',
//        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      },
    ],
  ],
};
