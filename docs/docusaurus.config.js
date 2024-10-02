module.exports = {
    title: 'electron-redux',
    tagline: 'Redux & Electron: Make sure all your stores are on the same page',
    url: 'https://klarna.github.io',
    baseUrl: '/electron-redux/',
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
                    label: 'Getting Started',
                    to: 'introduction/getting-started',
                    position: 'right',
                },
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
                            label: 'Getting Started',
                            to: 'introduction/getting-started/',
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
                            label: 'GitHub',
                            href: 'https://github.com/klarna/electron-redux',
                        },
                    ],
                },
            ],
            copyright: `Copyright © ${new Date().getFullYear()} Klarna AB.`,
        },
    },
    presets: [
        [
            '@docusaurus/preset-classic',
            {
                docs: {
                    sidebarPath: require.resolve('./sidebars.js'),
                    path: './docs',
                    routeBasePath: '/',
                    editUrl: 'https://github.com/klarna/electron-redux/edit/master/',
                },
                theme: {
                    customCss: require.resolve('./src/css/custom.css'),
                },
            },
        ],
    ],
}
