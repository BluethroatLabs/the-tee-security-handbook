import { useEffect, useRef } from 'react'
import { useDocsVersionCandidates } from '@docusaurus/plugin-content-docs/client'
import NavbarItem from '@theme/NavbarItem'
import type { Props } from '@theme/NavbarItem/DropdownNavbarItem'
import OriginalDropdown from '@theme-original/NavbarItem/DropdownNavbarItem'

function VersionDropdown({ items, className }: Props) {
  const [version] = useDocsVersionCandidates()
  const dropdownRef = useRef<HTMLDetailsElement>(null)
  const summaryRef = useRef<HTMLElement>(null)

  useEffect(() => {
    function closeOnOutsidePress(event: PointerEvent) {
      const dropdown = dropdownRef.current
      if (dropdown?.open && !dropdown.contains(event.target as Node)) {
        dropdown.open = false
      }
    }

    document.addEventListener('pointerdown', closeOnOutsidePress)
    return () =>
      document.removeEventListener('pointerdown', closeOnOutsidePress)
  }, [])

  return (
    <details
      className={className}
      ref={dropdownRef}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) {
          event.currentTarget.open = false
        }
      }}
      onKeyDown={(event) => {
        if (event.key === 'Escape' && event.currentTarget.open) {
          event.currentTarget.open = false
          summaryRef.current?.focus()
        }
      }}
    >
      <summary
        ref={summaryRef}
        aria-label={`Documentation version ${version.label}`}
      >
        <span>{version.label}</span>
      </summary>
      <ul className="handbook-version-options clean-list">
        {items.map((item, index) => (
          <NavbarItem
            key={item.to ?? index}
            {...item}
            isDropdownItem
            activeClassName="dropdown__link--active"
            onClick={(event) => {
              item.onClick?.(event)
              if (dropdownRef.current) dropdownRef.current.open = false
              summaryRef.current?.focus()
            }}
          />
        ))}
      </ul>
    </details>
  )
}

export default function DropdownNavbarItem(props: Props) {
  if (!props.mobile && props.className === 'handbook-version-switcher') {
    return <VersionDropdown {...props} />
  }

  return <OriginalDropdown {...props} />
}
