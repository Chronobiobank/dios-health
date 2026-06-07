'use client'

import { useSearchParams } from 'next/navigation'
import { useState } from 'react'

import { DATA_LABEL } from '@/components/dashboard/dashboard-styles'
import { StatusDot } from '@/components/ui/status-dot'
import { ChronoimmunePatientCard } from '@/components/patient-dashboard/chronoimmune-patient-card'
import { CohortTriageCompactCard } from '@/components/clinic/cohort-triage-compact-card'
import {
  patientsByTriageColumn,
  type CohortTriagePatient,
} from '@/lib/clinic/cohort-triage-patients'
import type { CohortTriageStatus } from '@/lib/patient-dashboard/types'
import { cn } from '@/lib/utils'

const COLUMNS: {
  status: CohortTriageStatus
  title: string
  subtitle: string
  dot: 'red' | 'amber' | 'green'
}[] = [
  { status: 'red', title: 'Red', subtitle: 'Immediate attention', dot: 'red' },
  { status: 'amber', title: 'Amber', subtitle: 'Review recommended', dot: 'amber' },
  { status: 'green', title: 'Green', subtitle: 'Protocol progressing', dot: 'green' },
]

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
            <header className="rounded-t-xl border border-b-0 border-black/[0.08] bg-white px-4 py-3">
              <div className="flex items-center gap-2">
                <StatusDot status={column.dot} showLabel />
                <h2 className="font-ui text-ui-h2 font-semibold text-black">{column.title}</h2>
              </div>
              <p className="mt-0.5 font-ui text-ui-sm text-black/60">{column.subtitle}</p>
              <p className={cn(DATA_LABEL, 'mt-1 text-black/45')}>
                {list.length} patient{list.length === 1 ? '' : 's'}
              </p>
            </header>

            <div className="flex flex-1 flex-col gap-3 rounded-b-xl border border-black/[0.08] bg-black/[0.02] p-3">
              {list.length === 0 ? (
                <p className="rounded-lg border border-dashed border-black/10 bg-white p-4 text-center font-ui text-ui-sm text-black/50">
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
