'use client'

import { Bell } from 'lucide-react'

import { resolveDashboardAvatar } from '@/components/patient-dashboard/constants'
import { ProfileAvatar } from '@/components/profile/profile-avatar'
import { cn } from '@/lib/utils'

type DashboardNavProps = {
  greeting: string
  fullName: string
  avatarUrl: string | null
}

export function DashboardNav({ greeting, fullName, avatarUrl }: DashboardNavProps) {
  const avatarSrc = resolveDashboardAvatar(avatarUrl)

  return (
    <header
      className={cn(
        'relative z-20 border-b bg-transparent',
        'border-[var(--color-border)]'
      )}
    >
      <div className="mx-auto w-full max-w-[480px] px-4 py-4 sm:max-w-[640px]">
        <div className="flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <ProfileAvatar
              name={fullName}
              src={avatarSrc}
              size="sm"
              className="h-11 w-11 ring-2 ring-white/55"
            />
            <h1 className="truncate text-2xl font-bold text-[var(--text-primary)]">{greeting}</h1>
          </div>
          <button
            type="button"
            className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[var(--text-primary)] hover:bg-white/30"
            aria-label="Notifications"
          >
            <Bell className="h-[18px] w-[18px]" strokeWidth={1.75} />
          </button>
        </div>
      </div>
    </header>
  )
}
