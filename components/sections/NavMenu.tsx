'use client'

import { Menu, X } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useId, useRef, useState } from 'react'

import { SignOutButton } from '@/components/auth/sign-out-button'
import { HashLink } from '@/components/sections/HashLink'
import { COACH_ASK_LABEL } from '@/lib/coach/brand'
import { cn } from '@/lib/utils'

import { PATIENT_ROUTES } from '@/lib/auth/routes'

import {
  AUTH_LINKS,
  isPatientDashboardPath,
  NAV_DASHBOARD_LINK,
  NAV_MENU_LINKS,
} from './navigation'

type NavMenuProps = {
  isAuthenticated?: boolean
  coachHref: string
}

export function NavMenu({ isAuthenticated = false, coachHref }: NavMenuProps) {
  const pathname = usePathname()
  const onDashboard = isPatientDashboardPath(pathname)
  const [open, setOpen] = useState(false)
  const menuId = useId()
  const rootRef = useRef<HTMLDivElement>(null)

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
    <div ref={rootRef} className="dios-site-nav__coach-menu">
      <Link href={coachHref} className="dios-site-nav__ask-dios type-button" aria-label={COACH_ASK_LABEL}>
        {COACH_ASK_LABEL}
      </Link>
      <button
        type="button"
        className="dios-site-nav__menu-trigger"
        aria-expanded={open}
        aria-controls={menuId}
        aria-haspopup="menu"
        aria-label={open ? 'Close menu' : 'Open menu'}
        onClick={() => setOpen((value) => !value)}
      >
        {open ? <X className="h-5 w-5" strokeWidth={1.75} /> : <Menu className="h-5 w-5" strokeWidth={1.75} />}
      </button>

      {open ? (
        <>
          <div className="dios-site-nav__menu-backdrop md:hidden" aria-hidden onClick={() => setOpen(false)} />

          <nav
            id={menuId}
            aria-label="Menu"
            className={cn('dios-site-nav__menu-panel', 'md:shadow-lg')}
          >
            <ul className="flex flex-col gap-1">
              {NAV_MENU_LINKS.map((link) => (
                <li key={link.label}>
                  <HashLink
                    href={link.href}
                    className="type-nav block rounded-lg px-3 py-2.5 transition-colors hover:bg-black/[0.03] hover:text-black md:py-2"
                    onClick={() => setOpen(false)}
                  >
                    {link.label}
                  </HashLink>
                </li>
              ))}
            </ul>

            <div className="my-3 border-t border-black/10 md:mx-2" />

            <ul className="flex flex-col gap-1">
              {isAuthenticated ? (
                <>
                  {!onDashboard ? (
                    <li>
                      <HashLink
                        href={NAV_DASHBOARD_LINK.href}
                        className="type-nav block rounded-lg px-3 py-2.5 transition-colors hover:bg-black/[0.03] hover:text-black md:hidden"
                        onClick={() => setOpen(false)}
                      >
                        {NAV_DASHBOARD_LINK.label}
                      </HashLink>
                    </li>
                  ) : null}
                  <li>
                    <HashLink
                      href={PATIENT_ROUTES.profile}
                      className="type-nav block rounded-lg px-3 py-2.5 transition-colors hover:bg-black/[0.03] hover:text-black"
                      onClick={() => setOpen(false)}
                    >
                      Profile & settings
                    </HashLink>
                  </li>
                  <li>
                    <SignOutButton
                      variant="inline"
                      className="block w-full px-3 py-2.5 text-left md:py-2"
                      label="Sign out"
                    />
                  </li>
                </>
              ) : (
                AUTH_LINKS.map((link) => (
                  <li key={link.label}>
                    <HashLink
                      href={link.href}
                      className="type-nav block rounded-lg px-3 py-2.5 transition-colors hover:bg-black/[0.03] hover:text-black md:py-2"
                      onClick={() => setOpen(false)}
                    >
                      {link.label}
                    </HashLink>
                  </li>
                ))
              )}
            </ul>
          </nav>
        </>
      ) : null}
    </div>
  )
}
