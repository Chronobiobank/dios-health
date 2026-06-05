'use client'

import { pthStatusFromProfile } from '@/lib/chronoimmune/pth-status-label'
import type { CohortTriagePatient } from '@/lib/clinic/cohort-triage-patients'
import type { CohortTriageStatus } from '@/lib/patient-dashboard/types'
import { cn } from '@/lib/utils'

const TRIAGE_LABELS: Record<CohortTriageStatus, string> = {
  red: 'Immediate attention',
  amber: 'Review recommended',
  green: 'Protocol progressing',
}

const PTH_TONE_STYLES = {
  target: 'text-emerald-700 bg-emerald-50',
  middle: 'text-amber-800 bg-amber-50',
  ceiling: 'text-orange-800 bg-orange-50',
  floor: 'text-red-800 bg-red-50',
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
        'cohort-triage-compact w-full rounded-xl border p-4 text-left transition-colors',
        expanded
          ? 'border-black/20 bg-white shadow-sm'
          : 'border-black/[0.08] bg-white hover:border-black/15',
        triage === 'red' && 'border-l-[3px] border-l-red-600',
        triage === 'amber' && 'border-l-[3px] border-l-amber-500',
        triage === 'green' && 'border-l-[3px] border-l-emerald-600'
      )}
      aria-expanded={expanded}
    >
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <p className="text-sm font-semibold text-black">
            {patient.displayName}
            <span className="ml-1.5 font-normal text-black/50">{patient.age}</span>
          </p>
          <p className="mt-0.5 font-mono text-[10px] uppercase tracking-wider text-black/40">
            {profile.recordId}
          </p>
        </div>
        <span
          className={cn(
            'rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide',
            triage === 'red' && 'bg-red-50 text-red-800',
            triage === 'amber' && 'bg-amber-50 text-amber-900',
            triage === 'green' && 'bg-emerald-50 text-emerald-800'
          )}
        >
          {TRIAGE_LABELS[triage]}
        </span>
      </div>

      <dl className="mt-3 grid grid-cols-2 gap-x-3 gap-y-2 text-xs">
        <div>
          <dt className="font-mono text-[10px] uppercase tracking-wider text-black/45">Zone</dt>
          <dd className="mt-0.5 font-medium text-black/80">Zone {profile.zoneId}</dd>
        </div>
        <div>
          <dt className="font-mono text-[10px] uppercase tracking-wider text-black/45">PTH</dt>
          <dd className="mt-0.5">
            <span
              className={cn(
                'inline-block rounded px-1.5 py-0.5 text-[11px] font-medium',
                PTH_TONE_STYLES[pthStatus.tone]
              )}
            >
              {pthStatus.label}
            </span>
          </dd>
        </div>
        <div>
          <dt className="font-mono text-[10px] uppercase tracking-wider text-black/45">Last scan</dt>
          <dd className="mt-0.5 text-black/75">
            {patient.daysSinceLastScan === 0
              ? 'Today'
              : `${patient.daysSinceLastScan}d ago`}
          </dd>
        </div>
        <div>
          <dt className="font-mono text-[10px] uppercase tracking-wider text-black/45">Adherence</dt>
          <dd className="mt-0.5 text-black/75">
            {patient.adherenceConfirmed ? 'Confirmed' : 'Not confirmed'}
          </dd>
        </div>
      </dl>

      {profile.titrationLocked ? (
        <div
          className="mt-3 rounded-lg border border-red-300 bg-red-50 px-2.5 py-2"
          role="status"
        >
          <p className="text-[11px] font-semibold uppercase tracking-wide text-red-900">
            Titration locked
          </p>
          <p className="mt-1 text-xs leading-relaxed text-red-800">
            {profile.lockReason ?? 'Clinician review required before any dose change'}
          </p>
        </div>
      ) : null}

      {patient.urgentFlag ? (
        <p className={cn('text-xs leading-relaxed text-red-800/90', profile.titrationLocked ? 'mt-2' : 'mt-3')}>
          {patient.urgentFlag}
        </p>
      ) : !profile.titrationLocked ? (
        <p className="mt-3 text-xs text-black/45">No active flags</p>
      ) : null}

      <p className="mt-2 font-mono text-[10px] text-black/40">
        {expanded ? 'Tap to collapse' : 'Tap for full record'}
      </p>
    </button>
  )
}
