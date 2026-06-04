import {
  calculateNightMLux,
  calculateRollingMLux,
  type TipTraQNight,
} from '@/lib/mlux'
import { buildPatientCalibration } from '@/lib/patient-dashboard/calibration'
import { buildChronosomaticSpectrumNodes } from '@/lib/patient-dashboard/spectrum-nodes'
import type {
  BloodPanel,
  MeasureTileData,
  Medication,
  PatientSnapshot,
  TiptraqSummary,
} from '@/lib/patient-dashboard/types'
import { formatCompletenessValue, formatOpenGapsLabel } from '@/lib/patient-dashboard/tile-copy'

/** Append when a metric cannot be grounded in five TipTraQ nights or report fields. */
export const LOW_CONFIDENCE = '(low confidence)'

export type SeanJamesNightRecord = TipTraQNight & {
  report_date?: string
  day_type?: 'weekday' | 'weekend'
}

/**
 * Canonical Sean James TipTraQ night — validated in scripts/test-sean-james-dlmo.ts.
 * Add four more nights from uploaded PDFs to unlock full five-night aggregates.
 */
export const SEAN_JAMES_TIPTRAQ_NIGHTS: SeanJamesNightRecord[] = [
  {
    sleep_onset: '00:36',
    sleep_offset: '08:12',
    sleep_latency_minutes: 18,
    tst_minutes: 392,
    waso_minutes: 95,
    sleep_efficiency_pct: 86,
    rem_duration_minutes: 78,
    rem_pct_tst: 19.9,
    first_rem_onset: '02:57',
    ahi: 5.4,
    sns_pct: 72,
    pns_pct: 28,
    mean_pr: 62,
    min_pr: 48,
    min_spo2: 89,
    hypoxic_burden: 12.4,
    signal_quality_pct: 84,
  },
]

function clockToMinutes(clock: string): number {
  const [h, m] = clock.split(':').map(Number)
  return h * 60 + m
}

