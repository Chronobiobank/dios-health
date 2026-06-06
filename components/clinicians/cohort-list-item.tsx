import { TriageBadges } from '@/components/clinicians/triage-badges'
import type { TriagePatient } from '@/lib/clinicians/triage-types'
import { cn } from '@/lib/utils'

const STATUS_DOT: Record<TriagePatient['triageStatus'], string> = {
  URGENT: 'clinicians-triage__dot--urgent',
  REVIEW: 'clinicians-triage__dot--review',
  ON_TRACK: 'clinicians-triage__dot--on-track',
}

const PROTOCOL_BADGE: Record<TriagePatient['protocol'], string> = {
  coimbra: 'clinicians-triage__badge--coimbra',
  gominak: 'clinicians-triage__badge--gominak',
  circadian: 'clinicians-triage__badge--circadian',
}

const PTH_ARROW: Record<TriagePatient['pthTrend'], string> = {
  down: '↓',
  up: '↑',
  flat: '→',
}

function formatLabDue(iso: string): string {
  return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
}

type CohortListItemProps = {
  patient: TriagePatient
  selected: boolean
  onSelect: () => void
}

export function CohortListItem({ patient, selected, onSelect }: CohortListItemProps) {
  return (
    <button
      type="button"
      className={cn(
        'clinicians-triage__row',
        selected && 'is-selected',
        patient.device_alert_triggered && 'clinicians-triage__row--alert'
      )}
      onClick={onSelect}
      aria-pressed={selected}
    >
      <div className="clinicians-triage__row-top">
        <span
          className={cn('clinicians-triage__dot', STATUS_DOT[patient.triageStatus])}
          aria-hidden
        />
        <div>
          <p className="clinicians-triage__row-name">{patient.name}</p>
          <p className="clinicians-triage__row-ref">{patient.ref}</p>
          <TriageBadges
            variant="legacy"
            isPremiumTier={patient.is_premium_tier}
            deviceAlertTriggered={patient.device_alert_triggered}
            wearableSource={patient.is_premium_tier ? 'tiptraq' : 'oura'}
          />
        </div>
      </div>
      <span className={cn('clinicians-triage__badge', PROTOCOL_BADGE[patient.protocol])}>
        {patient.protocol}
      </span>
      <div className="clinicians-triage__row-meta">
        <span>
          PTH {patient.labs.pthPgMl}{' '}
          <span className="clinicians-triage__pth-trend">{PTH_ARROW[patient.pthTrend]}</span>
        </span>
        <span>Lab {formatLabDue(patient.nextLabDue)}</span>
      </div>
    </button>
  )
}
