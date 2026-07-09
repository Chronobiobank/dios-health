'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import type { ReactNode } from 'react'

import {
  APP_BOTTOM_NAV,
  isAppBottomNavActive,
  type AppBottomNavItem,
} from '@/lib/deepdose-marketing/app-bottom-nav'
import { cn } from '@/lib/utils/cn'

function NavIcon({ id }: { id: AppBottomNavItem['id'] }) {
  const common = {
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.6,
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
          <path d="M4 10.5 12 4l8 6.5V20a1 1 0 0 1-1 1h-5v-6H10v6H5a1 1 0 0 1-1-1v-9.5z" />
        </svg>
      )
    case 'profile':
      return (
        <svg {...common}>
          <circle cx="12" cy="8" r="3.25" />
          <path d="M5.5 19.5c1.4-3.2 3.7-4.75 6.5-4.75s5.1 1.55 6.5 4.75" />
        </svg>
      )
    case 'dosage':
      return (
        <svg {...common}>
          <rect x="8.5" y="3.5" width="7" height="17" rx="3.5" />
          <path d="M8.5 12h7" />
        </svg>
      )
    case 'share':
      return (
        <svg {...common}>
          <circle cx="6.5" cy="12" r="2.25" />
          <circle cx="17.5" cy="6.5" r="2.25" />
          <circle cx="17.5" cy="17.5" r="2.25" />
          <path d="m8.4 10.9 5.2-3.1M8.4 13.1l5.2 3.1" />
        </svg>
      )
    case 'connect':
      return (
        <svg {...common}>
          <path d="M8.5 14.5a3.5 3.5 0 1 1 0-7 3.5 3.5 0 0 1 0 7z" />
          <path d="M15.5 16.5a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" />
          <path d="M3.5 19.5c.9-2.4 2.6-3.6 5-3.6s4.1 1.2 5 3.6" />
          <path d="M13.2 19.5c.5-1.5 1.6-2.3 3.3-2.3 1.5 0 2.6.7 3.2 2" />
        </svg>
      )
  }
}

export function AppBottomNav() {
  const pathname = usePathname() ?? '/'

  return (
    <nav className="app-bottom-nav" aria-label="Primary">
      <div className="app-bottom-nav__bar">
        <ul className="app-bottom-nav__list">
          {APP_BOTTOM_NAV.map((item) => {
            const active = isAppBottomNavActive(item.href, pathname)
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

/** Spacer so page content clears the fixed bottom nav. */
export function AppBottomNavSpacer(): ReactNode {
  return <div className="app-bottom-nav__spacer" aria-hidden />
}
