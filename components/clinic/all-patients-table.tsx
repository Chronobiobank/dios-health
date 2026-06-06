import Link from 'next/link'

import { SECTION_LABEL } from '@/components/dashboard/dashboard-styles'
import type { DemoClinicPatient } from '@/lib/clinic/demo-patients'
import { CLINIC_ROUTES } from '@/lib/auth/routes'
import { cn } from '@/lib/utils'

type AllPatientsTableProps = {
  patients: DemoClinicPatient[]
}

export function AllPatientsTable({ patients }: AllPatientsTableProps) {
  return (
    <section className="mt-10">
      <h2 className={SECTION_LABEL}>All patients ({patients.length})</h2>

      <div className="mt-4 overflow-x-auto rounded-2xl border-[0.5px] border-black/[0.08] bg-white">
        <table className="w-full min-w-[800px] border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-black/10 bg-neutral-50 font-mono text-[10px] uppercase tracking-wider text-black/50">
              <th className="px-4 py-3 font-medium sm:px-5">Patient</th>
              <th className="px-4 py-3 font-medium sm:px-5">MLux</th>
              <th className="px-4 py-3 font-medium sm:px-5">Finding</th>
              <th className="px-4 py-3 font-medium sm:px-5">Adherence</th>
              <th className="px-4 py-3 font-medium sm:px-5">DiDi</th>
              <th className="px-4 py-3 font-medium sm:px-5">Action</th>
            </tr>
          </thead>
          <tbody>
            {patients.map((patient) => {
              const onTrack = patient.status === 'On track'

              return (
                <tr
                  key={patient.id}
                  className={cn(
                    'border-b border-black/5 last:border-0',
                    onTrack ? 'bg-white' : 'bg-teal-50/40'
                  )}
                >
                  <td className="px-4 py-4 sm:px-5">
                    <Link
                      href={CLINIC_ROUTES.patient(patient.id)}
                      className="font-medium text-black hover:underline"
                    >
                      {patient.displayName}
                    </Link>
                    <p className="mt-0.5 font-mono text-[11px] text-black/40">{patient.chronotype}</p>
                  </td>

                  <td className="px-4 py-4 sm:px-5">
                    <p
                      className={cn(
                        'font-mono text-[13px] font-semibold',
                        patient.mluxScore < 100
                          ? 'text-red-600'
                          : patient.mluxScore < 250
                            ? 'text-amber-600'
                            : 'text-emerald-600'
                      )}
                    >
                      {patient.mluxScore}
                    </p>
                    <p className="font-mono text-[10px] text-black/35">m-EDI lux</p>
                  </td>

                  <td className="px-4 py-4 text-[13px] text-black/70 sm:px-5">{patient.finding}</td>

                  <td className="px-4 py-4 sm:px-5">
                    <p
                      className={cn(
                        'font-mono text-[13px] font-semibold',
                        patient.adherenceRate >= 90
                          ? 'text-emerald-600'
                          : patient.adherenceRate >= 70
                            ? 'text-amber-600'
                            : 'text-red-600'
                      )}
                    >
                      {patient.adherenceRate}%
                    </p>
                    <p className="font-mono text-[10px] text-black/35">
                      {patient.vayaSessionsLast30}/30 days
                    </p>
                  </td>

                  <td className="px-4 py-4 sm:px-5">
                    <p className="font-mono text-[11px] text-black/50">
                      {patient.lastSessionHoursAgo}h ago
                    </p>
                    <span
                      className={cn(
                        'inline-block rounded-full px-2 py-0.5 font-mono text-[9px] uppercase tracking-wide',
                        patient.layerConfidence === 'CONFIRMED'
                          ? 'bg-emerald-50 text-emerald-700'
                          : patient.layerConfidence === 'PRECISION'
                            ? 'bg-teal-50 text-teal-700'
                            : 'bg-amber-50 text-amber-700'
                      )}
                    >
                      {patient.layerConfidence}
                    </span>
                  </td>

                  <td className="px-4 py-4 sm:px-5">
                    <Link
                      href={CLINIC_ROUTES.patient(patient.id)}
                      className="text-[13px] font-medium text-black hover:underline"
                    >
                      Review →
                    </Link>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </section>
  )
}
