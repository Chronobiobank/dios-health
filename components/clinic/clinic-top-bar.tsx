import Link from 'next/link'
import { Search, UserPlus } from 'lucide-react'

import { ProfileAvatar } from '@/components/profile/profile-avatar'
import { CLINIC_ROUTES } from '@/lib/auth/routes'

type ClinicTopBarProps = {
  fullName: string
  avatarUrl?: string | null
}

export function ClinicTopBar({ fullName, avatarUrl }: ClinicTopBarProps) {
  return (
    <div className="dios-page-actions">
      <button type="button" className="dios-page-actions__icon-btn" aria-label="Search patients">
        <Search className="h-5 w-5" strokeWidth={1.75} />
      </button>
      <a href="#invite-patient" className="dios-page-actions__icon-btn" aria-label="Invite a patient">
        <UserPlus className="h-5 w-5" strokeWidth={1.75} />
      </a>
      <Link href={CLINIC_ROUTES.settings} aria-label="Profile and settings">
        <ProfileAvatar name={fullName} src={avatarUrl} size="sm" />
      </Link>
    </div>
  )
}
