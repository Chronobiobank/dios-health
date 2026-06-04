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
    label: 'Coach',
    href: PATIENT_ROUTES.coach,
    icon: Bot,
    match: (path) =>
      path === PATIENT_ROUTES.coach ||
      path === PATIENT_ROUTES.mel ||
      path === PATIENT_ROUTES.timebot,
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

type NavLinkProps = {
  tab: NavTab
  active: boolean
  variant: 'bottom' | 'side'
}

function NavLink({ tab, active, variant }: NavLinkProps) {
  const Icon = tab.icon
  const isBottom = variant === 'bottom'

  return (
    <Link
      href={tab.href}
      className={cn(
        'transition-colors',
        isBottom
          ? cn(
              'flex min-h-[var(--patient-nav-height)] flex-1 flex-col items-center justify-center gap-0.5 rounded-xl px-2 py-1.5',
              'sm:gap-1 sm:py-2',
              'md:flex-row md:gap-2.5 md:px-4'
            )
          : 'flex w-full items-center gap-3 rounded-xl px-3 py-2.5',
        active
          ? isBottom
            ? 'text-black'
            : 'bg-black/[0.05] text-black'
          : isBottom
            ? 'text-black/45 hover:text-black/70'
            : 'text-black/50 hover:bg-black/[0.03] hover:text-black/80'
      )}
      aria-current={active ? 'page' : undefined}
    >
      <Icon
        className={cn(
          'shrink-0',
          isBottom ? 'h-[22px] w-[22px] sm:h-6 sm:w-6' : 'h-5 w-5',
          active ? 'text-black' : 'text-black/45'
        )}
        strokeWidth={active ? 2 : 1.75}
        aria-hidden
      />
      <span
        className={cn(
          'font-medium leading-none',
          isBottom
            ? 'text-[10px] sm:text-[11px] md:text-[13px]'
            : 'text-[14px]'
        )}
      >
        {tab.label}
      </span>
    </Link>
  )
}

export function PatientBottomNav() {
  const pathname = usePathname()

  return (
    <>
      <nav
        className="patient-bottom-nav fixed inset-x-0 bottom-0 z-40 border-t border-black/10 bg-white/95 backdrop-blur-md lg:hidden"
        aria-label="Patient dashboard"
      >
        <ul className="mx-auto flex max-w-[640px] items-stretch justify-around px-2 pb-[env(safe-area-inset-bottom,0px)] pt-1 sm:px-4 md:max-w-[42rem] md:justify-evenly md:px-6">
          {TABS.map((tab) => (
            <li key={tab.href} className="flex min-w-0 flex-1 md:max-w-[9rem]">
              <NavLink tab={tab} active={tab.match(pathname)} variant="bottom" />
            </li>
          ))}
        </ul>
      </nav>

      <nav
        className="patient-side-nav fixed inset-y-0 left-0 z-40 hidden w-[var(--patient-sidebar-width)] flex-col border-r border-black/10 bg-white lg:flex"
        aria-label="Patient dashboard"
      >
        <ul className="flex flex-col gap-1 px-3 py-6">
          {TABS.map((tab) => (
            <li key={tab.href}>
              <NavLink tab={tab} active={tab.match(pathname)} variant="side" />
            </li>
          ))}
        </ul>
      </nav>
    </>
  )
}
