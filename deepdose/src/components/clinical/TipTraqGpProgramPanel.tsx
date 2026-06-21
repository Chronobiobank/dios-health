'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import {
  TIPTRAQ_GP_VALUE_PROPOSITION,
  TIPTRAQ_REVIEW_INTERVAL_DAYS,
  formatTipTraqStudyFeeCaption,
} from '@/lib/clinical/tiptraq-program'
import type { TipTraqAssessment } from '@/lib/clinical/tiptraq-assessments'
import { ProfileCollapsibleRow } from '@/components/patient/ProfileCollapsibleRow'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Layout'
import { FormError } from '@/components/ui/Form'

const STATUS_LABEL: Record<TipTraqAssessment['status'], string> = {
  kit_ordered: 'Kit ordered',
  baseline_in_progress: 'Baseline nights',
  baseline_complete: 'Baseline complete',
  review_due: 'Quarterly review due',
  review_complete: 'Review complete',
}

function tipTraqQueueMeta(
  item: TipTraqAssessment,
  nightsByPatient: Record<string, number>
): string {
  const parts = [STATUS_LABEL[item.status]]
  if (item.status === 'baseline_in_progress' || item.status === 'kit_ordered') {
    parts.push(
      `${nightsByPatient[item.patient_id] ?? item.nights_recorded}/${item.nights_required} nights`
    )
  } else if (nightsByPatient[item.patient_id]) {
    parts.push(`${nightsByPatient[item.patient_id]} nights on file`)
  }
  if (item.metabolic_alert_triggered) {
    parts.push('Metabolic alert')
  }
  return parts.join(' · ')
}

