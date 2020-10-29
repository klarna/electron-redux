module.exports = {
  title: 'electron-redux',
  tagline: 'Use redux in the main and browser processes in Electron.',
  url: 'https://klarna.github.io',
  baseUrl: '/electron-redux',
  onBrokenLinks: 'throw',
  favicon: 'img/favicon.ico',
  organizationName: 'klarna', 
  projectName: 'electron-redux', 
  themeConfig: {
    navbar: {
      title: 'electron-redux',
      logo: {
        alt: 'My Site Logo',
        src: 'img/logo.svg',
      },
      items: [
        {
          to: 'docs/',
          activeBasePath: 'docs',
          label: 'Docs',
          position: 'left',
        },
        {to: 'blog', label: 'Blog', position: 'left'},
        {
          href: 'https://github.com/klarna/electron-redux/tree/master',
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
              label: 'Style Guide',
              to: 'docs/',
            },
            {
              label: 'Second Doc',
              to: 'docs/doc2/',
            },
          ],
        },
        {
          title: 'Community',
          items: [
            {
              label: 'Klarna Engineering',
              href: 'https://engineering.klarna.com',
            },
            {
              label: 'Twitter',
              href: 'https://twitter.com/klarna',
            },
          ],
        },
        {
          title: 'More',
          items: [
            {
              label: 'Blog',
              to: 'blog',
            },
            {
              label: 'GitHub',
              href: 'https://github.com/klarna/electron-redux',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Klarna AB. Built with Docusaurus.`,
    },
  },
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          editUrl:
            'https://github.com/klarna/electron-redux/edit/master/docs/website/',
        },
        blog: {
          showReadingTime: true,
          editUrl:
            'https://github.com/klarna/electron-redux/edit/master/docs/website/blog/',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      },
    ],
  ],
};
