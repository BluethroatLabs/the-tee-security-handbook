type Props = {
  title?: string
  subtitle?: string
  image?: string
  backgroundPosition?: string
}

export default function PageBanner({
  title,
  subtitle,
  image,
  backgroundPosition = 'center',
}: Props) {
  return (
    <div className="chapter-banner">
      {image && (
        <img
          className="chapter-banner__image"
          src={image}
          alt=""
          style={{ objectPosition: backgroundPosition }}
        />
      )}
      {(title || subtitle) && (
        <div className="chapter-banner__caption">
          {title && <h1>{title}</h1>}
          {subtitle && <p>{subtitle}</p>}
        </div>
      )}
    </div>
  )
}
