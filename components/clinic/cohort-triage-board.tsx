'use client'

import { useSearchParams } from 'next/navigation'
import { useState } from 'react'

import { ChronoimmunePatientCard } from '@/components/patient-dashboard/chronoimmune-patient-card'
import { CohortTriageCompactCard } from '@/components/clinic/cohort-triage-compact-card'
import {
  patientsByTriageColumn,
  type CohortTriagePatient,
} from '@/lib/clinic/cohort-triage-patients'
import type { CohortTriageStatus } from '@/lib/patient-dashboard/types'
import { cn } from '@/lib/utils'

const COLUMNS: { status: CohortTriageStatus; title: string; subtitle: string }[] = [
  {
    status: 'red',
    title: 'Red',
    subtitle: 'Immediate attention',
  },
  {
    status: 'amber',
    title: 'Amber',
    subtitle: 'Review recommended',
  },
  {
    status: 'green',
    title: 'Green',
    subtitle: 'Protocol progressing',
  },
]

const COLUMN_HEADER_STYLES: Record<CohortTriageStatus, string> = {
  red: 'border-red-200 bg-red-50/80',
  amber: 'border-amber-200 bg-amber-50/80',
  green: 'border-emerald-200 bg-emerald-50/80',
}

type CohortTriageBoardProps = {
  patients: CohortTriagePatient[]
}

export function CohortTriageBoard({ patients }: CohortTriageBoardProps) {
  const searchParams = useSearchParams()
  const ordersRefreshKey = searchParams.get('ordered') ? 1 : 0
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const columns = patientsByTriageColumn(patients)

  const handleToggle = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id))
  }

  return (
    <div className="cohort-triage-board mt-6 grid gap-4 lg:grid-cols-3">
      {COLUMNS.map((column) => {
        const list = columns[column.status]

        return (
          <section
            key={column.status}
            className="cohort-triage-column flex min-w-0 flex-col"
            aria-label={`${column.title} — ${column.subtitle}`}
          >
            <header
              className={cn(
                'rounded-t-xl border border-b-0 px-4 py-3',
                COLUMN_HEADER_STYLES[column.status]
              )}
            >
              <h2 className="text-sm font-semibold text-black">{column.title}</h2>
              <p className="text-xs text-black/60">{column.subtitle}</p>
              <p className="mt-1 font-mono text-[10px] text-black/45">
                {list.length} patient{list.length === 1 ? '' : 's'}
              </p>
            </header>

            <div className="flex flex-1 flex-col gap-3 rounded-b-xl border border-black/[0.08] bg-black/[0.02] p-3">
              {list.length === 0 ? (
                <p className="rounded-lg border border-dashed border-black/10 bg-white p-4 text-center text-xs text-black/50">
                  No patients in this column
                </p>
              ) : (
                list.map((patient) => {
                  const expanded = expandedId === patient.id

                  return (
                    <div key={patient.id} className="space-y-3">
                      <CohortTriageCompactCard
                        patient={patient}
                        expanded={expanded}
                        onToggle={() => handleToggle(patient.id)}
                      />
                      {expanded ? (
                        <div className="rounded-xl border border-black/[0.08] bg-white p-1">
                          <ChronoimmunePatientCard
                            profile={patient.profile}
                            patientId={patient.id}
                            orderContext="clinician"
                            ordersRefreshKey={ordersRefreshKey}
                          />
                        </div>
                      ) : null}
                    </div>
                  )
                })
              )}
            </div>
          </section>
        )
      })}
    </div>
  )
}
