'use client'

import { Bell, Menu } from 'lucide-react'
import Image from 'next/image'

import { LOGO_PATH } from '@/components/patient-dashboard/constants'
import { ProfileAvatar } from '@/components/profile/profile-avatar'
import { cn } from '@/lib/utils'

type DashboardNavProps = {
  greeting: string
  fullName: string
  avatarUrl: string | null
  onOpenCoach: () => void
}

export function DashboardNav({ greeting, fullName, avatarUrl, onOpenCoach }: DashboardNavProps) {
  return (
    <header
      className={cn(
        'relative z-20 border-b bg-transparent',
        'border-[var(--color-border)]'
      )}
    >
      <div className="mx-auto w-full max-w-[480px] px-4 pt-3 sm:max-w-[640px]">
        <div className="flex items-center justify-between gap-3 pb-3">
          <Image
            src={LOGO_PATH}
            alt="DIOS Health"
            width={80}
            height={28}
            priority
            className="h-auto w-[80px] object-contain object-left"
          />
          <div className="flex items-center gap-3">
            <p className="hidden text-sm text-[var(--text-muted)] xs:block">Quantify Your Meds</p>
            <button
              type="button"
              className="inline-flex h-9 w-9 items-center justify-center rounded-full text-[var(--text-primary)] hover:bg-white/30"
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" strokeWidth={1.75} />
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between gap-3 pb-4">
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">{greeting}</h1>
          <div className="flex shrink-0 items-center gap-2">
            <button
              type="button"
              onClick={onOpenCoach}
              className="rounded-full border border-[var(--color-border)] bg-white/45 px-3 py-1.5 text-[13px] font-medium text-[var(--text-primary)] backdrop-blur-sm hover:bg-white/60"
            >
              Ask DIOS
            </button>
            <button
              type="button"
              className="inline-flex h-9 w-9 items-center justify-center rounded-full text-[var(--text-primary)] hover:bg-white/30"
              aria-label="Notifications"
            >
              <Bell className="h-[18px] w-[18px]" strokeWidth={1.75} />
            </button>
            <ProfileAvatar
              name={fullName}
              src={avatarUrl}
              size="sm"
              className="h-9 w-9 bg-[var(--researcher-avatar-bg)] text-[var(--researcher-avatar-text)]"
            />
          </div>
        </div>
      </div>
    </header>
  )
}
