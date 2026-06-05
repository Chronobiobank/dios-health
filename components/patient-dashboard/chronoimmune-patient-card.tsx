'use client'

import {
  Area,
  CartesianGrid,
  ComposedChart,
  Line,
  ReferenceArea,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

import { MicronutrientChecklist } from '@/components/patient-dashboard/micronutrient-checklist'
import { SupplementEventsList } from '@/components/patient-dashboard/supplement-events-list'
import { getChronoimmuneZone } from '@/lib/chronoimmune/indication-zones'
import type { ChronoimmuneProfile, CohortTriageStatus } from '@/lib/patient-dashboard/types'
import { cn } from '@/lib/utils'

const TRIAGE_LABELS: Record<CohortTriageStatus, string> = {
  green: 'Protocol progressing',
  amber: 'Review recommended',
  red: 'Immediate attention',
}

const TRIAGE_STYLES: Record<CohortTriageStatus, string> = {
  green: 'chronoimmune-triage--green',
  amber: 'chronoimmune-triage--amber',
  red: 'chronoimmune-triage--red',
}

const GATE_STYLES = {
  clear: 'chronoimmune-gate--clear',
  watch: 'chronoimmune-gate--watch',
  hold: 'chronoimmune-gate--hold',
  alert: 'chronoimmune-gate--alert',
} as const

function formatIu(value: number): string {
  return value >= 1000 ? `${(value / 1000).toFixed(0)}k` : String(value)
}

function formatDate(iso: string): string {
  const d = new Date(`${iso}T12:00:00`)
  return d.toLocaleDateString('en-GB', { month: 'short', year: '2-digit' })
}

type ChronoimmunePatientCardProps = {
  profile: ChronoimmuneProfile
  patientId?: string | null
  orderContext?: 'patient' | 'clinician'
  ordersRefreshKey?: number
}

export function ChronoimmunePatientCard({
  profile,
  patientId = null,
  orderContext = 'patient',
  ordersRefreshKey = 0,
}: ChronoimmunePatientCardProps) {
  const zone = getChronoimmuneZone(profile.zoneId)
  const latestLab = profile.labHistory[profile.labHistory.length - 1]
  const chartData = profile.labHistory.map((point) => ({
    date: formatDate(point.testDate),
    pth: point.pth,
    dose: point.doseIuAtTest,
  }))

  return (
    <div className="chronoimmune-patient-card">
      <div className="chronoimmune-patient-card__header">
        <div>
          <p className="dash-sub uppercase tracking-widest">Chronoimmune module</p>
          <h3 className="dash-head mt-1 text-base">
            Zone {profile.zoneId} — {zone.title}
          </h3>
          <p className="dash-panel-muted mt-1 text-sm">{profile.indicationLabel}</p>
          {profile.secondaryIndicationLabels && profile.secondaryIndicationLabels.length > 0 ? (
            <ul className="mt-2 space-y-1 text-xs text-[var(--text-muted)]">
              {profile.secondaryIndicationLabels.map((label) => (
                <li key={label}>· {label}</li>
              ))}
            </ul>
          ) : null}
        </div>
        <div className="chronoimmune-patient-card__badges">
          <span className={cn('chronoimmune-triage', TRIAGE_STYLES[profile.cohortTriageStatus])}>
            {TRIAGE_LABELS[profile.cohortTriageStatus]}
          </span>
          <span className="chronoimmune-record-id font-mono text-[10px] text-[var(--text-muted)]">
            {profile.recordId}
          </span>
        </div>
      </div>

      {!profile.consentOnFile ? (
        <div className="chronoimmune-consent-banner" role="status">
          <p className="text-sm font-medium">Protocol consent required</p>
          <p className="mt-1 text-xs leading-relaxed opacity-90">
            No signed consent document on file for Zone {profile.zoneId}. Upload the
            practitioner&apos;s protocol consent before recording dose changes.
          </p>
        </div>
      ) : null}

      <div className="chronoimmune-patient-card__grid">
        <section className="chronoimmune-panel">
          <p className="chronoimmune-panel__label">Current dose</p>
          <p className="chronoimmune-panel__value">
            {formatIu(profile.currentDoseIu)} IU/day
          </p>
          <p className="chronoimmune-panel__meta">
            {profile.iuPerKg} IU/kg · {profile.bodyWeightKg} kg
          </p>
          <p className="chronoimmune-panel__meta mt-2">
            Range {formatIu(profile.doseRangeMinIu)}–{formatIu(profile.doseRangeMaxIu)} IU
          </p>
        </section>

        <section className="chronoimmune-panel">
          <p className="chronoimmune-panel__label">PTH status</p>
          <p className="chronoimmune-panel__value">{latestLab.pth} pg/mL</p>
          <p className="chronoimmune-panel__meta">
            Target ≤ {Math.round(profile.pthTargetCeiling)} (lower third)
          </p>
          <p className="chronoimmune-panel__meta mt-2">
            25(OH)D {latestLab.serum25ohdNgMl ?? '—'} ng/mL — secondary context
          </p>
        </section>

        <section className="chronoimmune-panel">
          <p className="chronoimmune-panel__label">Next review</p>
          <p className="chronoimmune-panel__value">
            {formatDate(profile.nextReviewDate)}
          </p>
          <p className="chronoimmune-panel__meta">{profile.labReviewFrequency}</p>
          <p className="chronoimmune-panel__meta mt-2">
            Safety gates: {profile.safetyGateLevel}
          </p>
        </section>
      </div>

      <section className="chronoimmune-pth-chart">
        <p className="dash-sub mb-2 uppercase tracking-widest">PTH trend — primary endpoint</p>
        <div className="h-44 w-full min-w-0">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={chartData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(160,160,160,0.25)" />
              <XAxis dataKey="date" tick={{ fontSize: 10 }} />
              <YAxis
                domain={[profile.pthReferenceLower - 2, profile.pthReferenceUpper + 5]}
                tick={{ fontSize: 10 }}
                width={32}
              />
              <Tooltip
                contentStyle={{ fontSize: 11, borderRadius: 8 }}
                formatter={(value, name) => [
                  value,
                  name === 'pth' ? 'PTH' : 'Dose at test',
                ]}
              />
              <ReferenceArea
                y1={profile.pthReferenceLower}
                y2={profile.pthTargetCeiling}
                fill="rgba(22, 163, 74, 0.12)"
                strokeOpacity={0}
              />
              <ReferenceArea
                y1={profile.pthFloorThreshold}
                y2={profile.pthReferenceLower}
                fill="rgba(220, 38, 38, 0.08)"
                strokeOpacity={0}
              />
              <ReferenceLine
                y={profile.pthTargetCeiling}
                stroke="#16A34A"
                strokeDasharray="4 4"
                label={{ value: 'Target', position: 'insideTopRight', fontSize: 9 }}
              />
              <ReferenceLine
                y={profile.pthFloorThreshold}
                stroke="#DC2626"
                strokeDasharray="4 4"
                label={{ value: 'Floor', position: 'insideBottomRight', fontSize: 9 }}
              />
              <Area type="monotone" dataKey="pth" fill="rgba(217, 119, 6, 0.15)" stroke="none" />
              <Line
                type="monotone"
                dataKey="pth"
                stroke="#D97706"
                strokeWidth={2}
                dot={{ r: 3, fill: '#D97706' }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </section>

      <section className="chronoimmune-calcium-cascade">
        <p className="dash-sub mb-2 uppercase tracking-widest">Calcium cascade</p>
        <ul className="chronoimmune-cascade-list">
          <li className={cn('chronoimmune-gate', GATE_STYLES[profile.calciumCascade.serumCalcium])}>
            Serum calcium — {profile.calciumCascade.serumCalcium}
          </li>
          <li className={cn('chronoimmune-gate', GATE_STYLES[profile.calciumCascade.urineCalcium])}>
            24h urine calcium — {profile.calciumCascade.urineCalcium}
          </li>
          <li className={cn('chronoimmune-gate', GATE_STYLES[profile.calciumCascade.egfr])}>
            eGFR trend — {profile.calciumCascade.egfr}
          </li>
        </ul>
        {profile.titrationLocked ? (
          <p className="chronoimmune-lock-notice mt-2 text-xs">
            Titration locked — {profile.lockReason ?? 'clinician review required'}
          </p>
        ) : null}
      </section>

      <MicronutrientChecklist
        profile={profile}
        patientId={patientId}
        orderContext={orderContext}
      />

      <SupplementEventsList
        patientRecordId={profile.recordId}
        refreshKey={ordersRefreshKey}
      />
    </div>
  )
}
