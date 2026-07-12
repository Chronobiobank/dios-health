'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import type { ReactNode } from 'react'

import {
  APP_BOTTOM_NAV,
  APP_POST_FAB,
  isAppBottomNavActive,
  type AppBottomNavItem,
} from '@/lib/deepdose-marketing/app-bottom-nav'
import { isDeepdoseProductPath } from '@/lib/deepdose-marketing/site-nav-links'
import { useIsClient } from '@/lib/react/use-is-client'
import { cn } from '@/lib/utils/cn'

function NavIcon({ id }: { id: AppBottomNavItem['id'] }) {
  const common = {
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.75,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    'aria-hidden': true,
    focusable: false as const,
    className: 'app-bottom-nav__icon',
  }

  switch (id) {
    case 'home':
      return (
        <svg {...common}>
          <path d="M4.5 10.5 12 4.75l7.5 5.75" />
          <path d="M7 10v8.25h10V10" />
        </svg>
      )
    case 'sync':
      return (
        <svg {...common}>
          <circle cx="9" cy="8.5" r="3.25" />
          <circle cx="16.25" cy="9.25" r="2.75" />
          <path d="M3.75 19.25c1.1-3.35 3.2-5 5.25-5s4.15 1.65 5.25 5" />
          <path d="M13.5 14.75c1.35-.55 2.85-.35 4.1.85 1 .95 1.55 2.35 1.65 3.65" />
        </svg>
      )
    case 'score':
      return (
        <svg {...common}>
          <path d="M5.5 18.5V10.75" />
          <path d="M12 18.5V6.5" />
          <path d="M18.5 18.5v-5.25" />
        </svg>
      )
  }
}

/** Black circle to the right of the pill — + icon + Post label (same stack as nav tabs). */
export function AppPostFab() {
  const pathname = usePathname() ?? '/'
  const product = isDeepdoseProductPath(pathname)
  const onLog = pathname === '/dose' || pathname.startsWith('/dose/')

  if (!product || onLog) return null

  return (
    <Link href={APP_POST_FAB.href} className="app-post-fab" aria-label={APP_POST_FAB.label}>
      <svg
        className="app-bottom-nav__icon"
        viewBox="0 0 24 24"
        width="24"
        height="24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
      >
        <path d="M12 6.75v10.5M6.75 12h10.5" />
      </svg>
      <span className="app-bottom-nav__label">{APP_POST_FAB.label}</span>
    </Link>
  )
}

export function AppBottomNav() {
  const pathname = usePathname() ?? '/'
  // Pathname can disagree between SSR HTML and the first client pass — only
  // mark active after mount so aria-current / active class stay hydration-safe.
  const mounted = useIsClient()

  return (
    <nav className="app-bottom-nav" aria-label="Primary">
      <div className="app-bottom-nav__bar">
        <ul className="app-bottom-nav__list">
          {APP_BOTTOM_NAV.map((item) => {
            const active = mounted && isAppBottomNavActive(item.href, pathname)
            return (
              <li key={item.id} className="app-bottom-nav__item">
                <Link
                  href={item.href}
                  className={cn(
                    'app-bottom-nav__link',
                    active && 'app-bottom-nav__link--active'
                  )}
                  aria-current={active ? 'page' : undefined}
                >
                  <NavIcon id={item.id} />
                  <span className="app-bottom-nav__label">{item.label}</span>
                </Link>
              </li>
            )
          })}
        </ul>
      </div>
    </nav>
  )
}

export function AppBottomNavSpacer(): ReactNode {
  return <div className="app-bottom-nav__spacer" aria-hidden />
}
