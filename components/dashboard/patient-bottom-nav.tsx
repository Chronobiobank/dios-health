'use client'

import { Bot, House, Lightbulb, SlidersHorizontal } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import type { LucideIcon } from 'lucide-react'

import { PATIENT_ROUTES } from '@/lib/auth/routes'
import { cn } from '@/lib/utils'

type NavTab = {
  label: string
  href: string
  icon: LucideIcon
  match: (path: string) => boolean
}

const TABS: NavTab[] = [
  {
    label: 'Home',
    href: PATIENT_ROUTES.dashboard,
    icon: House,
    match: (path) => path === PATIENT_ROUTES.dashboard,
  },
  {
    label: 'Vaya',
    href: PATIENT_ROUTES.vaya,
    icon: Bot,
    match: (path) =>
      path === PATIENT_ROUTES.vaya || path === PATIENT_ROUTES.timebot,
  },
  {
    label: 'Insights',
    href: PATIENT_ROUTES.insights,
    icon: Lightbulb,
    match: (path) => path === PATIENT_ROUTES.insights,
  },
  {
    label: 'Settings',
    href: PATIENT_ROUTES.dataControls,
    icon: SlidersHorizontal,
    match: (path) =>
      path === PATIENT_ROUTES.dataControls ||
      path === PATIENT_ROUTES.streams ||
      path === PATIENT_ROUTES.profile,
  },
]

export function PatientBottomNav() {
  const pathname = usePathname()

  return (
    <nav
      className="patient-bottom-nav fixed inset-x-0 bottom-0 z-40 border-t border-black/10 bg-white/95 backdrop-blur-md md:static md:mt-8 md:border-t md:bg-transparent md:backdrop-blur-none"
      aria-label="Patient dashboard"
    >
      <ul className="mx-auto flex max-w-[640px] items-stretch justify-around px-1 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-1 md:justify-start md:gap-8 md:px-0 md:pb-0 md:pt-0">
        {TABS.map((tab) => {
          const active = tab.match(pathname)
          const Icon = tab.icon

          return (
            <li key={tab.href} className="flex-1 md:flex-none">
              <Link
                href={tab.href}
                className={cn(
                  'flex flex-col items-center justify-center gap-1 rounded-lg px-2 py-2 transition-colors md:flex-row md:gap-2 md:px-0 md:py-2',
                  active ? 'text-black' : 'text-black/40 hover:text-black/70'
                )}
                aria-current={active ? 'page' : undefined}
              >
                <Icon
                  className={cn('h-[22px] w-[22px] shrink-0', active ? 'text-black' : 'text-black/40')}
                  strokeWidth={active ? 2 : 1.75}
                  aria-hidden
                />
                <span className={cn('text-[10px] font-medium leading-none', active && 'text-black')}>
                  {tab.label}
                </span>
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
