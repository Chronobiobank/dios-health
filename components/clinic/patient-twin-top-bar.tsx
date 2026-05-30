import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

import { BTN_PRIMARY } from '@/components/sections/layout'
import { CLINIC_ROUTES } from '@/lib/auth/routes'

type PatientTwinTopBarProps = {
  patientId: string
  name: string
  age: number
}

export function PatientTwinTopBar({ patientId, name, age }: PatientTwinTopBarProps) {
  return (
    <header className="flex items-center justify-between gap-3 py-4">
      <div className="flex min-w-0 items-center gap-3">
        <Link
          href={CLINIC_ROUTES.panel}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-black/60 transition-colors hover:bg-black/5 hover:text-black"
          aria-label="Back to clinic panel"
        >
          <ArrowLeft className="h-5 w-5" strokeWidth={1.75} />
        </Link>
        <div className="min-w-0">
          <p className="type-body truncate text-sm font-medium text-black">
            {name} · {age}
          </p>
        </div>
      </div>
      <Link href={CLINIC_ROUTES.consult(patientId)} className={`${BTN_PRIMARY} h-9 shrink-0 px-4 text-sm`}>
        Consultation mode →
      </Link>
    </header>
  )
}
