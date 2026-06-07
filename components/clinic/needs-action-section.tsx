import Link from 'next/link'

import { StatusPill } from '@/components/clinic/status-pill'
import { DATA_LABEL, SECTION_LABEL } from '@/components/dashboard/dashboard-styles'
import { FlagBadge } from '@/components/ui/flag-badge'
import type { DemoClinicPatient } from '@/lib/clinic/demo-patients'
import { CLINIC_ROUTES } from '@/lib/auth/routes'
import { cn } from '@/lib/utils'

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
                <dl className="mt-4 grid gap-3 text-sm">
                  {patient.alertReason ? (
                    <div>
                      <dt className={DATA_LABEL}>Alert</dt>
                      <dd className="mt-1 text-[13px] leading-relaxed text-black/70">
                        {patient.alertReason}
                      </dd>
                    </div>
                  ) : null}
                  <div className="flex flex-wrap gap-2">
                    {patient.topRiskNodes.map((node) => (
                      <FlagBadge
                        key={node.label}
                        label={`${node.label} · ${node.risk}`}
                        severity={
                          node.risk === 'high'
                            ? 'red'
                            : node.risk === 'elevated' || node.risk === 'moderate'
                              ? 'amber'
                              : 'green'
                        }
                      />
                    ))}
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <dt className={DATA_LABEL}>MLux</dt>
                      <dd
                        className={cn(
                          'mt-1 font-mono text-data-md font-semibold tabular-nums',
                          patient.mluxScore < 100
                            ? 'text-status-red'
                            : patient.mluxScore < 250
                              ? 'text-status-amber'
                              : 'text-status-green'
                        )}
                      >
                        {patient.mluxScore}{' '}
                        <span className="text-data-xs font-normal text-black/40">m-EDI</span>
                      </dd>
                    </div>
                    <div>
                      <dt className={DATA_LABEL}>Adherence</dt>
                      <dd
                        className={cn(
                          'mt-1 font-mono text-data-md font-semibold tabular-nums',
                          patient.adherenceRate >= 90
                            ? 'text-status-green'
                            : patient.adherenceRate >= 70
                              ? 'text-status-amber'
                              : 'text-status-red'
                        )}
                      >
                        {patient.adherenceRate}%
                      </dd>
                    </div>
                    <div>
                      <dt className={DATA_LABEL}>DINA</dt>
                      <dd className="mt-1 font-mono text-data-md font-semibold tabular-nums text-black">
                        {patient.vayaSessionsLast30}
                        <span className="text-data-xs font-normal text-black/40">/30</span>
                      </dd>
                    </div>
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
