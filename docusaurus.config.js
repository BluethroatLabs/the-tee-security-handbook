// @ts-check
// `@type` JSDoc annotations allow editor autocompletion and type checking
// (when paired with `@ts-check`).
// There are various equivalent ways to declare your Docusaurus config.
// See: https://docusaurus.io/docs/api/docusaurus-config

import {themes as prismThemes} from 'prism-react-renderer';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'TEE Security Handbook',
  tagline: 'TEE Security HandbookA practical security guide for Trusted Execution Environments',
  favicon: 'img/logo.png',

  future: {
    v4: true, 
  },

  url: 'https://docs.bluethroatlabs.com',
  baseUrl: '/',
  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          routeBasePath: '/',
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    
    ({
      image: 'img/bluethroatlabs-social-card.jpg',
      colorMode: {
        respectPrefersColorScheme: true,
      },
      navbar: {
        title: 'TEE Security Handbook',
        logo: {
          alt: 'Bluethroat Labs',
          src: 'img/logo.png',
        },
        items: [
          {
            href: 'https://bluethroatlabs.com',
            label: 'Website',
            position: 'right',
          },
        ],
        },
      footer: {
        style: 'dark',
        links: [
          {
            items: [
              { label: 'Email', to: 'mailto:saxenism@bluethroatlabs.com' },
              { label: 'X (Twitter)', to: 'https://x.com/bluethroat_labs' },
            ],
          },
        ],
        copyright: `© ${new Date().getFullYear()} Bluethroat Labs`,
      },
      prism: {
        theme: prismThemes.github,
        darkTheme: prismThemes.dracula,
      },
    }),
};

export default config;
