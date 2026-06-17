import Link from 'next/link'
import type { ClinicianTriageRow } from '@/lib/clinical/triage'
import { Badge } from '@/components/ui/Layout'

const STATUS_TONE = {
  URGENT: 'warning',
  REVIEW: 'warning',
  ON_TRACK: 'success',
} as const

type ClinicalTriageListProps = {
  rows: ClinicianTriageRow[]
}

export function ClinicalTriageList({ rows }: ClinicalTriageListProps) {
  if (!rows.length) {
    return (
      <div className="seco-app-card border-dashed p-8 text-center">
        <p className="text-sm text-ink-muted">
          No linked patients yet. Generate an invite code and share it with patients who have
          granted clinical care consent.
        </p>
      </div>
    )
  }

  return (
    <ul className="seco-app-card divide-y divide-border overflow-hidden !p-0">
      {rows.map((row) => (
        <li key={row.patientId}>
          <Link
            href={`/clinical/dashboard/patient/${row.patientId}`}
            className="flex flex-wrap items-center justify-between gap-3 p-5 transition hover:bg-surface-muted md:p-6"
          >
            <div className="min-w-0 space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <p className="font-medium text-ink">{row.patientName}</p>
                {row.isPremiumTier && (
                  <span className="text-xs" title="Verified Clinical-Grade Data via TipTraQ">
                    🛡️ Verified Clinical-Grade Data via TipTraQ
                  </span>
                )}
                {row.deviceAlertTriggered && (
                  <Badge tone="warning">Device alert</Badge>
                )}
              </div>
              <p className="text-sm text-ink-muted">
                Ref {row.patientRef}
                {row.chronotypeLabel ? ` · ${row.chronotypeLabel}` : ''}
              </p>
            </div>
            <div className="flex items-center gap-4 text-right">
              <div>
                <p className="font-mono text-lg text-ink">{row.circadianScore || '—'}</p>
                <p className="text-xs text-ink-muted">Circadian score</p>
              </div>
              <Badge tone={STATUS_TONE[row.triageStatus]}>{row.triageStatus.replace('_', ' ')}</Badge>
            </div>
          </Link>
        </li>
      ))}
    </ul>
  )
}
