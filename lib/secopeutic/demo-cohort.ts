/**
 * Secopeutic pilot demo cohort — illustrative patients for practitioner onboarding.
 * Not real individuals. For Stasha Gominak (sleep-led) and Cicero Coimbra (PTH-led) demos.
 */

import {
  d3TimingStatus,
  pthStatus,
  remLatencyStatus,
  sleepEfficiencyStatus,
  type PrgcMetricCell,
  type PrgcMonitoringPatient,
} from '@/lib/clinic/prgc-monitoring'
import { buildSeanJamesClinicianDemoPatient } from '@/lib/secopeutic/sean-james-clinician-demo'

export type SecopeuticProtocol = 'gominak' | 'coimbra'

export type SecopeuticZone = 'stable' | 'review' | 'hold'

export type SecopeuticLabPoint = {
  drawnAt: string
  pthPgMl: number
  vitaminDNmol: number
  calciumMmol: number
  urinaryCalciumMg: number | null
  egfr: number
  b12Pmol: number | null
}

export type SecopeuticPatientDemographics = {
  dateOfBirth: string
  city: string
  country: string
  fitzpatrickType: number
}

export type SecopeuticDemoPatient = PrgcMonitoringPatient & {
  protocol: SecopeuticProtocol
  indication: string
  safetyZone: SecopeuticZone
  responseZone: SecopeuticZone
  /** Full inputs vs demographics and TipTraQ only */
  profileScope?: 'full' | 'tiptraq-demographics'
  demographics?: SecopeuticPatientDemographics
  /** TipTraQ-only strip — sleep onset and total sleep */
  tiptraqSleepOnset?: PrgcMetricCell
  tiptraqTotalSleep?: PrgcMetricCell
  /** Morning D3 window adherence — last 30 days; null when inputs missing */
  doseWindowPct: number | null
  /** Phone melanopic diagnostic panel */
  mobileLight: PrgcMetricCell
  /** City Labs blood panel */
  bloodPanel: PrgcMetricCell
  /** Three-night TipTraQ sleep block */
  tiptraqBlock: PrgcMetricCell
  lastCityLabsDraw: string | null
  lastTipTraqBlock: string | null
  nextPanelDue: string | null
  labHistory: SecopeuticLabPoint[]
  safetySummary: string
  demoAudience: 'gominak' | 'coimbra' | 'both'
}

function cell(
  value: string,
  status: PrgcMetricCell['status'],
  opts?: { trend?: PrgcMetricCell['trend']; prior?: string; hint?: string }
): PrgcMetricCell {
  return { value, status, ...opts }
}

