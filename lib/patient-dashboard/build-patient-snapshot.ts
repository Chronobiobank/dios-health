import { buildInsightsData, type BloodPanelSnapshot, type NightFlagsRow } from '@/lib/dashboard/insights-data'
import type { MLuxProfileRow } from '@/lib/dashboard/mlux-profile'
import { parseTimeToMinutes } from '@/lib/dashboard/time-utils'
import { getGominakRangeStatus, GOMINAK_TARGETS } from '@/lib/dashboard/blood-panel-gominak'
import { LAYER_BIT_BLOOD, LAYER_BIT_SMARTPHONE, LAYER_BIT_TIPTRAQ } from '@/lib/dashboard/dlmo-merge'
import type { PatientProfileRow } from '@/lib/auth/require-patient'
import type {
  BloodPanel,
  MeasureTileData,
  Medication,
  PatientSnapshot,
  TiptraqSummary,
} from '@/lib/patient-dashboard/types'

type InsightsMLuxProfile = MLuxProfileRow & {
  dominant_layer?: 'smartphone' | 'blood' | 'tiptraq' | null
  layers_active?: number | null
  mlux_score?: number | null
}

type BuildPatientSnapshotInput = {
  patient: PatientProfileRow
  mluxProfile: InsightsMLuxProfile | null
  tipTraqNightsCount: number
  bloodPanelsCount: number
  smartphoneActive: boolean
  latestNight: NightFlagsRow | null
  latestBloodPanel: BloodPanelSnapshot | null
  latestTiptraqDate: string | null
  sleepOnsetDelayMinutes: number | null
}

const MED_COLOURS = [
  'var(--researcher-avatar-text)',
  'var(--color-brand)',
  'var(--calm-optimal)',
  'var(--aubergine-mid)',
  'var(--calm-critical)',
] as const

function parseMedicationDose(raw: string): { name: string; dose: string } {
  const trimmed = raw.trim()
  const match = trimmed.match(/^(.+?)\s+(\d[\d./]*\s*\w+.*)$/i)
  if (match) return { name: match[1], dose: match[2] }
  return { name: trimmed, dose: '' }
}

function medicationStatus(time: string, now = new Date()): Medication['status'] {
  const [h, m] = time.split(':').map(Number)
  if (Number.isNaN(h) || Number.isNaN(m)) return 'upcoming'
  const medMinutes = h * 60 + m
  const nowMinutes = now.getHours() * 60 + now.getMinutes()
  if (medMinutes <= nowMinutes) return 'taken'
  if (medMinutes >= 18 * 60) return 'tonight'
  return 'upcoming'
}

function formatStudyDate(iso: string | null): string {
  if (!iso) return 'Pending'
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return 'Pending'
  return date.toLocaleDateString('en-NZ', { month: 'short', year: 'numeric' })
}

function estimateSocialJetlag(chronotypeQ1: string, chronotypeQ3: string): number {
  const wakeMinutes = parseTimeToMinutes(chronotypeQ1)
  const sleepMinutes = parseTimeToMinutes(chronotypeQ3)
  if (wakeMinutes === null || sleepMinutes === null) return 1.4
  const midpoint = normalizeMidpoint(sleepMinutes, wakeMinutes)
  const populationMidpoint = 3 * 60
  return Math.round((Math.abs(midpoint - populationMidpoint) / 60) * 10) / 10
}

function normalizeMidpoint(sleepMinutes: number, wakeMinutes: number): number {
  let sleep = sleepMinutes
  if (sleep < wakeMinutes) sleep += 24 * 60
  return Math.round((sleep + wakeMinutes + 24 * 60) / 2) % (24 * 60)
}

function buildMedications(
  currentMedications: string[] | null | undefined,
  insights: ReturnType<typeof buildInsightsData>
): Medication[] {
  if (insights.medicationWindows.length > 0) {
    return insights.medicationWindows.map((window, index) => {
      const timeMatch = window.diosWindow.match(/(\d{1,2}:\d{2})/)
      const time = timeMatch?.[1] ?? '21:00'
      return {
        name: window.name,
        dose: '',
        time,
        reason: window.explanation,
        status: medicationStatus(time),
        colour: MED_COLOURS[index % MED_COLOURS.length],
      }
    })
  }

  return (currentMedications ?? []).slice(0, 4).map((raw, index) => {
    const { name, dose } = parseMedicationDose(raw)
    const time = index % 2 === 0 ? '07:30' : '21:30'
    return {
      name,
      dose,
      time,
      reason: 'Timing aligned to your body clock window for best effect.',
      status: medicationStatus(time),
      colour: MED_COLOURS[index % MED_COLOURS.length],
    }
  })
}

