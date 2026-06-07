'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'

import { TriageBadges } from '@/components/clinicians/triage-badges'
import {
  fetchClinicianTriageDashboard,
  sortTriageDashboardRows,
} from '@/lib/clinicians/clinician-triage-dashboard'
import {
  getLocalTriageCohort,
  getTriageMockPatient,
  type TriageMockPatient,
} from '@/lib/clinicians/triage-mock-cohort'
import { simulateBiologicalWindowFromTelemetry } from '@/lib/dios/bti/btiEngineService'
import type { BtiEnginePayload, WearableTelemetryLogRow } from '@/lib/dios/bti/types'
import { MockTipTraQAdapter } from '@/lib/dios/premium/mock-tiptraq-adapter'
import { cn } from '@/lib/utils'

const STATUS_DOT = {
  URGENT: 'ct-card__dot--urgent',
  REVIEW: 'ct-card__dot--review',
  ON_TRACK: 'ct-card__dot--on-track',
} as const

const BTI_STATUS = {
  WINDOW_OPEN: 'ct-bti__status--open',
  WINDOW_CLOSED: 'ct-bti__status--closed',
  CRITICAL_DRIFT: 'ct-bti__status--drift',
} as const

function formatDate(iso: string | null): string {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
}

function buildTelemetryForPatient(patient: TriageMockPatient): WearableTelemetryLogRow {
  if (patient.is_premium_tier) {
    return {
      ...new MockTipTraQAdapter().toWearableTelemetryInsert(patient.patient_id),
      id: `mock-${patient.patient_ref}`,
      created_at: new Date().toISOString(),
    }
  }

  const syncedAt = new Date().toISOString()
  const onset = new Date(Date.now() - 7.5 * 3_600_000).toISOString()
  const wake = new Date(Date.now() - 0.5 * 3_600_000).toISOString()

  return {
    id: `mock-${patient.patient_ref}`,
    patient_id: patient.patient_id,
    synced_at: syncedAt,
    sleep_onset_timestamp: onset,
    wake_timestamp: wake,
    deep_sleep_duration_minutes: 72,
    rem_duration_minutes: 68,
    daily_average_hrv: 52,
    intra_night_hrv_series: [],
    lux_exposure_hours: 1.6,
    source: patient.wearable_source,
    ingestion_tier: 'CORE',
    average_spo2: null,
    respiratory_disturbance_index: null,
    created_at: syncedAt,
  }
}

type QueueCardProps = {
  patient: TriageMockPatient
  active: boolean
  loading: boolean
  onSelect: () => void
  onViewBti: () => void
}

function QueueCard({ patient, active, loading, onSelect, onViewBti }: QueueCardProps) {
  return (
    <article
      className={cn('ct-card', active && 'is-active', patient.device_alert_triggered && 'ct-card--alert')}
    >
      <button type="button" className="ct-card__main" onClick={onSelect}>
        <div className="ct-card__row">
          <span className={cn('ct-card__dot', STATUS_DOT[patient.triage_status])} aria-hidden />
          <div>
            <p className="ct-card__name">{patient.patient_name}</p>
            <p className="ct-card__ref">{patient.patient_ref}</p>
            <TriageBadges
              variant="shell"
              isPremiumTier={patient.is_premium_tier}
              deviceAlertTriggered={patient.device_alert_triggered}
              wearableSource={patient.wearable_source}
            />
            <div className="ct-card__meta">
              <span>PTH {patient.pth_pgml ?? '—'}</span>
              <span>Lab {formatDate(patient.next_lab_due)}</span>
            </div>
          </div>
        </div>
      </button>
      <button type="button" className="ct-card__action" disabled={loading} onClick={onViewBti}>
        {loading ? 'Calculating…' : 'View BTI Window'}
      </button>
    </article>
  )
}

function DetailShell({ patient }: { patient: TriageMockPatient }) {
  return (
    <section className="ct-detail">
      <header className="ct-detail__header">
        <h2 className="ct-detail__name">{patient.patient_name}</h2>
        <p className="ct-detail__ref">
          {patient.patient_ref} · {patient.protocol.toUpperCase()}
        </p>
        <div className="ct-detail__badges">
          <TriageBadges
            variant="shell"
            isPremiumTier={patient.is_premium_tier}
            deviceAlertTriggered={patient.device_alert_triggered}
            wearableSource={patient.wearable_source}
          />
        </div>
      </header>

      <div className="ct-detail__grid">
        <div className="ct-detail__metric">
          <p className="ct-detail__metric-label">Triage</p>
          <p className="ct-detail__metric-value">{patient.triage_status.replace('_', ' ')}</p>
        </div>
        <div className="ct-detail__metric">
          <p className="ct-detail__metric-label">PTH</p>
          <p className="ct-detail__metric-value">{patient.pth_pgml ?? '—'} pg/mL</p>
        </div>
        <div className="ct-detail__metric">
          <p className="ct-detail__metric-label">BTI delay</p>
          <p className="ct-detail__metric-value">
            {patient.bti_delay_minutes != null ? `${patient.bti_delay_minutes} min` : '—'}
          </p>
        </div>
        <div className="ct-detail__metric">
          <p className="ct-detail__metric-label">Last sync</p>
          <p className="ct-detail__metric-value">{formatDate(patient.last_telemetry_sync_at)}</p>
        </div>
      </div>

      <div className="ct-detail__sections">
        <div className="ct-detail__section">
          <p className="ct-detail__section-label">BTI engine</p>
          <p className="ct-detail__section-copy">Structured dosing window output only.</p>
        </div>
        <div className="ct-detail__section">
          <p className="ct-detail__section-label">Safety gates</p>
          <p className="ct-detail__section-copy">Calcium cascade · eGFR · hydration.</p>
        </div>
        <div className="ct-detail__section">
          <p className="ct-detail__section-label">DINA log</p>
          <p className="ct-detail__section-copy">Last three voice sessions.</p>
        </div>
      </div>
    </section>
  )
}

