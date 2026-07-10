'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState, type ReactNode } from 'react'

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
    strokeWidth: 1.5,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    'aria-hidden': true,
    focusable: false as const,
    className: 'app-bottom-nav__icon',
  }

  switch (id) {
    case 'real':
      return (
        <svg {...common}>
          <rect x="4" y="5" width="16" height="14" rx="2.5" />
          <circle cx="9" cy="10" r="1.75" />
          <path d="M4.5 16.5 9 13l3 2.5 3.5-4 4 5" />
        </svg>
      )
    case 'friends':
      return (
        <svg {...common}>
          <circle cx="9" cy="9" r="3" />
          <circle cx="16" cy="10.5" r="2.5" />
          <path d="M3.75 19c.85-2.35 2.55-3.5 5.25-3.5s4.4 1.15 5.25 3.5" />
          <path d="M13.5 19c.45-1.45 1.5-2.2 3.1-2.2 1.4 0 2.4.65 2.95 1.85" />
        </svg>
      )
    case 'post':
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="8.25" />
          <circle cx="12" cy="12" r="4.25" />
        </svg>
      )
    case 'chat':
      return (
        <svg {...common}>
          <path d="M4.5 6.75h15a1.25 1.25 0 0 1 1.25 1.25v7a1.25 1.25 0 0 1-1.25 1.25H11l-3.75 2.75v-2.75H4.5A1.25 1.25 0 0 1 3.25 15V8A1.25 1.25 0 0 1 4.5 6.75z" />
        </svg>
      )
    case 'profile':
      return (
        <svg {...common}>
          <circle cx="12" cy="8" r="3.25" />
          <path d="M5.5 19.25c1.35-3.1 3.55-4.6 6.5-4.6s5.15 1.5 6.5 4.6" />
        </svg>
      )
  }
}

export function AppBottomNav() {
  const pathname = usePathname() ?? '/'
  const [ready, setReady] = useState(false)

  useEffect(() => {
    setReady(true)
  }, [])

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
                  item.id === 'post' && 'app-bottom-nav__item--post'
                )}
              >
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

/** Spacer so page content clears the fixed bottom nav. */
export function AppBottomNavSpacer(): ReactNode {
  return <div className="app-bottom-nav__spacer" aria-hidden />
}
