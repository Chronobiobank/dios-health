import {
  remLatencyStatus,
  sleepEfficiencyStatus,
  type PrgcMetricCell,
} from '@/lib/clinic/prgc-monitoring'
import {
  SEAN_JAMES_DATE_OF_BIRTH,
  seanJamesChronologicalAge,
} from '@/lib/patient-dashboard/sean-james-profile'
import {
  computeSeanJamesSleepMetrics,
  SEAN_JAMES_TIPTRAQ_NIGHTS,
  type SeanJamesNightRecord,
} from '@/lib/patient-dashboard/sean-james-tiptraq'
import type { SecopeuticDemoPatient } from '@/lib/secopeutic/demo-cohort'

export const SEAN_JAMES_RECORD_ID = 'SEAN-001'
export const SEAN_JAMES_TIPTRAQ_BLOCK_NIGHTS = 3

/** First three nights of Sean's TipTraQ block — all data on file today. */
export const SEAN_JAMES_CLINICIAN_TIPTRAQ_NIGHTS: SeanJamesNightRecord[] =
  SEAN_JAMES_TIPTRAQ_NIGHTS.slice(0, SEAN_JAMES_TIPTRAQ_BLOCK_NIGHTS)

function clockToMinutes(clock: string): number {
  const [h, m] = clock.split(':').map(Number)
  return h * 60 + m
}

function remLatencyMinutes(night: SeanJamesNightRecord): number {
  if (!night.first_rem_onset) return 0
  let onset = clockToMinutes(night.sleep_onset)
  let firstRem = clockToMinutes(night.first_rem_onset)
  if (firstRem < onset) firstRem += 1440
  return firstRem - onset
}

function cell(
  value: string,
  status: PrgcMetricCell['status'],
  opts?: { hint?: string }
): PrgcMetricCell {
  return { value, status, ...opts }
}

/** Clinician demo — demographics plus a three-night TipTraQ block only. */
export function buildSeanJamesClinicianDemoPatient(): SecopeuticDemoPatient {
  const nights = SEAN_JAMES_CLINICIAN_TIPTRAQ_NIGHTS
  const metrics = computeSeanJamesSleepMetrics(nights)
  const meanEfficiency = Math.round(
    nights.reduce((sum, night) => sum + night.sleep_efficiency_pct, 0) / Math.max(nights.length, 1)
  )
  const meanRemLatency = Math.round(
    nights.reduce((sum, night) => sum + remLatencyMinutes(night), 0) / Math.max(nights.length, 1)
  )
  const age = seanJamesChronologicalAge()

  return {
    id: 'sean-james',
    displayName: 'Sean James',
    age,
    recordId: SEAN_JAMES_RECORD_ID,
    protocol: 'coimbra',
    indication: 'Enrolled · high-dose D3 pathway',
    safetyZone: 'review',
    responseZone: 'review',
    profileScope: 'tiptraq-demographics',
    demographics: {
      dateOfBirth: SEAN_JAMES_DATE_OF_BIRTH,
      city: 'Auckland',
      country: 'New Zealand',
      fitzpatrickType: 2,
    },
    doseWindowPct: null,
    mobileLight: cell('Pending', 'amber', { hint: 'No phone panel ingested' }),
    bloodPanel: cell('Pending', 'amber', { hint: 'No City Labs panel on file' }),
    tiptraqBlock: cell(`${nights.length} nights`, sleepEfficiencyStatus(meanEfficiency), {
      hint: 'TipTraQ block complete · sleep readout live',
    }),
    lastCityLabsDraw: null,
    lastTipTraqBlock: '2026-05-28',
    nextPanelDue: null,
    demoAudience: 'both',
    sleepEfficiency: cell(`${meanEfficiency}%`, sleepEfficiencyStatus(meanEfficiency), {
      hint: `${nights.length} TipTraQ nights on file`,
    }),
    remLatency: cell(`${meanRemLatency} min`, remLatencyStatus(meanRemLatency), {
      hint: 'Sleep onset to first REM',
    }),
    tiptraqSleepOnset: cell(metrics.meanSleepOnset, 'amber', {
      hint: `Wake ${metrics.meanWake} · DLMO proxy ${metrics.dlmoEstimate}`,
    }),
    tiptraqTotalSleep: cell(metrics.meanTstLabel, meanEfficiency >= 85 ? 'green' : 'amber', {
      hint: `AHI ${metrics.meanAhi} · mild band`,
    }),
    pth: cell('Pending', 'amber', { hint: 'Awaiting first blood panel' }),
    d3Timing: cell('Pending', 'amber', { hint: 'Needs phone and blood inputs' }),
    clinicalRead:
      'Only demographics and three TipTraQ nights are on file. Sleep onset sits late against the DLMO proxy — dose window stays pending until phone and City Labs panels land.',
    action: 'Review — order blood panel',
    safetySummary: 'No blood panel ingested. Safety gate opens after first City Labs draw.',
    labHistory: [],
  }
}
