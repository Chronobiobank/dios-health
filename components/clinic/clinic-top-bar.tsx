import Link from 'next/link'
import { Search, UserPlus } from 'lucide-react'

import { DIOS_WORDMARK } from '@/components/DiosLogo'
import { ProfileAvatar } from '@/components/profile/profile-avatar'
import { CLINIC_ROUTES } from '@/lib/auth/routes'

type ClinicTopBarProps = {
  fullName: string
  avatarUrl?: string | null
}

export function ClinicTopBar({ fullName, avatarUrl }: ClinicTopBarProps) {
  return (
    <header className="flex items-center justify-between gap-4 py-4">
      <Link href={CLINIC_ROUTES.panel} className="dios-wordmark text-lg text-black" aria-label="DIOS — home">
        {DIOS_WORDMARK}
      </Link>
      <div className="flex items-center gap-2">
        <button
          type="button"
          className="flex h-9 w-9 items-center justify-center rounded-full text-black/60 transition-colors hover:bg-black/5 hover:text-black"
          aria-label="Search patients"
        >
          <Search className="h-5 w-5" strokeWidth={1.75} />
        </button>
        <a
          href="#invite-patient"
          className="flex h-9 w-9 items-center justify-center rounded-full text-black/60 transition-colors hover:bg-black/5 hover:text-black"
          aria-label="Invite a patient"
        >
          <UserPlus className="h-5 w-5" strokeWidth={1.75} />
        </a>
        <Link href={CLINIC_ROUTES.settings} aria-label="Profile and settings">
          <ProfileAvatar name={fullName} src={avatarUrl} size="sm" />
        </Link>
      </div>
    </header>
  )
}
