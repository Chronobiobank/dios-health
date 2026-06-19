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
import { Badge } from '@/components/ui/Layout'
import { Button } from '@/components/ui/Button'

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

function formatTime(t: string | null): string {
  if (!t) return '—'
  return t.slice(0, 5)
}

function remLatency(night: TipTraqNightRecord): number {
  if (!night.first_rem_onset) return 0
  const toM = (c: string) => {
    const [h, m] = c.split(':').map(Number)
    return h * 60 + m
  }
  let onset = toM(night.sleep_onset)
  let rem = toM(night.first_rem_onset)
  if (rem < onset) rem += 1440
  return rem - onset
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

  return (
    <section className="seco-app-card overflow-hidden !p-0">
      <div className="border-b border-border p-5 md:p-6">
        <p className="seco-page__eyebrow mb-1">TipTraQ readings</p>
        <h2 className="seco-app-card__title">3-night clinical block</h2>
        <p className="mt-2 text-sm text-ink-muted">{metrics.clinicalRead}</p>
      </div>

      <div className="grid gap-0 border-b border-border sm:grid-cols-2 lg:grid-cols-4">
        <MetricCell label="Nights" value={`${metrics.nightsLoaded}/${metrics.nightsRequired}`} />
        <MetricCell label="Mean AHI" value={`${metrics.meanAhi} · ${metrics.ahiSeverityBand}`} />
        <MetricCell label="Sleep efficiency" value={`${metrics.meanEfficiencyPct}%`} />
        <MetricCell label="DLMO proxy" value={metrics.dlmoEstimate} />
      </div>

      <div className="grid gap-0 border-b border-border sm:grid-cols-2 lg:grid-cols-4">
        <MetricCell label="Mean onset" value={metrics.meanSleepOnset} />
        <MetricCell label="Mean wake" value={metrics.meanWake} />
        <MetricCell label="Total sleep" value={metrics.meanTstLabel} />
        <MetricCell label="Social jet lag" value={metrics.socialJetlagLabel} />
      </div>

      {nights.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[48rem] text-left text-sm">
            <thead>
              <tr className="border-b border-border bg-surface-muted/50 text-xs uppercase tracking-wide text-ink-faint">
                <th className="px-5 py-3 font-medium">Night</th>
                <th className="px-3 py-3 font-medium">Onset</th>
                <th className="px-3 py-3 font-medium">Wake</th>
                <th className="px-3 py-3 font-medium">TST</th>
                <th className="px-3 py-3 font-medium">Eff.</th>
                <th className="px-3 py-3 font-medium">AHI</th>
                <th className="px-3 py-3 font-medium">SpO₂</th>
                <th className="px-3 py-3 font-medium">REM lat.</th>
                <th className="px-3 py-3 font-medium">DLMO</th>
                <th className="px-5 py-3 font-medium" />
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {nights.map((night) => {
                const remLat = remLatency(night)
                return (
                  <tr key={night.id}>
                    <td className="px-5 py-4">
                      <p className="font-medium text-ink">{formatDate(night.report_date)}</p>
                      <p className="text-xs text-ink-faint">
                        Night {night.night_index ?? '—'} · {night.day_type ?? '—'}
                      </p>
                    </td>
                    <td className="px-3 py-4 font-mono text-ink">{formatTime(night.sleep_onset)}</td>
                    <td className="px-3 py-4 font-mono text-ink">{formatTime(night.sleep_offset)}</td>
                    <td className="px-3 py-4 text-ink-muted">
                      {Math.round((night.tst_minutes ?? 0) / 60)}h {night.tst_minutes % 60}m
                    </td>
                    <td className="px-3 py-4">
                      <Badge tone={STATUS_TONE[sleepEfficiencyStatus(night.sleep_efficiency_pct)]}>
                        {night.sleep_efficiency_pct}%
                      </Badge>
                    </td>
                    <td className="px-3 py-4">
                      <Badge tone={STATUS_TONE[ahiStatus(Number(night.ahi))]}>
                        {night.ahi} · {night.ahi_severity ?? '—'}
                      </Badge>
                    </td>
                    <td className="px-3 py-4">
                      <Badge tone={STATUS_TONE[spo2Status(night.min_spo2)]}>
                        {night.min_spo2 ?? '—'}%
                      </Badge>
                    </td>
                    <td className="px-3 py-4">
                      <Badge tone={STATUS_TONE[remLatencyStatus(remLat)]}>{remLat} min</Badge>
                    </td>
                    <td className="px-3 py-4 font-mono text-ink">{formatTime(night.proxy_dlmo_time)}</td>
                    <td className="px-5 py-4">
                      <button
                        type="button"
                        className="text-xs text-warning underline"
                        disabled={loading}
                        onClick={() => void deleteNight(night.id)}
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="p-5 text-sm text-ink-muted md:p-6">
          No nights on file. Load the Sean James demo block or add nights from TipTraQ summary reports.
        </p>
      )}

      <div className="flex flex-wrap gap-3 border-t border-border p-5 md:p-6">
        {assessment && nights.length === 0 && (
          <Button type="button" onClick={loadDemoNights} disabled={loading}>
            {loading ? 'Loading…' : 'Load Sean James demo (3 nights)'}
          </Button>
        )}
        {!assessment && (
          <p className="text-sm text-ink-muted">Order a TipTraQ kit first to link readings to this block.</p>
        )}
      </div>

      {error && <p className="px-5 pb-5 text-sm text-warning md:px-6">{error}</p>}
    </section>
  )
}

function MetricCell({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-b border-border p-5 sm:border-b-0 sm:border-r sm:last:border-r-0 md:p-6">
      <p className="text-xs font-medium uppercase tracking-wider text-ink-faint">{label}</p>
      <p className="mt-1 font-mono text-base text-ink">{value}</p>
    </div>
  )
}
