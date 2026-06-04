'use client'

import { Bell } from 'lucide-react'

import { initialsFromName } from '@/lib/profile/avatar'

type DashboardNavProps = {
  firstName: string
  fullName: string
}

export function DashboardNav({ firstName, fullName }: DashboardNavProps) {
  const initials = initialsFromName(fullName)

  return (
    <header className="patient-dashboard-nav relative z-10 bg-transparent">
      <div className="flex w-full min-w-0 items-center justify-between gap-3 py-4">
        <span className="patient-dashboard-nav__greeting min-w-0 truncate">
          Kia ora, {firstName}.
        </span>
        <div className="flex shrink-0 items-center gap-2">
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
    </header>
  )
}
