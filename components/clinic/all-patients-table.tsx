import Link from 'next/link'

import { StatusPill } from '@/components/clinic/status-pill'
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
        <table className="w-full min-w-[640px] border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-black/10 bg-neutral-50 font-mono text-[10px] uppercase tracking-wider text-black/50">
              <th className="px-4 py-3 font-medium sm:px-5">Patient</th>
              <th className="px-4 py-3 font-medium sm:px-5">Finding</th>
              <th className="px-4 py-3 font-medium sm:px-5">Body clock</th>
              <th className="px-4 py-3 font-medium sm:px-5">Data</th>
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
                  </td>
                  <td className="px-4 py-4 text-black/80 sm:px-5">{patient.finding}</td>
                  <td className="px-4 py-4 text-black/70 sm:px-5">{patient.bodyClock}</td>
                  <td className="px-4 py-4 text-black/70 sm:px-5">{patient.data}</td>
                  <td className="px-4 py-4 sm:px-5">
                    <Link href={CLINIC_ROUTES.patient(patient.id)} className="block">
                      <div className="flex flex-col gap-2">
                        <StatusPill status={patient.status} />
                        <span className="text-black/80">{patient.action}</span>
                      </div>
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
