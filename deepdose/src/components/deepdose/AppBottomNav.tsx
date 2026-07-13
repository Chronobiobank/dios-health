'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import type { ReactNode } from 'react'

import {
  APP_BOTTOM_NAV,
  isAppBottomNavActive,
  type AppBottomNavItem,
} from '@/lib/deepdose-marketing/app-bottom-nav'
import { useSupabaseUser } from '@/lib/auth/use-supabase-user'
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
    case 'post':
      return (
        <svg {...common}>
          <path d="M4.75 8.5A2.25 2.25 0 0 1 7 6.25h2.1l1.15-1.5h3.5L14.9 6.25H17A2.25 2.25 0 0 1 19.25 8.5v9A2.25 2.25 0 0 1 17 19.75H7A2.25 2.25 0 0 1 4.75 17.5v-9Z" />
          <circle cx="12" cy="13" r="3.25" />
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
  }
}

/** Product bottom nav — logged-in members only. */
export function AppBottomNav() {
  const pathname = usePathname() ?? '/'
  const { user, ready } = useSupabaseUser()
  // Pathname can disagree between SSR HTML and the first client pass —
  // mark active after mount so aria-current / active class stay hydration-safe.
  const mounted = useIsClient()

  if (!ready || !user) return null

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
                    item.id === 'post' && 'app-bottom-nav__link--post',
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
  const { user, ready } = useSupabaseUser()
  if (!ready || !user) return null
  return <div className="app-bottom-nav__spacer" aria-hidden />
}

/** @deprecated Post is in the bottom nav pill — no floating FAB. */
export function AppPostFab(): null {
  return null
}
