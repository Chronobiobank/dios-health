'use client'

import { Plus, X } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useId, useRef, useState } from 'react'

import type { MobileNavLink } from '@/lib/auth/mobile-nav-links'
import { cn } from '@/lib/utils'

type MobileOverflowMenuProps = {
  links: MobileNavLink[]
  /** Sticky nav offset — clinical shell uses its own header height token. */
  panelTop?: string
  className?: string
}

function normalizePath(pathname: string): string {
  return pathname.endsWith('/') && pathname.length > 1 ? pathname.slice(0, -1) : pathname
}

export function MobileOverflowMenu({
  links,
  panelTop = 'var(--dios-site-nav-height)',
  className,
}: MobileOverflowMenuProps) {
  const pathname = usePathname()
  const normalizedPath = normalizePath(pathname)
  const [open, setOpen] = useState(false)
  const menuId = useId()
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setOpen(false)
  }, [pathname])

  useEffect(() => {
    if (!open) return

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }

    const onPointerDown = (event: MouseEvent | TouchEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false)
    }

    document.addEventListener('keydown', onKeyDown)
    document.addEventListener('mousedown', onPointerDown)
    document.addEventListener('touchstart', onPointerDown)

    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.removeEventListener('mousedown', onPointerDown)
      document.removeEventListener('touchstart', onPointerDown)
    }
  }, [open])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  return (
    <div ref={rootRef} className={cn('mobile-overflow-menu', className)}>
      <button
        type="button"
        className="mobile-overflow-menu__trigger"
        aria-expanded={open}
        aria-controls={menuId}
        aria-haspopup="menu"
        aria-label={open ? 'Close pages menu' : 'Open pages menu'}
        onClick={() => setOpen((value) => !value)}
      >
        {open ? (
          <X className="h-5 w-5" strokeWidth={1.75} aria-hidden />
        ) : (
          <Plus className="h-5 w-5" strokeWidth={1.75} aria-hidden />
        )}
      </button>

      {open ? (
        <>
          <div
            className="mobile-overflow-menu__backdrop"
            style={{ top: panelTop }}
            aria-hidden
            onClick={() => setOpen(false)}
          />

          <nav
            id={menuId}
            aria-label="All pages"
            className="mobile-overflow-menu__panel"
            style={{ top: panelTop }}
          >
            <p className="mobile-overflow-menu__eyebrow">All pages</p>
            <ul className="mobile-overflow-menu__list">
              {links.map((link) => {
                const active =
                  normalizedPath === link.href ||
                  (link.href !== '/' && normalizedPath.startsWith(`${link.href}/`))

                return (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className={cn(
                        'mobile-overflow-menu__link',
                        active && 'mobile-overflow-menu__link--active'
                      )}
                      aria-current={active ? 'page' : undefined}
                      onClick={() => setOpen(false)}
                    >
                      {link.label}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </nav>
        </>
      ) : null}
    </div>
  )
}
