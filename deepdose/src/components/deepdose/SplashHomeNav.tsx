'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

import { DeepdoseWordmark } from '@/components/brand/DeepdoseWordmark'
import { cn } from '@/lib/utils/cn'

const SPLASH_MENU_LINKS = [
  { href: '/clinician-landing', label: 'Clinicians' },
  { href: '/enterprise-landing', label: 'Enterprise' },
  { href: '/login', label: 'Sign In' },
  { href: '/login?signup=1', label: 'Sign Up', cta: true },
] as const

export function SplashHomeNav() {
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
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open])

  return (
    <header className={cn('seco-splash-nav', open && 'seco-splash-nav--open')}>
      <Link href="/" className="seco-splash-nav__brand" aria-label="Deepdose home">
        <DeepdoseWordmark />
      </Link>

      <button
        type="button"
        className="seco-splash-nav__toggle"
        aria-expanded={open}
        aria-controls="seco-splash-nav-panel"
        aria-label={open ? 'Close menu' : 'Open menu'}
        onClick={() => setOpen((value) => !value)}
      >
        <span className="seco-splash-nav__toggle-bars" aria-hidden="true">
          <span />
          <span />
          <span />
        </span>
      </button>

      <button
        type="button"
        className="seco-splash-nav__backdrop"
        aria-hidden="true"
        tabIndex={-1}
        onClick={() => setOpen(false)}
      />

      <div
        id="seco-splash-nav-panel"
        className="seco-splash-nav__panel"
        role="dialog"
        aria-label="Site menu"
      >
        <nav className="seco-splash-nav__panel-links" aria-label="Site links">
          {SPLASH_MENU_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'seco-splash-nav__panel-link',
                'cta' in link && link.cta && 'seco-splash-nav__panel-link--cta',
                pathname === link.href && 'seco-splash-nav__panel-link--active'
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  )
}
