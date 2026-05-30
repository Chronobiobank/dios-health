'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { CLINIC_ROUTES } from '@/lib/auth/routes'
import { cn } from '@/lib/utils'

const TABS = [
  { label: 'Patients', href: CLINIC_ROUTES.panel, match: (path: string) => path === CLINIC_ROUTES.panel },
  {
    label: 'Insights',
    href: CLINIC_ROUTES.patients,
    match: (path: string) => path === CLINIC_ROUTES.patients,
  },
  {
    label: 'Settings',
    href: CLINIC_ROUTES.panel,
    match: () => false,
  },
] as const

export function ClinicBottomNav() {
  const pathname = usePathname()

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 border-t border-black/10 bg-white/95 backdrop-blur-md md:static md:mt-12 md:border-t md:bg-transparent md:backdrop-blur-none"
      aria-label="Clinician panel"
    >
      <ul className="mx-auto flex max-w-4xl items-stretch justify-around px-2 py-2 md:justify-start md:gap-6 md:px-0">
        {TABS.map((tab) => {
          const active = tab.match(pathname)

          return (
            <li key={tab.label} className="flex-1 md:flex-none">
              <Link
                href={tab.href}
                className={cn(
                  'type-nav flex h-11 items-center justify-center rounded-lg px-3 transition-colors md:h-auto md:py-2',
                  active ? 'font-medium text-black' : 'text-black/50 hover:text-black'
                )}
                aria-current={active ? 'page' : undefined}
              >
                {tab.label}
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
