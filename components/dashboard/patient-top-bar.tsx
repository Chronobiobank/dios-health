import Link from 'next/link'
import { Bell } from 'lucide-react'

import { ProfileAvatar } from '@/components/profile/profile-avatar'
import { PATIENT_ROUTES } from '@/lib/auth/routes'

type PatientTopBarProps = {
  fullName: string
  avatarUrl?: string | null
}

export function PatientTopBar({ fullName, avatarUrl }: PatientTopBarProps) {
  return (
    <div className="dios-page-actions">
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
  )
}
