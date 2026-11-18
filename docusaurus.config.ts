import type { Config } from '@docusaurus/types'
import type { ThemeConfig, Options } from '@docusaurus/preset-classic'

type HtmlNode = {
  tagName?: string
  properties?: Record<string, unknown>
  children?: HtmlNode[]
}

function focusableTables() {
  function visit(node: HtmlNode) {
    // A table may scroll at narrower viewports. Preserve keyboard access
    // without adding a wrapper or changing table semantics.
    if (node.tagName === 'table' && node.properties) {
      node.properties.tabIndex ??= 0
    }
    node.children?.forEach(visit)
  }

  return visit
}

const config = {
  title: 'TEE Security Handbook',
  tagline:
    'A practical security guide for teams building Web3 protocols with Trusted Execution Environments.',
  favicon: 'img/favicon.ico',
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
          rehypePlugins: [focusableTables],
          routeBasePath: '/',
          showLastUpdateAuthor: true,
          showLastUpdateTime: true,
          lastVersion: 'current',
          versions: {
            current: { label: '1.1', badge: false },
            '1.0': { badge: false },
          },
        },
        blog: false,
        theme: { customCss: './src/css/custom.css' },
      } satisfies Options,
    ],
  ],
  themeConfig: {
    image: 'img/bluethroatlabs-social-card.png',
    metadata: [{ property: 'og:site_name', content: 'TEE Security Handbook' }],
    colorMode: { respectPrefersColorScheme: true },
    navbar: {
      logo: {
        alt: 'TEE Security Handbook',
        src: 'img/tee-handbook-wordmark.svg',
        width: 198,
        height: 32,
      },
      items: [
        {
          type: 'docsVersionDropdown',
          position: 'left',
          className: 'handbook-version-switcher',
          dropdownActiveClassDisabled: true,
          versions: {
            current: { label: '1.1 (Latest)' },
            '1.0': { label: '1.0' },
          },
        },
        {
          href: 'https://bluethroatlabs.com',
          label: 'Website',
          position: 'right',
          className: 'handbook-website-link',
        },
      ],
    } satisfies ThemeConfig,
    footer: {
      links: [
        {
          items: [
            {
              label: 'Email',
              to: 'mailto:saxenism@bluethroatlabs.com',
              className: 'footer-social-email',
            },
            {
              label: 'X (Twitter)',
              to: 'https://x.com/bluethroat_labs',
              className: 'footer-social-x',
            },
            {
              label: 'LinkedIn',
              to: 'https://www.linkedin.com/company/bluethroat-labs',
              className: 'footer-social-linkedin',
            },
            {
              label: 'Telegram',
              to: 'https://t.me/saxenism',
              className: 'footer-social-telegram',
            },
          ],
        },
      ],
      copyright: `© ${new Date().getFullYear()} Bluethroat Labs`,
    },
    prism: {
      theme: {
        plain: { color: '#1f2328', backgroundColor: '#fafafa' },
        styles: [
          {
            types: ['comment', 'prolog', 'doctype'],
            style: { color: '#59636e' },
          },
          {
            types: ['keyword', 'operator', 'tag'],
            style: { color: '#cf222e' },
          },
          {
            types: ['string', 'attr-value', 'regex'],
            style: { color: '#0a3069' },
          },
          { types: ['function', 'class-name'], style: { color: '#6639ba' } },
          {
            types: ['number', 'boolean', 'constant', 'property', 'symbol'],
            style: { color: '#0550ae' },
          },
          { types: ['variable', 'parameter'], style: { color: '#953800' } },
        ],
      },
      darkTheme: {
        plain: { color: '#e6edf3', backgroundColor: '#0a0a0a' },
        styles: [
          {
            types: ['comment', 'prolog', 'doctype'],
            style: { color: '#9da7b3' },
          },
          {
            types: ['keyword', 'operator', 'tag'],
            style: { color: '#ff7b72' },
          },
          {
            types: ['string', 'attr-value', 'regex'],
            style: { color: '#a5d6ff' },
          },
          { types: ['function', 'class-name'], style: { color: '#d2a8ff' } },
          {
            types: ['number', 'boolean', 'constant', 'property', 'symbol'],
            style: { color: '#79c0ff' },
          },
          { types: ['variable', 'parameter'], style: { color: '#ffa657' } },
        ],
      },
      additionalLanguages: ['bash', 'docker', 'rust', 'toml'],
    },
    plugins: [['vercel-analytics', { debug: false, mode: 'auto' }]],
  },
} satisfies Config

export default config