export const SECOPUTIC_DEMO_PATIENTS: SecopeuticDemoPatient[] = [
  buildSeanJamesClinicianDemoPatient(),
  {
    id: 'helena-kowalski',
    displayName: 'Helena Kowalski',
    age: 38,
    recordId: 'HK-031',
    protocol: 'gominak',
    indication: 'Treatment-resistant depression · sleep architecture recovery',
    safetyZone: 'stable',
    responseZone: 'review',
    doseWindowPct: 92,
    mobileLight: cell('88%', d3TimingStatus(88), {
      hint: 'Phone melanopic panel · on schedule',
    }),
    bloodPanel: cell('18 Apr 2026', pthStatus(19), {
      hint: 'City Labs · D3 168 nmol/L',
    }),
    tiptraqBlock: cell('3 nights', sleepEfficiencyStatus(83, 'improving'), {
      hint: 'May block · REM latency falling',
    }),
    lastCityLabsDraw: '2026-04-18',
    lastTipTraqBlock: '2026-05-28',
    nextPanelDue: '2026-07-18',
    demoAudience: 'gominak',
    sleepEfficiency: cell('83%', sleepEfficiencyStatus(83, 'improving'), {
      trend: 'improving',
      prior: '76%',
      hint: 'Rising toward 85% Gominak target',
    }),
    remLatency: cell('88 min', remLatencyStatus(88, 'improving'), {
      trend: 'improving',
      prior: '118 min',
      hint: 'Falling toward 90 min — leads PTH by weeks',
    }),
    pth: cell('19 pg/mL', pthStatus(19), {
      hint: 'Suppressed — concordant with timing',
    }),
    d3Timing: cell('92%', d3TimingStatus(92), {
      hint: 'Morning window — City Labs D3 168 nmol/L',
    }),
    clinicalRead:
      'Sleep architecture is recovering on TipTraQ before the next B12 draw lands. REM latency and efficiency trending green while PTH stays suppressed. Bridge B-vitamin phase per your protocol — sleep is the early signal here, not IU.',
    action: 'Review — B-vitamin phase · hold IU',
    safetySummary: 'Calcium cascade clear. eGFR 88. No hold signal.',
    labHistory: [
      {
        drawnAt: '2026-04-18',
        pthPgMl: 19,
        vitaminDNmol: 168,
        calciumMmol: 2.38,
        urinaryCalciumMg: 185,
        egfr: 88,
        b12Pmol: 312,
      },
      {
        drawnAt: '2026-01-20',
        pthPgMl: 22,
        vitaminDNmol: 154,
        calciumMmol: 2.36,
        urinaryCalciumMg: 192,
        egfr: 89,
        b12Pmol: 268,
      },
    ],
  },
  {
    id: 'marcus-okonkwo',
    displayName: 'Marcus Okonkwo',
    age: 52,
    recordId: 'MO-018',
    protocol: 'coimbra',
    indication: 'Relapsing-remitting MS · supervised high-dose D3',
    safetyZone: 'stable',
    responseZone: 'stable',
    doseWindowPct: 97,
    mobileLight: cell('91%', d3TimingStatus(91), {
      hint: 'Phone melanopic panel · stable rhythm',
    }),
    bloodPanel: cell('12 Mar 2026', pthStatus(24, 'improving'), {
      hint: 'City Labs · draw in 11 days',
    }),
    tiptraqBlock: cell('3 nights', sleepEfficiencyStatus(87), {
      hint: 'May block · concordant with PTH',
    }),
    lastCityLabsDraw: '2026-03-12',
    lastTipTraqBlock: '2026-05-14',
    nextPanelDue: '2026-06-10',
    demoAudience: 'coimbra',
    sleepEfficiency: cell('87%', sleepEfficiencyStatus(87), {
      hint: 'Concordance pathway — optional for Coimbra',
    }),
    remLatency: cell('79 min', remLatencyStatus(79), {
      hint: 'Confirms hold before next IU decision',
    }),
    pth: cell('24 pg/mL', pthStatus(24, 'improving'), {
      trend: 'improving',
      prior: '31 pg/mL',
      hint: 'Middle third trending down — 90-day draw in 11 days',
    }),
    d3Timing: cell('97%', d3TimingStatus(97), {
      hint: 'Morning window adherence excellent',
    }),
    clinicalRead:
      'PTH trajectory improving with calcium cascade clear on last City Labs panel. TipTraQ concordant — two pathways agree to hold IU until the next 90-day draw. Audit trail exports the full between-panel record.',
    action: 'Stable — hold protocol',
    safetySummary: 'Serum Ca 2.41 · urinary Ca clear · eGFR 91.',
    labHistory: [
      {
        drawnAt: '2026-03-12',
        pthPgMl: 24,
        vitaminDNmol: 312,
        calciumMmol: 2.41,
        urinaryCalciumMg: 210,
        egfr: 91,
        b12Pmol: 445,
      },
      {
        drawnAt: '2025-12-08',
        pthPgMl: 31,
        vitaminDNmol: 278,
        calciumMmol: 2.39,
        urinaryCalciumMg: 225,
        egfr: 92,
        b12Pmol: 420,
      },
      {
        drawnAt: '2025-09-05',
        pthPgMl: 38,
        vitaminDNmol: 245,
        calciumMmol: 2.44,
        urinaryCalciumMg: 248,
        egfr: 90,
        b12Pmol: 398,
      },
    ],
  },
  {
    id: 'renata-ferreira',
    displayName: 'Renata Ferreira',
    age: 45,
    recordId: 'RF-007',
    protocol: 'coimbra',
    indication: 'Psoriasis · Coimbra protocol induction',
    safetyZone: 'review',
    responseZone: 'review',
    doseWindowPct: 31,
    mobileLight: cell('42%', d3TimingStatus(42), {
      hint: 'Phone panel · evening light drift',
    }),
    bloodPanel: cell('2 May 2026', pthStatus(40), {
      hint: 'City Labs · Ca upper watch',
    }),
    tiptraqBlock: cell('3 nights', sleepEfficiencyStatus(73), {
      hint: 'May block · timing failure pattern',
    }),
    lastCityLabsDraw: '2026-05-02',
    lastTipTraqBlock: '2026-05-30',
    nextPanelDue: '2026-08-02',
    demoAudience: 'both',
    sleepEfficiency: cell('73%', sleepEfficiencyStatus(73), {
      hint: 'Below 75% — matches timing failure',
    }),
    remLatency: cell('132 min', remLatencyStatus(132), {
      hint: 'D3-mediated dysfunction pattern on TipTraQ',
    }),
    pth: cell('40 pg/mL', pthStatus(40), {
      hint: 'Unsuppressed — not a dose problem yet',
    }),
    d3Timing: cell('31%', d3TimingStatus(31), {
      hint: 'Evening dosing — wrong window',
    }),
    clinicalRead:
      'PTH, sleep, and timing agree: cause is evening D3 without cofactor window discipline, not insufficient IU. Serum calcium upper watch at 2.48 mmol/L — timing education before escalation. Platform flags Review; you retain every treatment decision.',
    action: 'Review — timing gate · do not escalate IU',
    safetySummary: 'Serum Ca upper watch. Urinary Ca 268 mg. eGFR 86 — tighten panel cadence.',
    labHistory: [
      {
        drawnAt: '2026-05-02',
        pthPgMl: 40,
        vitaminDNmol: 198,
        calciumMmol: 2.48,
        urinaryCalciumMg: 268,
        egfr: 86,
        b12Pmol: 356,
      },
    ],
  },
]

export function getSecopeuticDemoPatient(id: string): SecopeuticDemoPatient | null {
  return SECOPUTIC_DEMO_PATIENTS.find((p) => p.id === id) ?? null
}

export function zoneLabel(zone: SecopeuticZone): string {
  switch (zone) {
    case 'stable':
      return 'Stable'
    case 'review':
      return 'Review'
    case 'hold':
      return 'Hold'
  }
}

export function zoneSeverity(zone: SecopeuticZone): 'green' | 'amber' | 'red' {
  switch (zone) {
    case 'stable':
      return 'green'
    case 'review':
      return 'amber'
    case 'hold':
      return 'red'
  }
}

export function protocolLabel(protocol: SecopeuticProtocol): string {
  return protocol === 'gominak' ? 'Gominak' : 'Coimbra'
}
