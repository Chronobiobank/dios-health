'use client'

import { Bell, Menu, Search } from 'lucide-react'
import Image from 'next/image'

import { LOGO_PATH } from '@/components/patient-dashboard/constants'
import { initialsFromName } from '@/lib/profile/avatar'

type DashboardNavProps = {
  firstName: string
  fullName: string
  onOpenCoach: () => void
}

export function DashboardNav({ firstName, fullName, onOpenCoach }: DashboardNavProps) {
  const initials = initialsFromName(fullName)

  return (
    <header className="patient-dashboard-nav relative z-10 bg-transparent">
      <div className="space-y-3 py-4">
        <div className="flex w-full min-w-0 items-center justify-between gap-3">
          <Image
            src={LOGO_PATH}
            alt="DIOS"
            width={80}
            height={28}
            priority
            className="patient-dashboard-nav__logo shrink-0"
          />
          <div className="flex min-w-0 shrink items-center gap-2 sm:gap-3">
            <span className="patient-dashboard-nav__tagline hidden truncate sm:inline">
              Quantify Your Meds
            </span>
            <button
              type="button"
              className="inline-flex shrink-0 items-center justify-center text-[var(--text-primary)]"
              aria-label="Menu"
            >
              <Menu size={20} strokeWidth={1.75} />
            </button>
          </div>
        </div>

        <div className="flex w-full min-w-0 items-center justify-between gap-3">
          <span className="patient-dashboard-nav__greeting min-w-0 truncate">
            Kia ora, {firstName}.
          </span>
          <div className="flex shrink-0 items-center gap-2">
            <button
              type="button"
              onClick={onOpenCoach}
              className="patient-dashboard-nav__coach flex items-center gap-2 rounded-full px-3 py-1.5"
              style={{
                background: 'rgba(255,255,255,0.5)',
                border: '1px solid rgba(255,255,255,0.75)',
              }}
            >
              <Search size={14} strokeWidth={1.75} aria-hidden />
              Ask DIOS
            </button>
            <button
              type="button"
              className="inline-flex items-center justify-center text-[var(--text-primary)]"
              aria-label="Notifications"
            >
              <Bell size={18} strokeWidth={1.75} />
            </button>
            <div
              className="flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold text-white"
              style={{ background: 'linear-gradient(135deg, #1D9E75, #0a6a52)' }}
              aria-hidden
            >
              {initials}
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
