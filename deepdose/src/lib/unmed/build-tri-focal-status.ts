import { computeTipTraqBlockMetrics } from '@/lib/clinical/tiptraq/metrics'
import type { TipTraqNightInput } from '@/lib/clinical/tiptraq/types'
import {
  sriTone,
  UNMED_PRODUCT_MANDATE,
  type SriTone,
} from '@/lib/unmed/product-philosophy'
import {
  sleepBlocksFromLogs,
  UnmedLocalEngine,
} from '@/lib/unmed/local-engine'
import type { TriFocalStatusModel } from '@/lib/unmed/tri-focal-types'

type BuildTriFocalInput = {
  patientId: string
  sleepLogs: { sleepOnset: string; wake: string }[]
  tiptraqNights: TipTraqNightInput[]
  circadianScore: number
}

function federatedLabel(patientId: string): string {
  const tail = patientId.replace(/-/g, '').slice(0, 6).toUpperCase()
  return `#UNM-${tail}`
}

function computeSriDials(sleepLogs: { sleepOnset: string; wake: string }[]): {
  dials: TriFocalStatusModel['sriDials']
  note: string
} {
  const engine = new UnmedLocalEngine()
  const blocks = sleepBlocksFromLogs(sleepLogs)

  const daySri = blocks.length >= 2 ? engine.calculateWindowSRI(blocks, Math.min(5, blocks.length + 1)) : null
  const weekSri = engine.calculateWindowSRI(blocks, 7)
  const monthSri = engine.calculateWindowSRI(blocks, 14)

  const dials = [
    { label: 'Day SRI', value: daySri, tone: sriTone(daySri) },
    { label: 'Week SRI', value: weekSri, tone: sriTone(weekSri) },
    { label: 'Month SRI', value: monthSri, tone: sriTone(monthSri) },
  ]

  const monthTone = sriTone(monthSri)
  const note =
    monthSri != null && monthTone !== 'optimal'
      ? 'Your long-term Month SRI tracks circadian misalignment — historically correlated with cardiovascular stress thresholds in the UK Biobank dataset.'
      : monthSri != null
        ? 'Sleep–wake regularity is within a stabilising range. Passive telemetry is validating your rhythm without additional screen time.'
        : 'Connect a wearable or complete three TipTraQ nights to unlock on-device SRI from your sleep history.';

  return { dials, note }
}

function tiptraqTone(ahi: number | null): SriTone {
  if (ahi == null) return 'warning'
  if (ahi < 5) return 'optimal'
  if (ahi < 15) return 'warning'
  return 'critical'
}

function buildTipTraq(tiptraqNights: TipTraqNightInput[]): {
  metrics: TriFocalStatusModel['tiptraqMetrics']
  pending: boolean
} {
  if (tiptraqNights.length === 0) {
    return { metrics: [], pending: true }
  }

  const block = computeTipTraqBlockMetrics(tiptraqNights)
  const ahi = block.meanAhi
  const spo2 = tiptraqNights.reduce((min, n) => {
    const v = n.min_spo2 ?? 100
    return v < min ? v : min
  }, 100)

  const ahiTone = tiptraqTone(ahi)
  const spo2Tone: SriTone = spo2 >= 94 ? 'optimal' : spo2 >= 90 ? 'warning' : 'critical'

  return {
    pending: false,
    metrics: [
      {
        label: 'Apnea Index (AHI)',
        value: ahi != null ? `${ahi}` : '—',
        status: ahiTone === 'optimal' ? 'Normal / Non-Apneic' : ahiTone === 'warning' ? 'Mild elevation' : 'Moderate+',
        tone: ahiTone,
      },
      {
        label: 'Oxygen Level (SpO₂)',
        value: `${spo2}%`,
        status: spo2Tone === 'optimal' ? 'Optimal rest profile' : 'Review with clinician',
        tone: spo2Tone,
      },
    ],
  }
}

function buildLabRows(): { rows: TriFocalStatusModel['labRows']; pending: boolean } {
  return {
    pending: true,
    rows: [
      { name: 'Fasting Insulin', value: '—', state: 'Awaiting assay', tone: 'warning' },
      { name: 'HbA1c (Blood Sugar)', value: '—', state: 'Awaiting assay', tone: 'warning' },
      { name: 'hs-CRP (Inflammation)', value: '—', state: 'Awaiting assay', tone: 'warning' },
    ],
  }
}

export function buildTriFocalStatus(input: BuildTriFocalInput): TriFocalStatusModel {
  const { dials, note } = computeSriDials(input.sleepLogs)
  const tiptraq = buildTipTraq(input.tiptraqNights)
  const lab = buildLabRows()

  const hasAnySignal =
    input.sleepLogs.length > 0 || input.tiptraqNights.length > 0 || input.circadianScore > 0

  return {
    federatedId: federatedLabel(input.patientId),
    syncLocked: hasAnySignal,
    sriDials: dials,
    sriNote: note,
    tiptraqMetrics: tiptraq.metrics,
    tiptraqPending: tiptraq.pending,
    labRows: lab.rows,
    labPending: lab.pending,
  }
}

export { UNMED_PRODUCT_MANDATE }
