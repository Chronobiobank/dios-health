'use client'

import { ProfileCollapsibleRow } from '@/components/patient/ProfileCollapsibleRow'
import { PrescribingForm } from '@/components/clinical/PrescribingForm'

type MedicationOption = {
  medication_code: string
  current_timing: string | null
}

export function ClinicalPrescribingPanel({
  patientId,
  medications,
}: {
  patientId: string
  medications: MedicationOption[]
}) {
  const meta =
    medications.length === 0
      ? 'No medicines'
      : `${medications.length} medicine${medications.length === 1 ? '' : 's'}`

  return (
    <section
      className="dash-meds__tile seco-app-card p-5 md:p-6"
      aria-labelledby="clinical-prescribing-title"
    >
      <div className="dash-meds__section-head">
        <h2 id="clinical-prescribing-title" className="dash-meds__section-title">
          Prescribing
        </h2>
      </div>

      <ul className="dash-meds__list">
        <ProfileCollapsibleRow id="propose-timing" label="Propose timing change" meta={meta}>
          <PrescribingForm patientId={patientId} medications={medications} />
        </ProfileCollapsibleRow>
      </ul>
    </section>
  )
}
