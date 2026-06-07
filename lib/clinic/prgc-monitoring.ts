/**
 * Coimbra / Gominak practitioner monitoring — four readouts that answer one question:
 * is the pRGC system working?
 */

export type PrgcMetricStatus = 'green' | 'amber' | 'red'

export type PrgcMetricTrend = 'improving' | 'worsening' | 'stable'

export type PrgcMetricCell = {
  value: string
  status: PrgcMetricStatus
  trend?: PrgcMetricTrend
  prior?: string
  hint?: string
}

export type PrgcMonitoringPatient = {
  id: string
  displayName: string
  age: number
  recordId: string
  sleepEfficiency: PrgcMetricCell
  remLatency: PrgcMetricCell
  pth: PrgcMetricCell
  d3Timing: PrgcMetricCell
  /** One-line clinical read when four numbers are read together */
  clinicalRead: string
  /** Recommended action — timing education, hold dose, on track */
  action: string
}

export const PRGC_THRESHOLDS = {
  sleepEfficiency: { target: 85, signalBelow: 75 },
  remLatencyMins: { target: 90, dysfunctionAbove: 120 },
  pthPgMl: { suppressedBelow: 20 },
  d3TimingPct: { excellent: 90, poorBelow: 70 },
} as const

export function sleepEfficiencyStatus(pct: number, trend?: PrgcMetricTrend): PrgcMetricStatus {
  if (pct >= PRGC_THRESHOLDS.sleepEfficiency.target) return 'green'
  if (pct < PRGC_THRESHOLDS.sleepEfficiency.signalBelow) return 'red'
  if (trend === 'improving') return 'amber'
  return 'amber'
}

export function remLatencyStatus(mins: number, trend?: PrgcMetricTrend): PrgcMetricStatus {
  if (mins <= PRGC_THRESHOLDS.remLatencyMins.target) return 'green'
  if (mins > PRGC_THRESHOLDS.remLatencyMins.dysfunctionAbove) return 'red'
  if (trend === 'improving') return 'amber'
  return 'amber'
}

export function pthStatus(pgMl: number, trend?: PrgcMetricTrend): PrgcMetricStatus {
  if (pgMl < PRGC_THRESHOLDS.pthPgMl.suppressedBelow) return 'green'
  if (pgMl >= 30) return 'red'
  if (trend === 'improving') return 'amber'
  return 'amber'
}

export function d3TimingStatus(pct: number): PrgcMetricStatus {
  if (pct >= PRGC_THRESHOLDS.d3TimingPct.excellent) return 'green'
  if (pct < PRGC_THRESHOLDS.d3TimingPct.poorBelow) return 'red'
  return 'amber'
}

export const PRGC_MONITORING_PATIENTS: PrgcMonitoringPatient[] = [
  {
    id: 'sarah-mitchell',
    displayName: 'Sarah Mitchell',
    age: 51,
    recordId: 'SM-014',
    sleepEfficiency: {
      value: '71%',
      status: sleepEfficiencyStatus(71),
      hint: 'Below 75% — protocol not yet working',
    },
    remLatency: {
      value: '148 min',
      status: remLatencyStatus(148),
      hint: 'Above 120 min — D3-mediated dysfunction pattern',
    },
    pth: {
      value: '38 pg/mL',
      status: pthStatus(38),
      hint: 'Unsuppressed — blood confirms behavioural signal',
    },
    d3Timing: {
      value: '29%',
      status: d3TimingStatus(29),
      hint: 'Evening dosing — wrong window',
    },
    clinicalRead:
      'pRGC system not working. D3 taken in the evening without cofactors. PTH and sleep architecture agree — cause is timing, not dose.',
    action: 'DINA timing education — do not escalate D3',
  },
  {
    id: 'ngozi-eze',
    displayName: 'Ngozi Eze',
    age: 44,
    recordId: 'NE-022',
    sleepEfficiency: {
      value: '89%',
      status: sleepEfficiencyStatus(89),
      hint: 'Target above 85%',
    },
    remLatency: {
      value: '74 min',
      status: remLatencyStatus(74),
      hint: 'Under Gominak 90 min threshold',
    },
    pth: {
      value: '16 pg/mL',
      status: pthStatus(16),
      hint: 'Suppressed — VDR activation progressing',
    },
    d3Timing: {
      value: '100%',
      status: d3TimingStatus(100),
      hint: 'Morning window every day',
    },
    clinicalRead:
      'All four green. TipTraQ and blood panel concordant — two independent pathways confirming pRGC function.',
    action: 'On track — hold protocol',
  },
  {
    id: 'sean-001',
    displayName: 'Sean James',
    age: 47,
    recordId: 'SEAN-001',
    sleepEfficiency: {
      value: '79%',
      status: sleepEfficiencyStatus(79, 'improving'),
      trend: 'improving',
      prior: '74%',
      hint: 'Rising over six weeks',
    },
    remLatency: {
      value: '104 min',
      status: remLatencyStatus(104, 'improving'),
      trend: 'improving',
      prior: '162 min',
      hint: 'Falling toward 90 min target',
    },
    pth: {
      value: '27 pg/mL',
      status: pthStatus(27, 'improving'),
      trend: 'improving',
      prior: '34 pg/mL',
      hint: '90-day draw due in 8 weeks',
    },
    d3Timing: {
      value: '96%',
      status: d3TimingStatus(96),
      hint: 'Morning window adherence excellent',
    },
    clinicalRead:
      'Three amber trending green. Daily DINA adherence and monthly MLux proxy show progress six weeks before the next 90-day draw.',
    action: 'Hold dose — trajectory is the insight',
  },
]

export function getPrgcMonitoringPatient(id: string): PrgcMonitoringPatient | null {
  return PRGC_MONITORING_PATIENTS.find((p) => p.id === id) ?? null
}
