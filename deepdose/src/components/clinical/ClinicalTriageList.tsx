'use client'

import type { ClinicianTriageRow } from '@/lib/clinical/triage'
import { triageRowMeta, TRIAGE_STATUS_LABEL } from '@/lib/clinical/triage'
import { CHI_ABBREV } from '@/lib/circadian/chi'
import { formatDateTime24 } from '@/lib/utils/time'
import { ProfileCollapsibleRow } from '@/components/patient/ProfileCollapsibleRow'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Layout'

type ClinicalTriageListProps = {
  rows: ClinicianTriageRow[]
}

function TriagePatientRow({ row }: { row: ClinicianTriageRow }) {
  const chartHref = `/clinical/dashboard/patient/${row.patientId}`

  return (
    <ProfileCollapsibleRow
      id={row.patientId}
      label={row.patientName}
      meta={triageRowMeta(row, CHI_ABBREV)}
    >
      <dl className="clinical-triage__facts">
        <div>
          <dt>Reference</dt>
          <dd>{row.patientRef}</dd>
        </div>
        {row.chronotypeLabel && (
          <div>
            <dt>Rhythm</dt>
            <dd>{row.chronotypeLabel}</dd>
          </div>
        )}
        <div>
          <dt>{CHI_ABBREV}</dt>
          <dd>{row.circadianScore ?? '—'}</dd>
        </div>
        <div>
          <dt>Last sync</dt>
          <dd>{formatDateTime24(row.lastDeviceSyncAt)}</dd>
        </div>
      </dl>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        {row.isPremiumTier && (
          <span className="text-xs text-ink-muted">
            🛡️ Verified Clinical-Grade Data via TipTraQ
          </span>
        )}
        {row.deviceAlertTriggered && <Badge tone="warning">Device alert</Badge>}
        <Badge
          tone={
            row.triageStatus === 'ON_TRACK'
              ? 'success'
              : 'warning'
          }
        >
          {TRIAGE_STATUS_LABEL[row.triageStatus]}
        </Badge>
      </div>

      <div className="mt-4">
        <Button href={chartHref} className="clinical-triage__open">
          Open chart
        </Button>
      </div>
    </ProfileCollapsibleRow>
  )
}

export function ClinicalTriageList({ rows }: ClinicalTriageListProps) {
  return (
    <section
      className="dash-meds__tile seco-app-card p-5 md:p-6"
      aria-labelledby="clinical-triage-title"
    >
      <div className="dash-meds__section-head">
        <h2 id="clinical-triage-title" className="dash-meds__section-title">
          Your patients
        </h2>
      </div>

      {rows.length === 0 ? (
        <p className="dash-meds__empty-copy">
          No linked patients yet. Generate an invite code below.
        </p>
      ) : (
        <ul className="dash-meds__list">
          {rows.map((row) => (
            <TriagePatientRow key={row.patientId} row={row} />
          ))}
        </ul>
      )}
    </section>
  )
}

/** @deprecated Use ClinicalTriageList */
export default ClinicalTriageList
