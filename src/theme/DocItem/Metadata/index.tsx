import useDocusaurusContext from '@docusaurus/useDocusaurusContext'
import { useDoc } from '@docusaurus/plugin-content-docs/client'
import { PageMetadata } from '@docusaurus/theme-common'

const defaultKeywords = [
  'TEE security Web3',
  'Trusted Execution Environment Web3',
  'enclave security guide',
  'confidential computing Web3',
  'TEE attestation Web3',
  'building secure Web3 TEE architecture',
]

export default function DocItemMetadata() {
  const { assets, frontMatter, metadata } = useDoc()
  const { siteConfig } = useDocusaurusContext()
  const { seo_title: seoTitle, image_size: imageSize } =
    frontMatter as typeof frontMatter & {
      seo_title?: unknown
      image_size?: unknown
    }
  const title = typeof seoTitle === 'string' ? seoTitle : metadata.title
  // Docusaurus's generated excerpt can begin with an MDX component tag.
  const description = frontMatter.description?.trim() || siteConfig.tagline
  const keywords = frontMatter.keywords?.length
    ? frontMatter.keywords
    : defaultKeywords
  const image = assets.image ?? frontMatter.image
  const [width, height] = Array.isArray(imageSize) ? imageSize : []
  const hasImageSize =
    image && typeof width === 'number' && typeof height === 'number'

  return (
    <PageMetadata
      title={metadata.title}
      description={description}
      keywords={keywords}
      image={image}
    >
      <meta property="og:type" content="article" />
      <meta property="og:title" content={title} />
      {hasImageSize && (
        <meta property="og:image:width" content={String(width)} />
      )}
      {hasImageSize && (
        <meta property="og:image:height" content={String(height)} />
      )}
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
    </PageMetadata>
  )
}
