'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import {
  TIPTRAQ_GP_VALUE_PROPOSITION,
  formatTipTraqStudyFeeCaption,
} from '@/lib/clinical/tiptraq-program'
import type { TipTraqAssessment } from '@/lib/clinical/tiptraq-assessments'
import { Button } from '@/components/ui/Button'

const STATUS_LABEL: Record<TipTraqAssessment['status'], string> = {
  kit_ordered: 'Kit ordered',
  baseline_in_progress: 'Baseline nights',
  baseline_complete: 'Baseline complete',
  review_due: 'Quarterly review due',
  review_complete: 'Review complete',
}

export function TipTraqGpProgramPanel({
  queue,
  patientNames,
  nightsByPatient = {},
}: {
  queue: TipTraqAssessment[]
  patientNames: Record<string, string>
  nightsByPatient?: Record<string, number>
}) {
  return (
    <section className="seco-app-card overflow-hidden !p-0">
      <div className="border-b border-border p-5 md:p-6">
        <p className="seco-page__eyebrow mb-1">TipTraQ program</p>
        <h2 className="seco-app-card__title">{TIPTRAQ_GP_VALUE_PROPOSITION.headline}</h2>
        <p className="mt-2 text-sm text-ink-muted">{TIPTRAQ_GP_VALUE_PROPOSITION.subline}</p>
        <p className="mt-2 text-xs text-ink-faint">{TIPTRAQ_GP_VALUE_PROPOSITION.trojanHorse}</p>
        <p className="mt-2 text-xs font-medium text-ink-muted">{formatTipTraqStudyFeeCaption()}</p>
      </div>

      <div className="grid gap-0 md:grid-cols-3">
        <div className="border-b border-border p-5 md:border-b-0 md:border-r md:p-6">
          <p className="text-xs font-medium uppercase tracking-wider text-ink-faint">Baseline</p>
          <p className="mt-1 text-sm text-ink-muted">{TIPTRAQ_GP_VALUE_PROPOSITION.baseline}</p>
        </div>
        <div className="border-b border-border p-5 md:border-b-0 md:border-r md:p-6">
          <p className="text-xs font-medium uppercase tracking-wider text-ink-faint">Quarterly</p>
          <p className="mt-1 text-sm text-ink-muted">{TIPTRAQ_GP_VALUE_PROPOSITION.quarterly}</p>
        </div>
        <div className="p-5 md:p-6">
          <p className="text-xs font-medium uppercase tracking-wider text-ink-faint">Metabolic alert</p>
          <p className="mt-1 text-sm text-ink-muted">{TIPTRAQ_GP_VALUE_PROPOSITION.metabolic}</p>
        </div>
      </div>

      {queue.length > 0 ? (
        <ul className="divide-y divide-border border-t border-border">
          {queue.map((item) => (
            <li key={item.id} className="flex flex-wrap items-center justify-between gap-3 p-5 md:p-6">
              <div>
                <p className="font-medium text-ink">
                  {patientNames[item.patient_id] ?? 'Patient'}
                </p>
                <p className="text-sm text-ink-muted">
                  {STATUS_LABEL[item.status]}
                  {item.status === 'baseline_in_progress' || item.status === 'kit_ordered'
                    ? ` · ${nightsByPatient[item.patient_id] ?? item.nights_recorded}/${item.nights_required} nights`
                    : nightsByPatient[item.patient_id]
                      ? ` · ${nightsByPatient[item.patient_id]} nights on file`
                      : ''}
                  {item.metabolic_alert_triggered ? ' · Metabolic alert' : ''}
                </p>
              </div>
              <Link
                href={`/clinical/dashboard/patient/${item.patient_id}`}
                className="text-sm text-accent underline"
              >
                Open record →
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p className="border-t border-border p-5 text-sm text-ink-muted md:p-6">
          No active TipTraQ kits. Order from a linked patient record to start a 3-night baseline.
        </p>
      )}
    </section>
  )
}

export function TipTraqPatientPanel({
  patientId,
  assessment,
}: {
  patientId: string
  assessment: TipTraqAssessment | null
}) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function orderKit() {
    setLoading(true)
    setError(null)
    const res = await fetch('/api/clinical/tiptraq/order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ patient_id: patientId }),
    })
    const data = await res.json()
    setLoading(false)
    if (!res.ok) {
      setError(data.error ?? 'Could not order kit.')
      return
    }
    router.refresh()
  }

  return (
    <section className="seco-app-card space-y-4 p-5 md:p-6">
      <div>
        <p className="seco-page__eyebrow mb-1">TipTraQ kit</p>
        <h2 className="seco-app-card__title">3-night baseline · quarterly review</h2>
        <p className="mt-2 text-sm text-ink-muted">
          Order a home sleep kit — three nights establishes precision dosing windows and metabolic
          drift monitoring (like recurring Gominak panels). Practices typically bill{' '}
          {formatTipTraqStudyFeeCaption()} for setup, multi-night capture, and review.
        </p>
      </div>

      {!assessment ? (
        <Button type="button" onClick={orderKit} disabled={loading}>
          {loading ? 'Ordering…' : 'Order TipTraQ kit'}
        </Button>
      ) : (
        <div className="space-y-2 text-sm text-ink-muted">
          <p>
            Status: <span className="text-ink">{STATUS_LABEL[assessment.status]}</span>
          </p>
          <p>
            Nights recorded: {assessment.nights_recorded}/{assessment.nights_required}
          </p>
          {assessment.next_review_at && (
            <p>Next quarterly review: {new Date(assessment.next_review_at).toLocaleDateString()}</p>
          )}
          {assessment.metabolic_alert_triggered && (
            <p className="text-warning">Metabolic early-warning flag active — review circadian drift.</p>
          )}
          {(assessment.status === 'kit_ordered' ||
            assessment.status === 'baseline_in_progress') && (
            <p className="text-xs text-ink-faint">
              Add nights in the readings panel below — or load the Sean James demo block.
            </p>
          )}
          {assessment.status === 'review_due' && (
            <Button type="button" onClick={orderKit} disabled={loading}>
              {loading ? 'Ordering…' : 'Order quarterly re-read kit'}
            </Button>
          )}
        </div>
      )}

      {error && <p className="text-sm text-warning">{error}</p>}
    </section>
  )
}
