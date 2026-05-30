import Link from 'next/link'
import { Bell } from 'lucide-react'

import { DIOS_WORDMARK } from '@/components/DiosLogo'
import { ProfileAvatar } from '@/components/profile/profile-avatar'
import { PATIENT_ROUTES } from '@/lib/auth/routes'

type PatientTopBarProps = {
  fullName: string
  avatarUrl?: string | null
}

export function PatientTopBar({ fullName, avatarUrl }: PatientTopBarProps) {
  return (
    <header className="flex items-center justify-between gap-4 py-4">
      <Link href={PATIENT_ROUTES.dashboard} className="dios-wordmark text-lg text-black" aria-label="DIOS — home">
        {DIOS_WORDMARK}
      </Link>
      <div className="flex items-center gap-3">
        <button
          type="button"
          className="flex h-9 w-9 items-center justify-center rounded-full text-black/60 transition-colors hover:bg-black/5 hover:text-black"
          aria-label="Notifications"
        >
          <Bell className="h-5 w-5" strokeWidth={1.75} />
        </button>
        <Link href={PATIENT_ROUTES.dataControls} aria-label="Profile and settings">
          <ProfileAvatar name={fullName} src={avatarUrl} size="sm" />
        </Link>
      </div>
    </header>
  )
}
