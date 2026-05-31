import Link from 'next/link'
import { Bell } from 'lucide-react'

import { ProfileAvatar } from '@/components/profile/profile-avatar'
import { PATIENT_ROUTES } from '@/lib/auth/routes'
import { cn } from '@/lib/utils'

type PatientTopBarProps = {
  fullName: string
  avatarUrl?: string | null
  greeting?: string
  subtitle?: string
}

export function PatientTopBar({ fullName, avatarUrl, greeting, subtitle }: PatientTopBarProps) {
  const hasGreeting = Boolean(greeting)

  return (
    <div className={cn('dios-page-actions', hasGreeting && 'dios-page-actions--with-greeting')}>
      {hasGreeting ? (
        <div className="min-w-0 flex-1 pr-3">
          <p className="truncate text-lg font-semibold leading-tight tracking-tight text-black sm:text-xl">
            {greeting}
          </p>
          {subtitle ? (
            <p className="mt-1 line-clamp-2 text-[13px] leading-snug text-black/55">{subtitle}</p>
          ) : null}
        </div>
      ) : null}

      <div className="flex shrink-0 items-center gap-2 sm:gap-3">
        <button
          type="button"
          className="dios-page-actions__icon-btn"
          aria-label="Notifications"
        >
          <Bell className="h-5 w-5" strokeWidth={1.75} />
        </button>
        <Link href={PATIENT_ROUTES.dataControls} aria-label="Profile and settings">
          <ProfileAvatar name={fullName} src={avatarUrl} size="sm" />
        </Link>
      </div>
    </div>
  )
}
