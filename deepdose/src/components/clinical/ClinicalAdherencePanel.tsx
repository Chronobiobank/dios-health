'use client'

import { getMedicationDisplayName } from '@/lib/medications/catalog'
import type { AdherenceLogEntry } from '@/lib/clinical/patient-chart'
import { formatDateTime24 } from '@/lib/utils/time'
import { ProfileCollapsibleRow } from '@/components/patient/ProfileCollapsibleRow'
import { Badge } from '@/components/ui/Layout'

function AdherenceRow({ entry }: { entry: AdherenceLogEntry }) {
  const name = getMedicationDisplayName(entry.medication_code)
  const meta = `${entry.in_window ? 'In window' : 'Out of window'} · ${formatDateTime24(entry.taken_at)}`

  return (
    <ProfileCollapsibleRow id={entry.id} label={name} meta={meta}>
      <dl className="clinical-triage__facts">
        <div>
          <dt>Taken</dt>
          <dd>{formatDateTime24(entry.taken_at)}</dd>
        </div>
        <div>
          <dt>Window</dt>
          <dd>
            <Badge tone={entry.in_window ? 'success' : 'warning'}>
              {entry.in_window ? 'In window' : 'Out of window'}
            </Badge>
          </dd>
        </div>
        <div>
          <dt>Source</dt>
          <dd>{entry.source.replace('_', ' ')}</dd>
        </div>
      </dl>
    </ProfileCollapsibleRow>
  )
}

export function ClinicalAdherencePanel({ entries }: { entries: AdherenceLogEntry[] }) {
  return (
    <section
      className="dash-meds__tile seco-app-card p-5 md:p-6"
      aria-labelledby="clinical-adherence-title"
    >
      <div className="dash-meds__section-head">
        <h2 id="clinical-adherence-title" className="dash-meds__section-title">
          Adherence log
        </h2>
      </div>

      {entries.length === 0 ? (
        <p className="dash-meds__empty-copy">No dose confirmations logged yet.</p>
      ) : (
        <ul className="dash-meds__list">
          {entries.map((entry) => (
            <AdherenceRow key={entry.id} entry={entry} />
          ))}
        </ul>
      )}
    </section>
  )
}
