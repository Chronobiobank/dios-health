'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import type { ReactNode } from 'react'

import {
  APP_BOTTOM_NAV,
  isAppBottomNavActive,
  type AppBottomNavItem,
} from '@/lib/deepdose-marketing/app-bottom-nav'
import { useIsClient } from '@/lib/react/use-is-client'
import { cn } from '@/lib/utils/cn'

function NavIcon({ id }: { id: AppBottomNavItem['id'] }) {
  const common = {
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.5,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    'aria-hidden': true,
    focusable: false as const,
    className: 'app-bottom-nav__icon',
  }

  switch (id) {
    case 'grid':
      return (
        <svg {...common}>
          <rect x="4" y="4" width="7" height="7" rx="1.25" />
          <rect x="13" y="4" width="7" height="7" rx="1.25" />
          <rect x="4" y="13" width="7" height="7" rx="1.25" />
          <rect x="13" y="13" width="7" height="7" rx="1.25" />
        </svg>
      )
    case 'dose':
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="8.25" />
          <circle cx="12" cy="12" r="4.25" />
        </svg>
      )
    case 'friends':
      return (
        <svg {...common}>
          <circle cx="9" cy="8.5" r="3.25" />
          <circle cx="16.25" cy="9.25" r="2.75" />
          <path d="M3.75 19.25c1.1-3.35 3.2-5 5.25-5s4.15 1.65 5.25 5" />
          <path d="M13.5 14.75c1.35-.55 2.85-.35 4.1.85 1 .95 1.55 2.35 1.65 3.65" />
        </svg>
      )
    case 'bank':
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="8.25" />
          <path d="M12 7.75v8.5M9.25 10.25h5.5M9.25 13.75h5.5" />
        </svg>
      )
    case 'me':
      return (
        <svg {...common}>
          <circle cx="12" cy="8" r="3.75" />
          <path d="M4.75 20c1.5-3.75 4-5.5 7.25-5.5s5.75 1.75 7.25 5.5" />
        </svg>
      )
  }
}

export function AppBottomNav() {
  const pathname = usePathname() ?? '/'
  const ready = useIsClient()

  return (
    <nav className="app-bottom-nav" aria-label="Primary">
      <div className="app-bottom-nav__bar">
        <ul className="app-bottom-nav__list">
          {APP_BOTTOM_NAV.map((item) => {
            const active = ready && isAppBottomNavActive(item.href, pathname)
            return (
              <li
                key={item.id}
                className={cn(
                  'app-bottom-nav__item',
                  item.id === 'dose' && 'app-bottom-nav__item--post'
                )}
              >
                <Link
                  href={item.href}
                  className={cn(
                    'app-bottom-nav__link',
                    item.id === 'dose' && 'app-bottom-nav__link--post',
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