function TipTraqQueueRow({
  item,
  patientName,
  nightsByPatient,
}: {
  item: TipTraqAssessment
  patientName: string
  nightsByPatient: Record<string, number>
}) {
  const chartHref = `/clinical/dashboard/patient/${item.patient_id}`

  return (
    <ProfileCollapsibleRow
      id={item.id}
      label={patientName}
      meta={tipTraqQueueMeta(item, nightsByPatient)}
    >
      <dl className="clinical-triage__facts">
        <div>
          <dt>Status</dt>
          <dd>{STATUS_LABEL[item.status]}</dd>
        </div>
        <div>
          <dt>Nights</dt>
          <dd>
            {nightsByPatient[item.patient_id] ?? item.nights_recorded}/{item.nights_required}
          </dd>
        </div>
        {item.next_review_at && (
          <div>
            <dt>Next review</dt>
            <dd>{new Date(item.next_review_at).toLocaleDateString('en-GB')}</dd>
          </div>
        )}
      </dl>

      {item.metabolic_alert_triggered && (
        <div className="mt-4">
          <Badge tone="warning">Metabolic alert</Badge>
        </div>
      )}

      <div className="mt-4">
        <Button href={chartHref}>Open chart</Button>
      </div>
    </ProfileCollapsibleRow>
  )
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
    <>
      <section
        className="dash-meds__tile seco-app-card p-5 md:p-6"
        aria-labelledby="tiptraq-active-title"
      >
        <div className="dash-meds__section-head">
          <h2 id="tiptraq-active-title" className="dash-meds__section-title">
            Active kits
          </h2>
        </div>

        {queue.length === 0 ? (
          <p className="dash-meds__empty-copy">
            No active TipTraQ kits. Order from a linked patient chart.
          </p>
        ) : (
          <ul className="dash-meds__list">
            {queue.map((item) => (
              <TipTraqQueueRow
                key={item.id}
                item={item}
                patientName={patientNames[item.patient_id] ?? 'Patient'}
                nightsByPatient={nightsByPatient}
              />
            ))}
          </ul>
        )}
      </section>

      <section
        className="dash-meds__tile seco-app-card p-5 md:p-6"
        aria-labelledby="tiptraq-program-title"
      >
        <div className="dash-meds__section-head">
          <h2 id="tiptraq-program-title" className="dash-meds__section-title">
            Program
          </h2>
        </div>

        <ul className="dash-meds__list">
          <ProfileCollapsibleRow id="tiptraq-baseline" label="Baseline" meta="3 nights">
            <p className="text-sm text-ink-muted">{TIPTRAQ_GP_VALUE_PROPOSITION.baseline}</p>
          </ProfileCollapsibleRow>
          <ProfileCollapsibleRow
            id="tiptraq-quarterly"
            label="Quarterly"
            meta={`Every ${TIPTRAQ_REVIEW_INTERVAL_DAYS} days`}
          >
            <p className="text-sm text-ink-muted">{TIPTRAQ_GP_VALUE_PROPOSITION.quarterly}</p>
          </ProfileCollapsibleRow>
          <ProfileCollapsibleRow id="tiptraq-metabolic" label="Metabolic alert" meta="Drift monitoring">
            <p className="text-sm text-ink-muted">{TIPTRAQ_GP_VALUE_PROPOSITION.metabolic}</p>
          </ProfileCollapsibleRow>
          <ProfileCollapsibleRow
            id="tiptraq-pricing"
            label="Pricing"
            meta={formatTipTraqStudyFeeCaption()}
          >
            <p className="text-sm text-ink-muted">{TIPTRAQ_GP_VALUE_PROPOSITION.trojanHorse}</p>
            <p className="mt-2 text-sm font-medium text-ink-muted">
              {formatTipTraqStudyFeeCaption()}
            </p>
          </ProfileCollapsibleRow>
        </ul>
      </section>
    </>
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

  const rowLabel = assessment ? STATUS_LABEL[assessment.status] : 'No kit ordered'
  const rowMeta = assessment
    ? `${assessment.nights_recorded}/${assessment.nights_required} nights`
    : formatTipTraqStudyFeeCaption()

  return (
    <section
      className="dash-meds__tile seco-app-card p-5 md:p-6"
      aria-labelledby="tiptraq-kit-title"
    >
      <div className="dash-meds__section-head">
        <h2 id="tiptraq-kit-title" className="dash-meds__section-title">
          TipTraQ kit
        </h2>
      </div>

      <ul className="dash-meds__list">
        <ProfileCollapsibleRow id="tiptraq-kit-order" label={rowLabel} meta={rowMeta}>
          {!assessment ? (
            <>
              <p className="text-sm text-ink-muted">
                Order a home sleep kit — three nights establishes precision dosing windows and
                metabolic drift monitoring.
              </p>
              <div className="mt-4">
                <Button type="button" onClick={orderKit} disabled={loading}>
                  {loading ? 'Ordering…' : 'Order TipTraQ kit'}
                </Button>
              </div>
            </>
          ) : (
            <>
              <dl className="clinical-triage__facts">
                <div>
                  <dt>Status</dt>
                  <dd>{STATUS_LABEL[assessment.status]}</dd>
                </div>
                <div>
                  <dt>Nights recorded</dt>
                  <dd>
                    {assessment.nights_recorded}/{assessment.nights_required}
                  </dd>
                </div>
                {assessment.next_review_at && (
                  <div>
                    <dt>Next quarterly review</dt>
                    <dd>{new Date(assessment.next_review_at).toLocaleDateString('en-GB')}</dd>
                  </div>
                )}
              </dl>

              {assessment.metabolic_alert_triggered && (
                <p className="mt-4 text-sm text-warning">
                  Metabolic early-warning flag active — review circadian drift.
                </p>
              )}

              {(assessment.status === 'kit_ordered' ||
                assessment.status === 'baseline_in_progress') && (
                <p className="mt-4 text-sm text-ink-muted">
                  Add nights in the readings panel below — or load the Sean James demo block.
                </p>
              )}

              {assessment.status === 'review_due' && (
                <div className="mt-4">
                  <Button type="button" onClick={orderKit} disabled={loading}>
                    {loading ? 'Ordering…' : 'Order quarterly re-read kit'}
                  </Button>
                </div>
              )}
            </>
          )}

          {error && (
            <div className="mt-4">
              <FormError>{error}</FormError>
            </div>
          )}
        </ProfileCollapsibleRow>
      </ul>
    </section>
  )
}
