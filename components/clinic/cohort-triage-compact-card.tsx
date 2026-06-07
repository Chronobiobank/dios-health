'use client'

import { DATA_LABEL } from '@/components/dashboard/dashboard-styles'
import { DataValue } from '@/components/ui/data-value'
import { FlagBadge } from '@/components/ui/flag-badge'
import { StatusDot } from '@/components/ui/status-dot'
import { pthStatusFromProfile } from '@/lib/chronoimmune/pth-status-label'
import type { CohortTriagePatient } from '@/lib/clinic/cohort-triage-patients'
import type { CohortTriageStatus } from '@/lib/patient-dashboard/types'
import { cn } from '@/lib/utils'

const TRIAGE_STATUS: Record<CohortTriageStatus, 'red' | 'amber' | 'green'> = {
  red: 'red',
  amber: 'amber',
  green: 'green',
}

const PTH_SEVERITY = {
  target: 'green',
  middle: 'amber',
  ceiling: 'amber',
  floor: 'red',
} as const

type CohortTriageCompactCardProps = {
  patient: CohortTriagePatient
  expanded: boolean
  onToggle: () => void
}

export function CohortTriageCompactCard({
  patient,
  expanded,
  onToggle,
}: CohortTriageCompactCardProps) {
  const { profile } = patient
  const pthStatus = pthStatusFromProfile(profile)
  const triage = profile.cohortTriageStatus

  return (
    <button
      type="button"
      onClick={onToggle}
      className={cn(
        'cohort-triage-compact w-full rounded-xl border border-black/[0.08] bg-white p-4 text-left transition-colors hover:border-black/15',
        expanded && 'border-black/20 shadow-sm',
        triage === 'red' && 'border-l-[3px] border-l-status-red',
        triage === 'amber' && 'border-l-[3px] border-l-status-amber',
        triage === 'green' && 'border-l-[3px] border-l-status-green'
      )}
      aria-expanded={expanded}
    >
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <p className="font-ui text-ui-body font-semibold text-black">
            {patient.displayName}
            <span className="ml-1.5 font-normal text-black/50">{patient.age}</span>
          </p>
          <p className={cn(DATA_LABEL, 'mt-0.5 text-black/40')}>{profile.recordId}</p>
        </div>
        <StatusDot status={TRIAGE_STATUS[triage]} showLabel />
      </div>

      <dl className="mt-3 grid grid-cols-2 gap-x-3 gap-y-2 font-ui text-ui-sm">
        <DataValue label="Zone" value={`Zone ${profile.zoneId}`} size="sm" />
        <div>
          <p className="data-label mb-[3px]">PTH</p>
          <FlagBadge label={pthStatus.label} severity={PTH_SEVERITY[pthStatus.tone]} />
        </div>
        <DataValue
          label="Last scan"
          value={
            patient.daysSinceLastScan === 0 ? 'Today' : `${patient.daysSinceLastScan}d ago`
          }
          size="sm"
        />
        <DataValue
          label="Adherence"
          value={patient.adherenceConfirmed ? 'Confirmed' : 'Not confirmed'}
          size="sm"
        />
      </dl>

      {profile.titrationLocked ? (
        <div className="mt-3 rounded-lg border border-status-red-border px-2.5 py-2" role="status">
          <FlagBadge label="Titration locked" severity="red" />
          <p className="mt-2 font-ui text-ui-sm leading-relaxed text-status-red">
            {profile.lockReason ?? 'Clinician review required before any dose change'}
          </p>
        </div>
      ) : null}

      {patient.urgentFlag ? (
        <p
          className={cn(
            'font-ui text-ui-sm leading-relaxed text-status-red',
            profile.titrationLocked ? 'mt-2' : 'mt-3'
          )}
        >
          {patient.urgentFlag}
        </p>
      ) : !profile.titrationLocked ? (
        <p className="mt-3 font-ui text-ui-sm text-black/45">No active flags</p>
      ) : null}

      <p className={cn(DATA_LABEL, 'mt-2 text-black/40')}>
        {expanded ? 'Tap to collapse' : 'Tap for full record'}
      </p>
    </button>
  )
}
