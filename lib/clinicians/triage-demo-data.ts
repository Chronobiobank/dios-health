import { computeTriageStatus } from '@/lib/clinicians/triage-status'
import type { TriagePatient } from '@/lib/clinicians/triage-types'

export const SEAN_JAMES_REF = 'SEAN-001'
export const DEFAULT_SELECTED_PATIENT_ID = 'sean-001'

const seanPthHistory = [
  { drawnAt: '2025-12-08', pthPgMl: 52 },
  { drawnAt: '2026-03-14', pthPgMl: 44 },
  { drawnAt: '2026-06-01', pthPgMl: 38 },
]

const seanSafetyGates = [
  { type: 'CALCIUM_CASCADE' as const, status: 'CLEAR' as const },
  { type: 'EGFR' as const, status: 'CLEAR' as const },
  { type: 'HYDRATION' as const, status: 'CLEAR' as const },
]

const seanComputed = computeTriageStatus({
  pthPgMl: 38,
  pthHistory: seanPthHistory,
  safetyGates: seanSafetyGates,
  nextLabDue: '2026-07-15',
})

const SEAN_JAMES: TriagePatient = {
  id: 'sean-001',
  ref: SEAN_JAMES_REF,
  name: 'Sean James',
  protocol: 'coimbra',
  enrolledAt: '2025-11-01',
  consentChronobiobank: true,
  is_premium_tier: true,
  device_alert_triggered: false,
  triageStatus: seanComputed.status,
  pthTrend: seanComputed.pthTrend,
  bti: {
    clockTime: '22:57',
    biologicalTime: '22:57',
    delayMinutes: 94,
    confidence: 'ESTIMATED',
    layer: 'L1_MLUX',
    mluxPercent: 38,
  },
  labs: {
    pthPgMl: 38,
    vitaminDNmol: 142,
    sleepEfficiencyPct: 74,
    remLatencyMin: 162,
    ahi: 5.4,
    snsDominancePct: 81,
    wasoMin: 72,
  },
  pthHistory: seanPthHistory,
  safetyGates: seanSafetyGates,
  nextLabDue: '2026-07-15',
  protocolDrugs: [
    { name: 'Vitamin D3', dose: '100,000 IU/day', cluster: 'architect' },
    { name: 'Magnesium glycinate', dose: '400mg', cluster: null, note: 'cofactor' },
    { name: 'Vitamin K2 MK7', dose: '200mcg', cluster: null, note: 'cofactor' },
    { name: 'B50 complex', dose: 'phase 2', cluster: 'architect' },
  ],
  nextAction: 'Lab due 15 Jul. All gates clear. No action required.',
  coachSessions: [
    {
      type: 'LAB_REVIEW',
      summary: 'PTH 38 pg/mL — lower third. All safety gates clear. Next lab 15 July.',
      at: '2026-06-01T10:00:00Z',
      durationSec: 42,
    },
    {
      type: 'DAILY_CHECK',
      summary: 'D3 window opens 21:40. Magnesium cofactor confirmed taken.',
      at: '2026-05-30T21:00:00Z',
      durationSec: 28,
    },
    {
      type: 'ONBOARDING',
      summary:
        'Biological clock running 94 minutes behind wall clock. Medication windows mapped to your evening peak.',
      at: '2025-11-02T09:00:00Z',
      durationSec: 95,
    },
  ],
}

const elenaPthHistory = [
  { drawnAt: '2026-01-10', pthPgMl: 18 },
  { drawnAt: '2026-03-05', pthPgMl: 11 },
  { drawnAt: '2026-05-20', pthPgMl: 6 },
]

const elenaSafetyGates = [
  { type: 'CALCIUM_CASCADE' as const, status: 'WARNING' as const },
  { type: 'EGFR' as const, status: 'CLEAR' as const },
  { type: 'HYDRATION' as const, status: 'CLEAR' as const },
]

const elenaComputed = computeTriageStatus({
  pthPgMl: 6,
  pthHistory: elenaPthHistory,
  safetyGates: elenaSafetyGates,
  nextLabDue: '2026-05-28',
})

