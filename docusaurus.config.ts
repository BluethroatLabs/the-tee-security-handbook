import { themes as prismThemes } from 'prism-react-renderer'
import type { Config } from '@docusaurus/types'
import type { ThemeConfig, Options } from '@docusaurus/preset-classic'

const config = {
  title: 'TEE Security Handbook',
  tagline:
    'TEE Security HandbookA practical security guide for Trusted Execution Environments',
  favicon: 'img/logo.png',
  future: { v4: true, faster: true },
  url: 'https://tee-security-handbook.bluethroatlabs.com',
  baseUrl: '/',
  i18n: { defaultLocale: 'en', locales: ['en'] },
  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          routeBasePath: '/',
          showLastUpdateAuthor: true,
          showLastUpdateTime: true,
        },
        blog: false,
        theme: { customCss: './src/css/custom.css' },
      } satisfies Options,
    ],
  ],
  themeConfig: {
    image: 'img/bluethroatlabs-social-card.jpg',
    colorMode: { respectPrefersColorScheme: true },
    navbar: {
      title: 'TEE Security Handbook',
      logo: { alt: 'Bluethroat Labs', src: 'img/logo.png' },
      items: [
        // {
        //   type: 'docsVersionDropdown',
        //   position: 'right',
        //   dropdownActiveClassDisabled: true,
        //   label: 'Version',
        //   versions: { 0.2: { label: '0.2 (Latest)' }, 0.1: { label: '0.1' } },
        // },
        {
          href: 'https://bluethroatlabs.com',
          label: 'Website',
          position: 'right',
        },
      ],
    } satisfies ThemeConfig,
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
    prism: { theme: prismThemes.github, darkTheme: prismThemes.dracula },
  },
} satisfies Config

export default config
