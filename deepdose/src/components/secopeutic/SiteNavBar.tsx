'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

import SignOutButton from '@/components/auth/SignOutButton'
import { DeepdoseWordmark } from '@/components/brand/DeepdoseWordmark'
import { cn } from '@/lib/utils/cn'

export type SiteNavLink = { href: string; label: string }

type SiteNavBarProps = {
  brandHref: string
  brandAriaLabel: string
  navAriaLabel: string
  links: readonly SiteNavLink[]
  /** Prominent right-aligned call to action (e.g. Sign in). */
  cta?: SiteNavLink
  /** Render the supabase sign-out action as the trailing control. */
  signOut?: boolean
}

/**
 * Shared maven-style nav used across public, patient, clinical and enterprise
 * shells — inline links + trailing action on desktop, animated hamburger
 * dropdown on mobile.
 */
export function SiteNavBar({
  brandHref,
  brandAriaLabel,
  navAriaLabel,
  links,
  cta,
  signOut,
}: SiteNavBarProps) {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  useEffect(() => {
    setOpen(false)
  }, [pathname])

  useEffect(() => {
    if (!open) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open])

  return (
    <header className={cn('clinical-site-nav seco-nav', open && 'seco-nav--open')}>
      <Link href={brandHref} className="clinical-site-nav__brand" aria-label={brandAriaLabel}>
        <DeepdoseWordmark />
      </Link>

      <nav className="seco-nav__desktop" aria-label={navAriaLabel}>
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={cn('seco-nav__link', pathname === link.href && 'seco-nav__link--active')}
          >
            {link.label}
          </Link>
        ))}
        {cta ? (
          <Link href={cta.href} className="seco-nav__cta">
            {cta.label}
          </Link>
        ) : null}
        {signOut ? <SignOutButton className="seco-nav__link" /> : null}
      </nav>

      <button
        type="button"
        className="seco-nav__toggle"
        aria-expanded={open}
        aria-controls="seco-nav-menu"
        aria-label={open ? 'Close menu' : 'Open menu'}
        onClick={() => setOpen((value) => !value)}
      >
        <span className="seco-nav__toggle-bars" aria-hidden="true">
          <span />
          <span />
          <span />
        </span>
      </button>

      <button
        type="button"
        className="seco-nav__backdrop"
        aria-hidden="true"
        tabIndex={-1}
        onClick={() => setOpen(false)}
      />

      <div id="seco-nav-menu" className="seco-nav__panel" role="dialog" aria-label={navAriaLabel}>
        <nav className="seco-nav__panel-links" aria-label={`${navAriaLabel} menu`}>
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'seco-nav__panel-link',
                pathname === link.href && 'seco-nav__panel-link--active'
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>
        {cta ? (
          <Link href={cta.href} className="seco-nav__panel-cta">
            {cta.label}
          </Link>
        ) : null}
        {signOut ? <SignOutButton className="seco-nav__panel-cta" /> : null}
      </div>
    </header>
  )
}