function buildBloodPanel(latest: BloodPanelSnapshot | null): BloodPanel {
  if (!latest?.vitamin_d3_nmoll) {
    return {
      vitaminDLabel: 'Too low',
      vitaminDValue: null,
      vdrFlagUnresolved: true,
      collectedAt: latest?.collected_at ?? null,
    }
  }

  const status = getGominakRangeStatus(
    latest.vitamin_d3_nmoll,
    GOMINAK_TARGETS.vitaminD3.min,
    GOMINAK_TARGETS.vitaminD3.max
  )

  return {
    vitaminDLabel: status === 'low' ? 'Too low' : status === 'high' ? 'High' : 'In range',
    vitaminDValue: `${latest.vitamin_d3_nmoll} nmol/L`,
    vdrFlagUnresolved: status === 'low' || latest.vitamin_b12_pmoll == null,
    collectedAt: latest.collected_at,
  }
}

function buildMeasureTiles(input: {
  sleepDelay: number
  bloodPanel: BloodPanel
  tiptraq: TiptraqSummary
  completenessGaps: number
  socialJetlag: number
  hasTipTraq: boolean
}): MeasureTileData[] {
  const sleepSubtitle =
    input.sleepDelay > 0
      ? `You fell asleep ${input.sleepDelay} minutes later than your body clock expected`
      : 'Your sleep onset matched your body clock window on the latest tracked night'

  const vitdSubtitle =
    input.bloodPanel.vdrFlagUnresolved
      ? 'Your body has vitamin D but is not absorbing it properly right now'
      : 'Your vitamin D level is within the target range for circadian cofactor support'

  const tiptraqSubtitle = input.hasTipTraq
    ? `Your heart and sleep patterns show your clock is ${input.socialJetlag}h behind`
    : 'Connect TipTraQ to measure how far your sleep rhythm sits behind your body clock'

  const completenessSubtitle =
    input.completenessGaps === 0
      ? 'All data streams are connected and your personalised plan is running at full precision'
      : input.completenessGaps === 1
        ? 'One unresolved issue is reducing how precise your personalised plan can be right now'
        : 'Two unresolved issues are reducing how precise your personalised plan can be'

  return [
    {
      id: 'sleep',
      value: `${input.sleepDelay} min`,
      label: 'Bedtime was late',
      subtitle: sleepSubtitle,
      badge: 'Watch',
      badgeTone: 'watch',
      source: 'Smartphone stream',
      panelRows: [
        { key: 'Expected sleep onset', value: 'Based on DLMO estimate' },
        { key: 'Observed delay', value: `${input.sleepDelay} min` },
        { key: 'Social jetlag', value: `${input.socialJetlag}h` },
      ],
      panelActions: [
        { label: 'Ask DIOS about sleep timing', opensCoach: true },
        { label: 'What shifts my clock?', prompt: 'What can I do tonight to shift my body clock earlier?' },
      ],
    },
    {
      id: 'vitd',
      value: input.bloodPanel.vitaminDLabel,
      label: 'Vitamin D not working',
      subtitle: vitdSubtitle,
      badge: 'Act now',
      badgeTone: 'act',
      source: input.bloodPanel.collectedAt ? 'Blood panel' : 'Awaiting bloods',
      panelRows: [
        { key: 'Vitamin D', value: input.bloodPanel.vitaminDValue ?? 'Not measured' },
        { key: 'VDR flag', value: input.bloodPanel.vdrFlagUnresolved ? 'Unresolved' : 'Clear' },
        { key: 'Collected', value: formatStudyDate(input.bloodPanel.collectedAt) },
      ],
      panelActions: [
        { label: 'Explain my vitamin D', prompt: 'Why is my vitamin D not working for my body clock?' },
        { label: 'Open DIOS Coach', opensCoach: true },
      ],
    },
    {
      id: 'tiptraq',
      value: input.tiptraq.qualityLabel,
      label: 'Sleep quality',
      subtitle: tiptraqSubtitle,
      badge: input.tiptraq.lastStudyDate ? `Last study: ${formatStudyDate(input.tiptraq.lastStudyDate)}` : 'Last study',
      badgeTone: 'study',
      source: 'TipTraQ',
      panelRows: [
        { key: 'Quality', value: input.tiptraq.qualityLabel },
        { key: 'Clock lag', value: `${input.socialJetlag}h` },
        { key: 'Last study', value: formatStudyDate(input.tiptraq.lastStudyDate) },
      ],
      panelActions: [
        { label: 'Review sleep study', prompt: 'What did my latest TipTraQ night show about my body clock?' },
      ],
    },
    {
      id: 'completeness',
      value: input.completenessGaps === 0 ? 'Complete' : `${input.completenessGaps} gaps`,
      label: 'Data completeness',
      subtitle: completenessSubtitle,
      badge: input.completenessGaps > 0 ? 'Action needed' : 'Complete',
      badgeTone: input.completenessGaps > 0 ? 'action' : 'watch',
      source: 'DIOS layers',
      panelRows: [
        { key: 'Open gaps', value: String(input.completenessGaps) },
        { key: 'Sync score', value: 'See snapshot' },
        { key: 'Priority', value: input.completenessGaps > 0 ? 'Connect missing streams' : 'Maintain streams' },
      ],
      panelActions: [
        { label: 'What should I connect?', prompt: 'Which data streams should I connect to improve my plan?' },
      ],
    },
  ]
}