function minutesToClock(totalMinutes: number): string {
  const normalized = ((totalMinutes % 1440) + 1440) % 1440
  const h = Math.floor(normalized / 60)
  const m = normalized % 60
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`
}

function sleepMidpointMinutes(onset: string, offset: string): number {
  let sleep = clockToMinutes(onset)
  const wake = clockToMinutes(offset)
  if (sleep < wake) sleep += 1440
  return Math.round((sleep + wake + 1440) / 2) % 1440
}

function circularMeanMinutes(values: number[]): number {
  if (values.length === 0) return 0
  const radians = values.map((v) => (v / 1440) * 2 * Math.PI)
  const sinSum = radians.reduce((sum, r) => sum + Math.sin(r), 0)
  const cosSum = radians.reduce((sum, r) => sum + Math.cos(r), 0)
  const meanRad = Math.atan2(sinSum / values.length, cosSum / values.length)
  let minutes = Math.round((meanRad / (2 * Math.PI)) * 1440)
  if (minutes < 0) minutes += 1440
  return minutes
}

function onsetDelayMinutes(sleepOnset: string, targetOnset: string): number {
  let onset = clockToMinutes(sleepOnset)
  let target = clockToMinutes(targetOnset)
  if (onset < target) onset += 1440
  return onset - target
}

function standardDeviation(values: number[]): number {
  if (values.length < 2) return 0
  const mean = values.reduce((a, b) => a + b, 0) / values.length
  const variance = values.reduce((sum, v) => sum + (v - mean) ** 2, 0) / values.length
  return Math.sqrt(variance)
}

function formatHoursMinutes(totalMinutes: number): string {
  const h = Math.floor(totalMinutes / 60)
  const m = totalMinutes % 60
  if (h === 0) return `${m} min`
  if (m === 0) return `${h}h`
  return `${h}h ${m}m`
}

function withNightConfidence(label: string, nights: number, required = 5): string {
  if (nights >= required) return label
  return `${label} ${LOW_CONFIDENCE}`
}

export type SeanJamesSleepMetrics = {
  nightsLoaded: number
  meanSleepOnset: string
  meanWake: string
  meanTstMinutes: number
  meanTstLabel: string
  sleepTimingCentre: string
  meanRemPct: number
  meanLightPct: string
  meanDeepPct: string
  meanAhi: number
  meanHrv: string
  interdailyStability: string
  intradailyVariability: string
  chronotype: string
  socialJetlag: string
  targetSleepOnset: string
  clockDriftMinutes: number
  lightAlignment: number
  dlmoEstimate: string
  darkYearsHours: number
}

export function computeSeanJamesSleepMetrics(
  nights: SeanJamesNightRecord[] = SEAN_JAMES_TIPTRAQ_NIGHTS
): SeanJamesSleepMetrics {
  const n = nights.length
  const onsets = nights.map((night) => clockToMinutes(night.sleep_onset))
  const wakes = nights.map((night) => clockToMinutes(night.sleep_offset))
  const midpoints = nights.map((night) => sleepMidpointMinutes(night.sleep_onset, night.sleep_offset))

  const meanSleepOnset = minutesToClock(circularMeanMinutes(onsets))
  const meanWake = minutesToClock(circularMeanMinutes(wakes))
  const meanTstMinutes = Math.round(
    nights.reduce((sum, night) => sum + night.tst_minutes, 0) / Math.max(n, 1)
  )
  const sleepTimingCentre = minutesToClock(circularMeanMinutes(midpoints))

  const mluxNights = nights.map((night) => calculateNightMLux(night))
  const rolling = calculateRollingMLux(mluxNights)
  const targetSleepOnset = rolling.proxy_dlmo_time
  const clockDriftMinutes = Math.round(onsetDelayMinutes(meanSleepOnset, targetSleepOnset))

  const onsetSd = standardDeviation(onsets)
  const consistencyScore =
    n >= 2 ? Math.max(0, Math.min(100, Math.round(100 - onsetSd * 1.4))) : mluxNights[0]?.confidence_score ?? 0
  const lightAlignment = n >= 5 ? consistencyScore : mluxNights[0]?.confidence_score ?? consistencyScore

  const populationMidpoint = 3 * 60
  const meanMid = circularMeanMinutes(midpoints)
  const darkYearsHours = Math.round((Math.abs(meanMid - populationMidpoint) / 60) * 10) / 10

  const meanRemPct =
    Math.round((nights.reduce((sum, night) => sum + night.rem_pct_tst, 0) / Math.max(n, 1)) * 10) / 10
  const meanNremPct = Math.round((100 - meanRemPct) * 10) / 10

  const weekdayMidpoints = nights
    .filter((night) => night.day_type === 'weekday')
    .map((night) => sleepMidpointMinutes(night.sleep_onset, night.sleep_offset))
  const weekendMidpoints = nights
    .filter((night) => night.day_type === 'weekend')
    .map((night) => sleepMidpointMinutes(night.sleep_onset, night.sleep_offset))

  let socialJetlag = `— ${LOW_CONFIDENCE}`
  if (weekdayMidpoints.length > 0 && weekendMidpoints.length > 0) {
    const weekdayMean = circularMeanMinutes(weekdayMidpoints)
    const weekendMean = circularMeanMinutes(weekendMidpoints)
    let diff = weekendMean - weekdayMean
    if (diff > 720) diff -= 1440
    if (diff < -720) diff += 1440
    socialJetlag = formatHoursMinutes(Math.abs(Math.round(diff)))
  } else if (n < 5) {
    socialJetlag = `— ${LOW_CONFIDENCE} — need weekday/weekend labels on five nights`
  }

  return {
    nightsLoaded: n,
    meanSleepOnset,
    meanWake,
    meanTstMinutes,
    meanTstLabel: formatHoursMinutes(meanTstMinutes),
    sleepTimingCentre,
    meanRemPct,
    meanLightPct: `${meanNremPct}% NREM ${LOW_CONFIDENCE} — deep vs light split not in summary report`,
    meanDeepPct: `— ${LOW_CONFIDENCE} — not in TipTraQ summary report`,
    meanAhi: Math.round((nights.reduce((sum, night) => sum + night.ahi, 0) / Math.max(n, 1)) * 10) / 10,
    meanHrv: `— ${LOW_CONFIDENCE} — nocturnal HRV not in summary report (SNS/PNS only)`,
    interdailyStability: `— ${LOW_CONFIDENCE} — not reported in TipTraQ PDF`,
    intradailyVariability: `— ${LOW_CONFIDENCE} — not reported in TipTraQ PDF`,
    chronotype: withNightConfidence(rolling.chronotype, n),
    socialJetlag,
    targetSleepOnset,
    clockDriftMinutes,
    lightAlignment,
    dlmoEstimate: rolling.proxy_dlmo_time,
    darkYearsHours,
  }
}

const SEAN_MEDICATIONS: Medication[] = [
  {
    name: 'Metformin',
    dose: '500 mg',
    time: '21:30',
    reason: 'Evening dose aligned to your DLMO window for better glycaemic control.',
    status: 'tonight',
    colour: 'var(--researcher-avatar-text)',
  },
  {
    name: 'Atorvastatin',
    dose: '20 mg',
    time: '21:45',
    reason: 'Night timing matches cholesterol synthesis rhythm in your chronotype.',
    status: 'tonight',
    colour: 'var(--color-brand)',
  },
]

export function buildSeanJamesSnapshot(): PatientSnapshot {
  const metrics = computeSeanJamesSleepMetrics()
  const latestNight = SEAN_JAMES_TIPTRAQ_NIGHTS[SEAN_JAMES_TIPTRAQ_NIGHTS.length - 1]
  const latestMlux = calculateNightMLux(latestNight)

  const chronologicalAge = 61
  const darkYears = Math.round(metrics.darkYearsHours * 2.3 * 10) / 10
  const chronosomaticAge = Math.round((chronologicalAge + darkYears) * 10) / 10
  const recoveryYears = Math.round(darkYears * 0.75 * 10) / 10

  const bloodPanel: BloodPanel = {
    vitaminDLabel: `Not measured ${LOW_CONFIDENCE}`,
    vitaminDValue: null,
    vdrFlagUnresolved: true,
    collectedAt: null,
  }

  const tiptraqSummary: TiptraqSummary = {
    sleepOnsetDelayMinutes: metrics.clockDriftMinutes,
    qualityLabel: latestMlux.rem_delay_flag ? 'Moderate' : 'Good',
    darkYearsHours: metrics.darkYearsHours,
    lastStudyDate: null,
  }

  const darkYearsWeek = Math.round(metrics.darkYearsHours * 1.43 * 10) / 10

  const measureTiles: MeasureTileData[] = [
    {
      id: 'sleep',
      value: withNightConfidence(`${metrics.clockDriftMinutes} min`, metrics.nightsLoaded),
      label: 'Clock slipped last night',
      subtitle: `You fell asleep ${metrics.meanSleepOnset} on average — ${metrics.clockDriftMinutes} minutes after your body-clock target (${metrics.targetSleepOnset}).`,
      badge: 'Adding Dark Years',
      badgeTone: 'watch',
      source: 'TipTraQ',
      panelRows: [
        {
          key: 'When you fell asleep',
          value: withNightConfidence(metrics.meanSleepOnset, metrics.nightsLoaded),
        },
        {
          key: 'When you woke up',
          value: withNightConfidence(metrics.meanWake, metrics.nightsLoaded),
        },
        { key: 'Your body clock target', value: metrics.targetSleepOnset },
        { key: 'How far your clock slipped', value: `${metrics.clockDriftMinutes} min` },
        {
          key: 'Dark Years added this week',
          value: withNightConfidence(`+${darkYearsWeek} years`, metrics.nightsLoaded),
        },
      ],
      panelActions: [
        {
          label: 'How to recover ↗',
          prompt: 'How can I reduce my Dark Years and recover my clock tonight?',
        },
      ],
    },
    {
      id: 'vitd',
      value: bloodPanel.vitaminDLabel,
      label: 'Vitamin D not working',
      subtitle: `No Layer 2 blood panel yet — vitamin D and VDR status are ${LOW_CONFIDENCE} until your GP bloods are linked.`,
      badge: 'Act now',
      badgeTone: 'act',
      source: `Awaiting bloods ${LOW_CONFIDENCE}`,
      panelRows: [
        { key: 'Vitamin D', value: 'Not measured' },
        { key: 'VDR flag', value: `Unresolved ${LOW_CONFIDENCE}` },
        { key: 'Dark Years contribution', value: `— ${LOW_CONFIDENCE} — needs L2 panel` },
      ],
      panelActions: [
        {
          label: 'Explain my vitamin D',
          prompt: 'Why is my vitamin D adding Dark Years to my Chronosomatic Age?',
        },
        {
          label: 'Show this to your GP — could recover 1.1 Dark Years in 90 days',
          prompt: 'What should I ask my GP about vitamin D and iron to reduce my Dark Years?',
        },
      ],
    },
    {
      id: 'tiptraq',
      value: tiptraqSummary.qualityLabel,
      label: 'Sleep quality',
      subtitle: `TipTraQ recorded ${metrics.nightsLoaded} night${metrics.nightsLoaded === 1 ? '' : 's'} in DIOS — mean sleep ${metrics.meanTstLabel}, REM ${metrics.meanRemPct}%, AHI ${metrics.meanAhi}.`,
      badge: `TipTraQ · ${metrics.nightsLoaded}/5 nights`,
      badgeTone: 'study',
      source: 'TipTraQ',
      panelRows: [
        { key: 'Quality', value: tiptraqSummary.qualityLabel },
        { key: 'Clock drift this week', value: `${metrics.darkYearsHours}h` },
        {
          key: 'Last study',
          value: `${metrics.nightsLoaded}/5 TipTraQ nights · SCt ${withNightConfidence(metrics.sleepTimingCentre, metrics.nightsLoaded)}`,
        },
      ],
      panelActions: [
        {
          label: 'Review sleep study',
          prompt: 'What did my latest TipTraQ night show about my Dark Years?',
        },
      ],
    },
    {
      id: 'completeness',
      value: formatCompletenessValue(2),
      label: 'Data completeness',
      subtitle:
        'Two gaps are reducing the precision of your Dark Years calculation and your medication timing plan.',
      badge: 'Action needed',
      badgeTone: 'action',
      source: 'DIOS layers',
      panelRows: [
        { key: formatOpenGapsLabel(2), value: '2' },
        {
          key: 'Light alignment',
          value: withNightConfidence(String(metrics.lightAlignment), metrics.nightsLoaded),
        },
        {
          key: 'Gap 1 — blood panel (L2)',
          value: `Upload Gominak blood panel — Chronosomatic Age is estimated ${LOW_CONFIDENCE} without it`,
        },
        {
          key: 'Gap 2 — iron',
          value: `${metrics.nightsLoaded}/5 TipTraQ nights · HRV ${metrics.meanHrv}`,
        },
      ],
      panelActions: [{ label: 'Fix both gaps ↗', prompt: 'Which gaps should I fix first to reduce my Dark Years?' }],
    },
  ]

  const calibration = buildPatientCalibration({
    patient: {
      id: 'sean-james-demo',
      first_name: 'Sean',
      family_name: 'James',
      age: chronologicalAge,
      biological_sex: null,
      fitzpatrick_type: 3,
      location_city: 'Wellington',
      location_country: 'New Zealand',
      shift_worker: false,
      shift_pattern: null,
      chronotype_q1: '08:12',
      chronotype_q2: 'evening',
      chronotype_q3: '00:36',
      current_supplements: null,
      current_medications: SEAN_MEDICATIONS.map((m) => `${m.name} ${m.dose}`.trim()),
      wearable_connected: null,
      data_share_gp: true,
      data_share_research: false,
      data_share_policy: true,
      onboarding_complete: true,
    },
    tipTraqNightsCount: metrics.nightsLoaded,
    latestTiptraqDate: null,
    mluxChronotype: 'Evening type',
  })

  const spectrumNodes = buildChronosomaticSpectrumNodes({
    clockDrift: metrics.clockDriftMinutes,
    darkYearsHours: metrics.darkYearsHours,
    lightAlignment: metrics.lightAlignment,
    bloodPanel,
    latestNight: {
      non_dipper_flag: latestMlux.non_dipper_flag,
      high_sympathetic_flag: latestMlux.high_sympathetic_flag,
      rem_delay_flag: latestMlux.rem_delay_flag,
      apnea_confound_flag: latestMlux.apnea_confound_flag,
    },
    hasTipTraq: true,
    currentMedications: SEAN_MEDICATIONS.map((m) => `${m.name} ${m.dose}`.trim()),
    chronotypeEvening: true,
  })

  return {
    chronologicalAge,
    chronosomaticAge,
    darkYears,
    recoveryYears,
    darkYearsHours: metrics.darkYearsHours,
    lightAlignment: metrics.lightAlignment,
    clockDrift: metrics.clockDriftMinutes,
    dlmoEstimate: metrics.dlmoEstimate,
    medications: SEAN_MEDICATIONS,
    medicationsDueTonight: 2,
    bloodPanel,
    tiptraqSummary,
    measureTiles,
    completenessGaps: 2,
    coachOnline: true,
    spectrumNodes,
    ...calibration,
  }
}
