'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import type { TipTraqBlockMetrics, TipTraqNightRecord } from '@/lib/clinical/tiptraq/types'
import type { TipTraqAssessment } from '@/lib/clinical/tiptraq-assessments'
import {
  ahiStatus,
  remLatencyStatus,
  sleepEfficiencyStatus,
  spo2Status,
} from '@/lib/clinical/tiptraq/clinical-status'
import { formatTime24 } from '@/lib/utils/time'
import { ProfileCollapsibleRow } from '@/components/patient/ProfileCollapsibleRow'
import { Badge } from '@/components/ui/Layout'
import { Button } from '@/components/ui/Button'
import { FormError } from '@/components/ui/Form'

const STATUS_TONE = {
  green: 'success',
  amber: 'warning',
  red: 'warning',
} as const

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

function remLatency(night: TipTraqNightRecord): number {
  if (!night.first_rem_onset) return 0
  const toM = (c: string) => {
    const [h, m] = c.split(':').map(Number)
    return h * 60 + m
  }
  const onset = toM(night.sleep_onset)
  let rem = toM(night.first_rem_onset)
  if (rem < onset) rem += 1440
  return rem - onset
}

function TipTraqNightRow({
  night,
  loading,
  onDelete,
}: {
  night: TipTraqNightRecord
  loading: boolean
  onDelete: (id: string) => void
}) {
  const remLat = remLatency(night)
  const tstHours = Math.floor((night.tst_minutes ?? 0) / 60)
  const tstMins = (night.tst_minutes ?? 0) % 60

  return (
    <ProfileCollapsibleRow
      id={night.id}
      label={formatDate(night.report_date)}
      meta={`AHI ${night.ahi} · ${night.sleep_efficiency_pct}% efficiency`}
    >
      <dl className="clinical-triage__facts">
        <div>
          <dt>Night index</dt>
          <dd>
            {night.night_index ?? '—'} · {night.day_type ?? '—'}
          </dd>
        </div>
        <div>
          <dt>Onset → wake</dt>
          <dd>
            {formatTime24(night.sleep_onset)} → {formatTime24(night.sleep_offset)}
          </dd>
        </div>
        <div>
          <dt>Total sleep</dt>
          <dd>
            {tstHours}h {tstMins}m
          </dd>
        </div>
        <div>
          <dt>DLMO proxy</dt>
          <dd>{formatTime24(night.proxy_dlmo_time)}</dd>
        </div>
        <div>
          <dt>Efficiency</dt>
          <dd>
            <Badge tone={STATUS_TONE[sleepEfficiencyStatus(night.sleep_efficiency_pct)]}>
              {night.sleep_efficiency_pct}%
            </Badge>
          </dd>
        </div>
        <div>
          <dt>AHI</dt>
          <dd>
            <Badge tone={STATUS_TONE[ahiStatus(Number(night.ahi))]}>
              {night.ahi} · {night.ahi_severity ?? '—'}
            </Badge>
          </dd>
        </div>
        <div>
          <dt>SpO₂ min</dt>
          <dd>
            <Badge tone={STATUS_TONE[spo2Status(night.min_spo2)]}>
              {night.min_spo2 ?? '—'}%
            </Badge>
          </dd>
        </div>
        <div>
          <dt>REM latency</dt>
          <dd>
            <Badge tone={STATUS_TONE[remLatencyStatus(remLat)]}>{remLat} min</Badge>
          </dd>
        </div>
      </dl>

      <div className="mt-4">
        <button
          type="button"
          className="text-sm text-warning underline"
          disabled={loading}
          onClick={() => onDelete(night.id)}
        >
          Remove night
        </button>
      </div>
    </ProfileCollapsibleRow>
  )
}

export function TipTraqReadingsPanel({
  patientId,
  assessment,
  nights,
  metrics,
}: {
  patientId: string
  assessment: TipTraqAssessment | null
  nights: TipTraqNightRecord[]
  metrics: TipTraqBlockMetrics
}) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function loadDemoNights() {
    if (!assessment) return
    setLoading(true)
    setError(null)
    const res = await fetch('/api/clinical/tiptraq/demo-nights', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ patient_id: patientId, assessment_id: assessment.id }),
    })
    const data = await res.json()
    setLoading(false)
    if (!res.ok) {
      setError(data.error ?? 'Could not load demo nights.')
      return
    }
    router.refresh()
  }

  async function deleteNight(id: string) {
    if (!window.confirm('Delete this night reading?')) return
    setLoading(true)
    setError(null)
    const res = await fetch(`/api/clinical/tiptraq/nights/${id}`, { method: 'DELETE' })
    const data = await res.json()
    setLoading(false)
    if (!res.ok) {
      setError(data.error ?? 'Could not delete night.')
      return
    }
    router.refresh()
  }

  const summaryMeta = `${metrics.nightsLoaded}/${metrics.nightsRequired} nights · AHI ${metrics.meanAhi}`

  return (
    <section
      className="dash-meds__tile seco-app-card p-5 md:p-6"
      aria-labelledby="tiptraq-readings-title"
    >
      <div className="dash-meds__section-head">
        <h2 id="tiptraq-readings-title" className="dash-meds__section-title">
          TipTraQ readings
        </h2>
      </div>

      <ul className="dash-meds__list">
        <ProfileCollapsibleRow id="tiptraq-block-summary" label="3-night block" meta={summaryMeta}>
          <p>{metrics.clinicalRead}</p>

          <dl className="clinical-triage__facts">
            <div>
              <dt>Mean AHI</dt>
              <dd>
                {metrics.meanAhi} · {metrics.ahiSeverityBand}
              </dd>
            </div>
            <div>
              <dt>Sleep efficiency</dt>
              <dd>{metrics.meanEfficiencyPct}%</dd>
            </div>
            <div>
              <dt>DLMO proxy</dt>
              <dd>{metrics.dlmoEstimate}</dd>
            </div>
            <div>
              <dt>Mean onset</dt>
              <dd>{metrics.meanSleepOnset}</dd>
            </div>
            <div>
              <dt>Mean wake</dt>
              <dd>{metrics.meanWake}</dd>
            </div>
            <div>
              <dt>Total sleep</dt>
              <dd>{metrics.meanTstLabel}</dd>
            </div>
            <div>
              <dt>Social jet lag</dt>
              <dd>{metrics.socialJetlagLabel}</dd>
            </div>
          </dl>
        </ProfileCollapsibleRow>

        {nights.map((night) => (
          <TipTraqNightRow
            key={night.id}
            night={night}
            loading={loading}
            onDelete={(id) => void deleteNight(id)}
          />
        ))}
      </ul>

      {nights.length === 0 && (
        <p className="dash-meds__empty-copy">
          No nights on file. Load the Sean James demo block or add nights from TipTraQ summary
          reports.
        </p>
      )}

      <div className="dash-meds__tile-foot">
        {assessment && nights.length === 0 && (
          <Button type="button" onClick={loadDemoNights} disabled={loading}>
            {loading ? 'Loading…' : 'Load Sean James demo (3 nights)'}
          </Button>
        )}
        {!assessment && (
          <p className="dash-meds__empty-copy">
            Order a TipTraQ kit first to link readings to this block.
          </p>
        )}
      </div>

      {error && (
        <div className="dash-meds__tile-foot">
          <FormError>{error}</FormError>
        </div>
      )}
    </section>
  )
}
