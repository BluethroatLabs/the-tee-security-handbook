import Link from '@docusaurus/Link'
import type { Props } from '@theme/Footer/LinkItem'
import OriginalLinkItem from '@theme-original/Footer/LinkItem'

const socialIcons = {
  'footer-social-email': (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      aria-hidden="true"
    >
      <rect x="2.5" y="4.5" width="19" height="15" rx="2" />
      <path d="m3 6 9 7 9-7" />
    </svg>
  ),
  'footer-social-x': (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M7.1 0 24 24h-7.1L.03 0h7.07Zm-.85 1.56H3.07l14.7 20.88h3.19L6.25 1.56ZM0 24l9.4-10.69 1.08-1.23.91 1.29L2.04 24H0ZM24 0l-9.77 11.13-.9-1.29L21.11 0H24Z" />
    </svg>
  ),
  'footer-social-linkedin': (
    <svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
      <path d="M0 1.146C0 .513.526 0 1.175 0h13.65C15.474 0 16 .513 16 1.146v13.708c0 .633-.526 1.146-1.175 1.146H1.175C.526 16 0 15.487 0 14.854zm4.943 12.248V6.169H2.542v7.225zm-1.2-8.212c.837 0 1.358-.554 1.358-1.248-.015-.709-.52-1.248-1.342-1.248S2.4 3.226 2.4 3.934c0 .694.521 1.248 1.327 1.248zm4.908 8.212V9.359c0-.216.016-.432.08-.586.173-.431.568-.878 1.232-.878.869 0 1.216.662 1.216 1.634v3.865h2.401V9.25c0-2.22-1.184-3.252-2.764-3.252-1.274 0-1.845.7-2.165 1.193v.025h-.016l.016-.025V6.169h-2.4c.03.678 0 7.225 0 7.225z" />
    </svg>
  ),
  'footer-social-telegram': (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M1.658 10.643c6.433-2.846 10.734-4.686 12.901-5.589C20.683 2.486 21.956 2.035 22.782 2c.172 0 .584.035.86.243.206.173.275.416.31.59.034.174.068.555.034.868-.344 3.505-1.755 12.079-2.512 16.001-.309 1.666-.929 2.221-1.514 2.29-1.272.104-2.27-.867-3.509-1.666-1.926-1.284-3.027-2.082-4.919-3.332-2.168-1.458-.757-2.256.481-3.54.31-.347 5.987-5.519 6.09-6.005.017-.069.034-.278-.104-.382-.137-.104-.309-.069-.447-.035-.206.035-3.303 2.118-9.323 6.213-.894.626-1.686.903-2.408.903-.792 0-2.305-.451-3.44-.833C1.004 12.864-.097 12.621.007 11.857c.069-.382.619-.798 1.651-1.214Z" />
    </svg>
  ),
}

export default function FooterLinkItem({ item }: Props) {
  const { className, label, to } = item
  const icon = socialIcons[className as keyof typeof socialIcons]

  if (!icon || !to) return <OriginalLinkItem item={item} />

  return (
    <Link
      className="footer__link-item footer-social-link"
      to={to}
      aria-label={label}
      title={label}
    >
      {icon}
    </Link>
  )
}
