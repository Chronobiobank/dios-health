import Link from 'next/link'
import { Search, UserPlus } from 'lucide-react'

import { DIOS_WORDMARK } from '@/components/DiosLogo'
import { CLINIC_ROUTES } from '@/lib/auth/routes'

function initialsFromName(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return '?'
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return `${parts[0][0] ?? ''}${parts[parts.length - 1][0] ?? ''}`.toUpperCase()
}

type ClinicTopBarProps = {
  fullName: string
}

export function ClinicTopBar({ fullName }: ClinicTopBarProps) {
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
        <span
          className="flex h-9 w-9 items-center justify-center rounded-full bg-black text-xs font-medium text-white"
          aria-label={`Signed in as ${fullName}`}
        >
          {initialsFromName(fullName)}
        </span>
      </div>
    </header>
  )
}
