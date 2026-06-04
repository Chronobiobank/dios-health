'use client'

import Link from 'next/link'
import { Bell, SlidersHorizontal } from 'lucide-react'

import { ProfileAvatar } from '@/components/profile/profile-avatar'
import { PATIENT_ROUTES } from '@/lib/auth/routes'

type DashboardNavProps = {
  greeting: string
  fullName: string
  avatarUrl: string | null
}

export function DashboardNav({ greeting, fullName, avatarUrl }: DashboardNavProps) {
  return (
    <header className="patient-dashboard-nav relative z-10 bg-transparent">
      <div className="flex w-full min-w-0 items-center justify-between gap-3 py-4">
        <span className="patient-dashboard-nav__greeting min-w-0 truncate">{greeting}</span>
        <div className="flex shrink-0 items-center gap-2">
          <button
            type="button"
            className="inline-flex items-center justify-center text-[var(--text-primary)]"
            aria-label="Notifications"
          >
            <Bell size={18} strokeWidth={1.75} />
          </button>
          <Link
            href={PATIENT_ROUTES.profile}
            className="inline-flex items-center justify-center text-[var(--text-primary)]"
            aria-label="Profile and settings"
          >
            <SlidersHorizontal size={18} strokeWidth={1.75} />
          </Link>
          <Link href={PATIENT_ROUTES.profile} aria-label="Your profile photo">
            <ProfileAvatar name={fullName} src={avatarUrl} size="sm" />
          </Link>
        </div>
      </div>
    </header>
  )
}
