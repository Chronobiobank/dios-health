'use client'

import { useState } from 'react'

import { CohortListItem } from '@/components/clinicians/cohort-list-item'
import { PatientDetailCard } from '@/components/clinicians/patient-detail-card'
import {
  DEFAULT_SELECTED_PATIENT_ID,
  getSortedTriageCohort,
  getTriagePatient,
} from '@/lib/clinicians/triage-demo-data'

export function TriageDashboard() {
  const cohort = getSortedTriageCohort()
  const [selectedId, setSelectedId] = useState(DEFAULT_SELECTED_PATIENT_ID)
  const selected = getTriagePatient(selectedId) ?? cohort.find((p) => p.id === DEFAULT_SELECTED_PATIENT_ID)!

  const alerts = cohort.filter((p) => p.device_alert_triggered).length
  const premium = cohort.filter((p) => p.is_premium_tier).length
  const urgent = cohort.filter((p) => p.triageStatus === 'URGENT').length
  const review = cohort.filter((p) => p.triageStatus === 'REVIEW').length
  const onTrack = cohort.filter((p) => p.triageStatus === 'ON_TRACK').length

  return (
    <div className="clinicians-triage">
      <div className="clinicians-triage__shell">
        <aside className="clinicians-triage__cohort">
          <header className="clinicians-triage__header">
            <h1 className="clinicians-triage__title">Cohort triage</h1>
            <p className="clinicians-triage__subtitle">
              {alerts} device alert · {premium} TipTraQ verified · {urgent} urgent · {review}{' '}
              review · {onTrack} on track
            </p>
          </header>
          <div className="clinicians-triage__list" role="list">
            {cohort.map((patient) => (
              <CohortListItem
                key={patient.id}
                patient={patient}
                selected={patient.id === selectedId}
                onSelect={() => setSelectedId(patient.id)}
              />
            ))}
          </div>
        </aside>

        <main className="clinicians-triage__detail">
          <PatientDetailCard patient={selected} />
        </main>
      </div>
    </div>
  )
}
