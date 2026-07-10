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
    case 'bank':
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="8.25" />
          <path d="M12 8v8M9.5 10.5h5M9.5 13.5h5" />
        </svg>
      )
    case 'me':
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
        <ul className="app-bottom-nav__list app-bottom-nav__list--4">
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
