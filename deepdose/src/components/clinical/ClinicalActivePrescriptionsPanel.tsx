'use client'

import { getMedicationDisplayName } from '@/lib/medications/catalog'
import type { BtiPayload, BtiStatus } from '@/lib/bti/types'
import {
  MEDICATION_TIMINGS,
  type MedicationCode,
} from '@/lib/circadian/medications'
import { formatTime24 } from '@/lib/utils/time'
import { ProfileCollapsibleRow } from '@/components/patient/ProfileCollapsibleRow'
import { Badge } from '@/components/ui/Layout'

const BTI_STATUS_LABEL: Record<BtiStatus, string> = {
  WINDOW_OPEN: 'Window open',
  WINDOW_CLOSED: 'Window closed',
  CRITICAL_DRIFT: 'Critical drift',
}

type ActiveMedication = {
  medication_code: string
  dose_mg: number | null
  current_timing: string
}

function medicationDisplayName(code: string): string {
  if (code in MEDICATION_TIMINGS) {
    return MEDICATION_TIMINGS[code as MedicationCode].displayName
  }
  return getMedicationDisplayName(code)
}

function PrescriptionRow({
  medication,
  bti,
}: {
  medication: ActiveMedication
  bti?: BtiPayload
}) {
  const name = medicationDisplayName(medication.medication_code)
  const metaParts = [formatTime24(medication.current_timing)]
  if (medication.dose_mg != null) {
    metaParts.push(`${medication.dose_mg} mg`)
  }
  if (bti) {
    metaParts.push(BTI_STATUS_LABEL[bti.bti_status])
  }

  return (
    <ProfileCollapsibleRow
      id={medication.medication_code}
      label={name}
      meta={metaParts.join(' · ')}
    >
      <dl className="clinical-triage__facts">
        <div>
          <dt>Current time</dt>
          <dd>{formatTime24(medication.current_timing)}</dd>
        </div>
        {medication.dose_mg != null && (
          <div>
            <dt>Dose</dt>
            <dd>{medication.dose_mg} mg</dd>
          </div>
        )}
        {bti && (
          <>
            <div>
              <dt>BTI status</dt>
              <dd>
                <Badge tone={bti.bti_status === 'WINDOW_OPEN' ? 'success' : 'warning'}>
                  {BTI_STATUS_LABEL[bti.bti_status]}
                </Badge>
              </dd>
            </div>
            <div>
              <dt>Window</dt>
              <dd>
                {formatTime24(bti.dosing_window_start.slice(11, 16))} –{' '}
                {formatTime24(bti.dosing_window_end.slice(11, 16))}
              </dd>
            </div>
          </>
        )}
      </dl>

      {bti && (
        <p className="mt-4 text-sm text-ink-muted">{bti.display_instruction}</p>
      )}
    </ProfileCollapsibleRow>
  )
}

export function ClinicalActivePrescriptionsPanel({
  medications,
  btiByMedication,
}: {
  medications: ActiveMedication[]
  btiByMedication: Record<string, BtiPayload>
}) {
  return (
    <section
      className="dash-meds__tile seco-app-card p-5 md:p-6"
      aria-labelledby="clinical-prescriptions-title"
    >
      <div className="dash-meds__section-head">
        <h2 id="clinical-prescriptions-title" className="dash-meds__section-title">
          Active prescriptions
        </h2>
      </div>

      {medications.length === 0 ? (
        <p className="dash-meds__empty-copy">No active medications on file.</p>
      ) : (
        <ul className="dash-meds__list">
          {medications.map((medication) => (
            <PrescriptionRow
              key={medication.medication_code}
              medication={medication}
              bti={btiByMedication[medication.medication_code]}
            />
          ))}
        </ul>
      )}
    </section>
  )
}