function BtiPanel({
  payload,
  patientName,
  onClose,
}: {
  payload: BtiEnginePayload
  patientName: string
  onClose: () => void
}) {
  return (
    <aside className="ct-bti" role="dialog" aria-label={`BTI window for ${patientName}`}>
      <div className="ct-bti__head">
        <h3 className="ct-bti__title">BTI — {patientName}</h3>
        <button type="button" className="ct-bti__close" onClick={onClose}>
          Close
        </button>
      </div>
      <p className={cn('ct-bti__status', BTI_STATUS[payload.bti_status])}>
        {payload.bti_status.replace('_', ' ')}
      </p>
      <p className="ct-bti__instruction">{payload.display_instruction}</p>
      <p className="ct-detail__section-copy" style={{ marginTop: '0.5rem' }}>
        Biological {payload.biological_time_relative} · opens{' '}
        {new Date(payload.dosing_window_start).toLocaleTimeString('en-GB', {
          hour: '2-digit',
          minute: '2-digit',
        })}
      </p>
    </aside>
  )
}

export function ClinicianTriageDashboard() {
  const [cohort, setCohort] = useState<TriageMockPatient[]>(() => getLocalTriageCohort())
  const [loadingCohort, setLoadingCohort] = useState(true)
  const [selectedId, setSelectedId] = useState<string | null>(cohort[0]?.patient_id ?? null)
  const [btiLoadingId, setBtiLoadingId] = useState<string | null>(null)
  const [btiResult, setBtiResult] = useState<BtiEnginePayload | null>(null)

  useEffect(() => {
    let cancelled = false

    void fetchClinicianTriageDashboard().then((rows) => {
      if (cancelled) return
      setCohort(rows)
      setSelectedId((current) => current ?? rows[0]?.patient_id ?? null)
      setLoadingCohort(false)
    })

    return () => {
      cancelled = true
    }
  }, [])

  const sortedCohort = useMemo(() => sortTriageDashboardRows(cohort) as TriageMockPatient[], [cohort])

  const selected =
    getTriageMockPatient(selectedId ?? '') ??
    sortedCohort.find((patient) => patient.patient_id === selectedId) ??
    sortedCohort[0]

  const stats = useMemo(() => {
    return {
      alerts: sortedCohort.filter((row) => row.device_alert_triggered).length,
      premium: sortedCohort.filter((row) => row.is_premium_tier).length,
      urgent: sortedCohort.filter((row) => row.triage_status === 'URGENT').length,
      review: sortedCohort.filter((row) => row.triage_status === 'REVIEW').length,
      onTrack: sortedCohort.filter((row) => row.triage_status === 'ON_TRACK').length,
    }
  }, [sortedCohort])

  const handleViewBti = useCallback((patient: TriageMockPatient) => {
    setBtiLoadingId(patient.patient_id)
    const telemetry = buildTelemetryForPatient(patient)
    const payload = simulateBiologicalWindowFromTelemetry(telemetry, patient.primary_medication_id)
    setBtiResult(payload)
    setBtiLoadingId(null)
  }, [])

  return (
    <div className="ct-shell dios-nav-tone-surface dios-page-top-bleed">
      <div className="ct-shell__frame">
        <header className="ct-shell__top">
          <p className="ct-shell__eyebrow">Dose Intelligence OS</p>
          <h1 className="ct-shell__title">Who needs attention this week?</h1>
          <div className="ct-shell__stats">
            <span>
              <strong>{stats.alerts}</strong> device alert
            </span>
            <span>
              <strong>{stats.premium}</strong> TipTraQ verified
            </span>
            <span>
              <strong>{stats.urgent}</strong> urgent
            </span>
            <span>
              <strong>{stats.review}</strong> review
            </span>
            <span>
              <strong>{stats.onTrack}</strong> on track
            </span>
            {loadingCohort ? <span>Syncing cohort…</span> : null}
          </div>
        </header>

        <div className="ct-shell__body">
          <aside className="ct-shell__queue">
            <p className="ct-shell__queue-label">Priority queue</p>
            {sortedCohort.map((patient) => (
              <QueueCard
                key={patient.patient_id}
                patient={patient}
                active={patient.patient_id === selected?.patient_id}
                loading={btiLoadingId === patient.patient_id}
                onSelect={() => setSelectedId(patient.patient_id)}
                onViewBti={() => handleViewBti(patient)}
              />
            ))}
          </aside>

          <main className="ct-shell__detail">
            {selected ? <DetailShell patient={selected} /> : null}
            {btiResult && selected ? (
              <BtiPanel
                payload={btiResult}
                patientName={selected.patient_name}
                onClose={() => setBtiResult(null)}
              />
            ) : null}
          </main>
        </div>
      </div>
    </div>
  )
}