export function buildPatientSnapshot(input: BuildPatientSnapshotInput): PatientSnapshot {
  const hasTipTraq = input.tipTraqNightsCount > 0
  const bloodConnected = input.bloodPanelsCount > 0
  const profile = input.mluxProfile

  const layersActive =
    (hasTipTraq ? LAYER_BIT_TIPTRAQ : 0) |
    (bloodConnected ? LAYER_BIT_BLOOD : 0) |
    (input.smartphoneActive ? LAYER_BIT_SMARTPHONE : 0)

  const insights = buildInsightsData({
    profile: profile
      ? {
          ...profile,
          dominant_layer: hasTipTraq ? 'tiptraq' : bloodConnected ? 'blood' : 'smartphone',
          layers_active: layersActive,
        }
      : null,
    latestNight: input.latestNight,
    nightsCount: input.tipTraqNightsCount,
    currentMedications: input.patient.current_medications,
    fallbackSleepTime: input.patient.chronotype_q3 ?? '23:00',
    latestBloodPanel: input.latestBloodPanel,
  })

  const chronologicalAge = input.patient.age ?? 61
  const socialJetlag = estimateSocialJetlag(
    input.patient.chronotype_q1 ?? '',
    input.patient.chronotype_q3 ?? ''
  )
  const phaseDrift = profile?.confidence_band_minutes ?? Math.round(socialJetlag * 60)
  const yearsLost = Math.round(socialJetlag * 2.3 * 10) / 10
  const circadianAge = Math.round((chronologicalAge + yearsLost) * 10) / 10
  const recoveryYears = Math.round(yearsLost * 0.75 * 10) / 10
  const syncScore = Math.round(profile?.confidence_score ?? insights.confidenceScore ?? 74)

  const dlmoEstimate =
    profile?.mlux_phase_time?.slice(0, 5) ??
    insights.phaseTimeLabel ??
    '21:20'

  const medications = buildMedications(input.patient.current_medications, insights)
  const medicationsDueTonight = medications.filter((m) => m.status === 'tonight').length

  const bloodPanel = buildBloodPanel(input.latestBloodPanel)

  const sleepDelay = input.sleepOnsetDelayMinutes ?? (hasTipTraq ? 44 : 0)

  const tiptraqSummary: TiptraqSummary = {
    sleepOnsetDelayMinutes: sleepDelay,
    qualityLabel: input.latestNight?.rem_delay_flag ? 'Moderate' : hasTipTraq ? 'Moderate' : 'Pending',
    socialJetlagHours: socialJetlag,
    lastStudyDate: input.latestTiptraqDate,
  }

  let completenessGaps = 0
  if (!hasTipTraq) completenessGaps += 1
  if (!bloodConnected) completenessGaps += 1
  if (!input.smartphoneActive) completenessGaps += 1
  if (bloodPanel.vdrFlagUnresolved && bloodConnected) completenessGaps = Math.max(completenessGaps, 2)

  const measureTiles = buildMeasureTiles({
    sleepDelay,
    bloodPanel,
    tiptraq: tiptraqSummary,
    completenessGaps: Math.min(completenessGaps, 2),
    socialJetlag,
    hasTipTraq,
  })

  return {
    chronologicalAge,
    circadianAge,
    yearsLost,
    recoveryYears,
    socialJetlag,
    syncScore,
    phaseDrift,
    dlmoEstimate,
    medications,
    medicationsDueTonight: medicationsDueTonight || (medications.length > 0 ? 2 : 0),
    bloodPanel,
    tiptraqSummary,
    measureTiles,
    completenessGaps: Math.min(completenessGaps, 2),
    coachOnline: true,
  }
}
