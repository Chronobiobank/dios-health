import Link from 'next/link'

import { StatusPill } from '@/components/clinic/status-pill'
import { SECTION_LABEL } from '@/components/dashboard/dashboard-styles'
import type { DemoClinicPatient } from '@/lib/clinic/demo-patients'
import { CLINIC_ROUTES } from '@/lib/auth/routes'

type NeedsActionSectionProps = {
  patients: DemoClinicPatient[]
}

const NEEDS_ACTION_CARD =
  'block rounded-2xl border-[0.5px] border-black/[0.08] border-l-[3px] border-l-teal-600 bg-teal-50 p-5 shadow-[0_2px_12px_rgba(0,0,0,0.06)] transition-colors hover:border-black/20'

export function NeedsActionSection({ patients }: NeedsActionSectionProps) {
  return (
    <section className="mt-8">
      <h2 className={SECTION_LABEL}>Needs action</h2>

      {patients.length === 0 ? (
        <p className="mt-4 rounded-2xl border-[0.5px] border-black/[0.08] bg-white p-5 text-sm text-black/70">
          All patients are on track today.
        </p>
      ) : (
        <ul className="mt-4 space-y-3">
          {patients.map((patient) => (
            <li key={patient.id}>
              <Link href={CLINIC_ROUTES.patient(patient.id)} className={NEEDS_ACTION_CARD}>
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-medium text-black">
                      {patient.displayName} · {patient.drug}
                    </p>
                    <p className="mt-2 text-sm text-black/80">{patient.finding}</p>
                  </div>
                  <StatusPill status={patient.status} />
                </div>
                <dl className="mt-4 grid gap-2 text-sm">
                  <div>
                    <dt className="font-mono text-[11px] uppercase tracking-[0.08em] text-black/45">
                      Body clock
                    </dt>
                    <dd className="text-black/70">{patient.bodyClock}</dd>
                  </div>
                  <div>
                    <dt className="font-mono text-[11px] uppercase tracking-[0.08em] text-black/45">Data</dt>
                    <dd className="text-black/70">{patient.data}</dd>
                  </div>
                </dl>
                <span className="mt-4 inline-block text-sm font-medium text-black">Review →</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