const ELENA_R: TriagePatient = {
  id: 'elena-001',
  ref: 'RED-001',
  name: 'Elena R.',
  protocol: 'coimbra',
  enrolledAt: '2025-08-14',
  consentChronobiobank: true,
  is_premium_tier: true,
  device_alert_triggered: true,
  triageStatus: elenaComputed.status,
  pthTrend: elenaComputed.pthTrend,
  bti: {
    clockTime: '23:12',
    biologicalTime: '23:48',
    delayMinutes: 112,
    confidence: 'ESTIMATED',
    layer: 'L1_MLUX',
    mluxPercent: 31,
  },
  labs: {
    pthPgMl: 6,
    vitaminDNmol: 134,
    sleepEfficiencyPct: 61,
    remLatencyMin: 148,
    ahi: 6.1,
    snsDominancePct: 77,
    wasoMin: 88,
  },
  pthHistory: elenaPthHistory,
  safetyGates: elenaSafetyGates,
  nextLabDue: '2026-05-28',
  protocolDrugs: [
    { name: 'Vitamin D3', dose: '68,000 IU/day', cluster: 'architect' },
    { name: 'Magnesium citrate', dose: '600mg', cluster: null, note: 'cofactor' },
  ],
  nextAction: 'Calcium cascade WARNING — hold D3 notifications. Clinician review required.',
  coachSessions: [
    {
      type: 'LAB_REVIEW',
      summary: 'PTH floor alert. Calcium cascade flagged. Contact clinician before next dose.',
      at: '2026-05-21T09:00:00Z',
      durationSec: 55,
    },
    {
      type: 'DAILY_CHECK',
      summary: 'D3 window paused. Awaiting clinician clearance.',
      at: '2026-05-22T21:00:00Z',
      durationSec: 22,
    },
    {
      type: 'ONBOARDING',
      summary: 'Clock delay 112 minutes. High-dose protocol mapped with safety gates active.',
      at: '2025-08-15T11:00:00Z',
      durationSec: 88,
    },
  ],
}

const marcusPthHistory = [
  { drawnAt: '2025-11-18', pthPgMl: 54 },
  { drawnAt: '2026-02-12', pthPgMl: 48 },
  { drawnAt: '2026-04-22', pthPgMl: 46 },
]

const marcusSafetyGates = [
  { type: 'CALCIUM_CASCADE' as const, status: 'CLEAR' as const },
  { type: 'EGFR' as const, status: 'CLEAR' as const },
  { type: 'HYDRATION' as const, status: 'CLEAR' as const },
]

const marcusComputed = computeTriageStatus({
  pthPgMl: 46,
  pthHistory: marcusPthHistory,
  safetyGates: marcusSafetyGates,
  nextLabDue: '2026-06-08',
})

const MARCUS_H: TriagePatient = {
  id: 'marcus-001',
  ref: 'AMB-001',
  name: 'Marcus H.',
  protocol: 'gominak',
  enrolledAt: '2025-10-02',
  consentChronobiobank: false,
  is_premium_tier: true,
  device_alert_triggered: false,
  triageStatus: marcusComputed.status,
  pthTrend: marcusComputed.pthTrend,
  bti: {
    clockTime: '21:40',
    biologicalTime: '22:15',
    delayMinutes: 68,
    confidence: 'PRECISION',
    layer: 'L1_MLUX',
    mluxPercent: 44,
  },
  labs: {
    pthPgMl: 46,
    vitaminDNmol: 94,
    sleepEfficiencyPct: 79,
    remLatencyMin: 118,
    ahi: 3.2,
    snsDominancePct: 64,
    wasoMin: 41,
  },
  pthHistory: marcusPthHistory,
  safetyGates: marcusSafetyGates,
  nextLabDue: '2026-06-08',
  protocolDrugs: [
    { name: 'Vitamin D3', dose: '42,000 IU/day', cluster: 'architect' },
    { name: 'B12 methylcobalamin', dose: '5,000mcg', cluster: 'restorer' },
  ],
  nextAction: 'Lab due 8 Jun. PTH still in middle third — review titration at next draw.',
  coachSessions: [
    {
      type: 'LAB_REVIEW',
      summary: 'PTH 46 pg/mL — middle third. Dose held pending lab review.',
      at: '2026-04-23T10:00:00Z',
      durationSec: 38,
    },
    {
      type: 'DAILY_CHECK',
      summary: 'D3 window 20:10. B12 restorer window morning — missed yesterday.',
      at: '2026-05-31T08:00:00Z',
      durationSec: 31,
    },
    {
      type: 'ONBOARDING',
      summary: 'Biological delay 68 minutes. Gominak protocol windows mapped.',
      at: '2025-10-03T14:00:00Z',
      durationSec: 72,
    },
  ],
}

export const TRIAGE_DEMO_COHORT: TriagePatient[] = [ELENA_R, MARCUS_H, SEAN_JAMES]

export function getSortedTriageCohort(): TriagePatient[] {
  return [...TRIAGE_DEMO_COHORT].sort((a, b) => {
    if (a.device_alert_triggered !== b.device_alert_triggered) {
      return a.device_alert_triggered ? -1 : 1
    }
    const statusDelta =
      (a.triageStatus === 'URGENT' ? 0 : a.triageStatus === 'REVIEW' ? 1 : 2) -
      (b.triageStatus === 'URGENT' ? 0 : b.triageStatus === 'REVIEW' ? 1 : 2)
    if (statusDelta !== 0) return statusDelta
    return a.name.localeCompare(b.name)
  })
}

export function getTriagePatient(id: string): TriagePatient | undefined {
  return TRIAGE_DEMO_COHORT.find((p) => p.id === id)
}
