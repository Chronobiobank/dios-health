import type { MLuxProfileRow } from '@/lib/dashboard/mlux-profile'
import { LAYER_BIT_BLOOD, LAYER_BIT_SMARTPHONE, LAYER_BIT_TIPTRAQ } from '@/lib/dashboard/dlmo-merge'
import { normalizeMinutesFromMidnight } from '@/lib/mlux'
import { GOMINAK_TARGETS, getGominakRangeStatus } from '@/lib/dashboard/blood-panel-gominak'
import {
  formatMinutesLabel,
  parseDbTimeToMinutes,
  parseTimeToMinutes,
} from '@/lib/dashboard/time-utils'

export type RiskSeverity = 'watch' | 'moderate' | 'act'

export type DominantLayer = 'smartphone' | 'blood' | 'tiptraq' | null

export type InsightsMLuxProfile = MLuxProfileRow & {
  dominant_layer: DominantLayer
  layers_active: number | null
}

export type CircadianRiskFlag = {
  id: string
  title: string
  summary: string
  severity: RiskSeverity
}

export type MedicationWindowCard = {
  id: string
  name: string
  standardGuidance: string
  diosWindow: string
  explanation: string
  estimated: boolean
  showCaveat: boolean
}

export type ZeitgeberCard = {
  id: 'light' | 'food' | 'movement' | 'darkness'
  title: string
  timeLabel: string
  instruction: string
}

export type PatientProtocolRow = {
  id: string
  protocol_type: string
  status: string
  review_at: string | null
  target_d3_nmoll: number | null
  current_d3_nmoll: number | null
  d3_dose_iu: number | null
  cofactors: Record<string, unknown> | null
  b_vitamin_targets: Record<string, unknown> | null
  requires_supervision: boolean
}

export type BloodPanelSnapshot = {
  vitamin_d3_nmoll: number | null
  vitamin_b12_pmoll: number | null
  ferritin_ugl: number | null
  vitamin_b5_umoll: number | null
  collected_at: string | null
}

export type LayerPill = {
  id: 'phone' | 'bloods' | 'tiptraq'
  label: string
  active: boolean
}

export type InsightsData = {
  hasMLuxProfile: boolean
  hasTipTraqData: boolean
  phaseTimeLabel: string | null
  dominantLayer: DominantLayer
  dominantLayerLabel: string | null
  confidenceScore: number | null
  confidenceLabel: string | null
  layerPills: LayerPill[]
  riskFlags: CircadianRiskFlag[]
  showRiskSection: boolean
  medicationWindows: MedicationWindowCard[]
  hasMedicationSelection: boolean
  hasDlmoTiming: boolean
  zeitgebers: ZeitgeberCard[]
  activeProtocols: PatientProtocolRow[]
  latestBloodPanel: BloodPanelSnapshot | null
  protocolIdleMessage: string | null
  canShareReport: boolean
}

type NightFlagsRow = {
  non_dipper_flag: boolean | null
  high_sympathetic_flag: boolean | null
  rem_delay_flag: boolean | null
  apnea_confound_flag: boolean | null
}

const SEVERITY_LABEL: Record<RiskSeverity, string> = {
  watch: 'Watch',
  moderate: 'Moderate',
  act: 'Act',
}

export function riskSeverityLabel(severity: RiskSeverity): string {
  return SEVERITY_LABEL[severity]
}

const DOMINANT_LAYER_LABEL: Record<Exclude<DominantLayer, null>, string> = {
  smartphone: 'Smartphone estimate',
  blood: 'Blood confirmed',
  tiptraq: 'TipTraQ precision',
}

type MedicationDefinition = {
  id: string
  name: string
  standardGuidance: string
  explanation: string
  profileTimeKey?: keyof Pick<
    MLuxProfileRow,
    'simvastatin_optimal_time' | 'ramipril_optimal_time' | 'prednisolone_optimal_time' | 'salmeterol_optimal_time'
  >
  estimatedOffsetMinutes?: number
}

const MEDICATION_DEFINITIONS: MedicationDefinition[] = [
  {
    id: 'atorvastatin',
    name: 'Atorvastatin',
    standardGuidance: 'Standard: take at night',
    explanation: 'Cholesterol synthesis peaks overnight — timing to your body clock improves statin efficacy.',
    profileTimeKey: 'simvastatin_optimal_time',
  },
  {
    id: 'simvastatin',
    name: 'Simvastatin',
    standardGuidance: 'Standard: take at night',
    explanation: 'Evening dosing aligns with your liver’s cholesterol production rhythm.',
    profileTimeKey: 'simvastatin_optimal_time',
  },
  {
    id: 'ramipril',
    name: 'Ramipril',
    standardGuidance: 'Standard: take in the morning',
    explanation: 'Blood pressure dipping overnight matters — your window matches when your cardiovascular rhythm is ready.',
    profileTimeKey: 'ramipril_optimal_time',
  },
  {
    id: 'amlodipine',
    name: 'Amlodipine',
    standardGuidance: 'Standard: take in the morning',
    explanation: 'Calcium channel blockers work best when aligned with your blood pressure body-clock dip.',
    estimatedOffsetMinutes: 60,
  },
  {
    id: 'sertraline',
    name: 'Sertraline',
    standardGuidance: 'Standard: take in the morning',
    explanation: 'SSRI timing to your cortisol peak can reduce side effects and improve mood stability.',
    estimatedOffsetMinutes: 660,
  },
  {
    id: 'metformin',
    name: 'Metformin',
    standardGuidance: 'Standard: take with meals',
    explanation: 'Meal-aligned dosing supports glucose control when your metabolic clock is primed.',
    estimatedOffsetMinutes: 660,
  },
  {
    id: 'prednisolone',
    name: 'Prednisolone',
    standardGuidance: 'Standard: take in the morning',
    explanation: 'Cortisol peaks before waking — prednisolone lands best just ahead of your inflammatory surge.',
    profileTimeKey: 'prednisolone_optimal_time',
  },
  {
    id: 'salmeterol',
    name: 'Salmeterol',
    standardGuidance: 'Standard: take morning and evening',
    explanation: 'Evening dosing can cover the pre-dawn bronchospasm window tied to your body clock.',
    profileTimeKey: 'salmeterol_optimal_time',
  },
  {
    id: 'levothyroxine',
    name: 'Levothyroxine',
    standardGuidance: 'Standard: take on waking, empty stomach',
    explanation: 'Thyroid hormone absorbs best in your early waking window before food interferes.',
    estimatedOffsetMinutes: 600,
  },
]

function normalizeMedicationToken(value: string): string {
  return value.trim().toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '')
}

function resolvePhaseMinutes(profile: InsightsMLuxProfile | null, fallbackSleepTime: string): number {
  const fromRolling = parseDbTimeToMinutes(profile?.mlux_phase_time ?? null)
  if (fromRolling !== null) return fromRolling

  if (profile?.mlux_phase_minutes != null) {
    return normalizeMinutesFromMidnight(profile.mlux_phase_minutes)
  }

  const sleepMinutes = parseTimeToMinutes(fallbackSleepTime) ?? 23 * 60
  return normalizeMinutesFromMidnight(sleepMinutes - 120)
}

function formatClock(minutes: number): string {
  return formatMinutesLabel(normalizeMinutesFromMidnight(minutes))
}

function hasUsableMLux(profile: InsightsMLuxProfile | null): boolean {
  if (!profile) return false
  return (
    profile.mlux_phase_time != null ||
    profile.mlux_phase_minutes != null ||
    (profile.layers_active ?? 0) > 0
  )
}

function buildLayerPills(layersActive: number | null | undefined): LayerPill[] {
  const mask = layersActive ?? 0
  return [
    { id: 'phone', label: 'Phone', active: (mask & LAYER_BIT_SMARTPHONE) !== 0 },
    { id: 'bloods', label: 'Bloods', active: (mask & LAYER_BIT_BLOOD) !== 0 },
    { id: 'tiptraq', label: 'TipTraQ', active: (mask & LAYER_BIT_TIPTRAQ) !== 0 },
  ]
}

export function riskFlagsFromLatestNight(night: NightFlagsRow | null): CircadianRiskFlag[] {
  if (!night) return []

  const flags: CircadianRiskFlag[] = []

  if (night.non_dipper_flag) {
    flags.push({
      id: 'non_dipper',
      title: 'Non-dipper pattern detected',
      summary:
        'Your blood pressure may not be dropping overnight as expected. Discuss with your GP.',
      severity: 'watch',
    })
  }

  if (night.high_sympathetic_flag) {
    flags.push({
      id: 'high_sympathetic',
      title: 'High sympathetic activity',
      summary:
        'Your nervous system stayed in alert mode during sleep. This suppresses melatonin and fragments your body clock.',
      severity: 'moderate',
    })
  }

  if (night.rem_delay_flag) {
    flags.push({
      id: 'rem_delay',
      title: 'REM sleep delayed',
      summary:
        'Your REM sleep started late. This is a strong signal of circadian misalignment.',
      severity: 'moderate',
    })
  }

  if (night.apnea_confound_flag) {
    flags.push({
      id: 'apnea_confound',
      title: 'Sleep apnea affecting readings',
      summary:
        'Apnea events are adding noise to your body clock signal. Consider discussing treatment with your GP.',
      severity: 'watch',
    })
  }

  return flags
}

function resolveMedicationTime(
  definition: MedicationDefinition,
  profile: InsightsMLuxProfile | null,
  phaseMinutes: number,
  estimated: boolean
): { window: string; isEstimated: boolean } {
  if (definition.profileTimeKey && profile) {
    const fromProfile = profile[definition.profileTimeKey]
    if (fromProfile) {
      return { window: formatDbTimeLabel(fromProfile), isEstimated: estimated && !profile.mlux_phase_time }
    }
  }

  const offset = definition.estimatedOffsetMinutes ?? 180
  return {
    window: formatClock(phaseMinutes + offset),
    isEstimated: true,
  }
}

function formatDbTimeLabel(time: string): string {
  const minutes = parseDbTimeToMinutes(time)
  if (minutes === null) return time.slice(0, 5)
  return formatClock(minutes)
}

function buildMedicationWindows(
  currentMedications: string[] | null | undefined,
  profile: InsightsMLuxProfile | null,
  phaseMinutes: number,
  hasDlmoTiming: boolean,
  confidenceScore: number | null
): MedicationWindowCard[] {
  const selected = (currentMedications ?? [])
    .map(normalizeMedicationToken)
    .filter(Boolean)

  if (selected.length === 0) return []

  const showCaveat = (confidenceScore ?? 0) < 60

  return MEDICATION_DEFINITIONS.filter((definition) => selected.includes(definition.id)).map(
    (definition) => {
      const { window, isEstimated } = resolveMedicationTime(
        definition,
        profile,
        phaseMinutes,
        !hasDlmoTiming
      )

      return {
        id: definition.id,
        name: definition.name,
        standardGuidance: definition.standardGuidance,
        diosWindow: `Your window: ${window}${isEstimated ? ' · ESTIMATED' : ''}`,
        explanation: definition.explanation,
        estimated: isEstimated,
        showCaveat,
      }
    }
  )
}

function buildZeitgebers(phaseMinutes: number): ZeitgeberCard[] {
  const lightMinutes = normalizeMinutesFromMidnight(phaseMinutes - 600)
  const foodMinutes = normalizeMinutesFromMidnight(phaseMinutes - 540)
  const movementMinutes = normalizeMinutesFromMidnight(phaseMinutes - 420)
  const darknessMinutes = normalizeMinutesFromMidnight(phaseMinutes - 90)

  return [
    {
      id: 'light',
      title: 'Morning light',
      timeLabel: formatClock(lightMinutes),
      instruction: `Get outside before ${formatClock(lightMinutes)}. Natural light sets your body clock for the day.`,
    },
    {
      id: 'food',
      title: 'First meal',
      timeLabel: formatClock(foodMinutes),
      instruction: `Eat your first meal around ${formatClock(foodMinutes)}. Meal timing anchors your metabolic clock.`,
    },
    {
      id: 'movement',
      title: 'Movement',
      timeLabel: formatClock(movementMinutes),
      instruction: `Move your body around ${formatClock(movementMinutes)}. Exercise is a powerful zeitgeber.`,
    },
    {
      id: 'darkness',
      title: 'Light curfew',
      timeLabel: formatClock(darknessMinutes),
      instruction: `Dim screens and lights by ${formatClock(darknessMinutes)}. Blue light delays your melatonin onset.`,
    },
  ]
}

function buildProtocolIdleMessage(blood: BloodPanelSnapshot | null): string {
  if (!blood?.vitamin_d3_nmoll) {
    return 'No correction protocol active. Add blood panel results on the Streams page to see whether vitamin D optimisation could help.'
  }

  const d3Status = getGominakRangeStatus(
    blood.vitamin_d3_nmoll,
    GOMINAK_TARGETS.vitaminD3.min,
    GOMINAK_TARGETS.vitaminD3.max
  )

  if (d3Status === 'low') {
    return `No correction protocol active. Your body clock reading suggests vitamin D is below the Gominak target (${blood.vitamin_d3_nmoll} nmol/L).`
  }

  if (d3Status === 'high') {
    return `No correction protocol active. Your vitamin D (${blood.vitamin_d3_nmoll} nmol/L) is above target — discuss maintenance dosing with your GP.`
  }

  return `No correction protocol active. Your vitamin D (${blood.vitamin_d3_nmoll} nmol/L) is in range — focus on zeitgeber timing and medication windows.`
}

export function buildInsightsData(input: {
  profile: InsightsMLuxProfile | null
  latestNight: NightFlagsRow | null
  nightsCount: number
  currentMedications?: string[] | null
  fallbackSleepTime: string
  activeProtocols?: PatientProtocolRow[]
  latestBloodPanel?: BloodPanelSnapshot | null
}): InsightsData {
  const hasTipTraqData = input.nightsCount > 0
  const hasMLuxProfile = hasUsableMLux(input.profile)
  const hasDlmoTiming = Boolean(
    input.profile?.mlux_phase_time ?? input.profile?.mlux_phase_minutes
  )
  const phaseMinutes = resolvePhaseMinutes(input.profile, input.fallbackSleepTime)
  const phaseTimeLabel = hasMLuxProfile ? formatClock(phaseMinutes) : null

  const dominantLayer = input.profile?.dominant_layer ?? null
  const dominantLayerLabel = dominantLayer ? DOMINANT_LAYER_LABEL[dominantLayer] : null

  const medicationWindows = buildMedicationWindows(
    input.currentMedications,
    input.profile,
    phaseMinutes,
    hasDlmoTiming,
    input.profile?.confidence_score ?? null
  )

  return {
    hasMLuxProfile,
    hasTipTraqData,
    phaseTimeLabel,
    dominantLayer,
    dominantLayerLabel,
    confidenceScore: input.profile?.confidence_score ?? null,
    confidenceLabel: input.profile?.confidence_label ?? null,
    layerPills: buildLayerPills(input.profile?.layers_active),
    riskFlags: hasTipTraqData ? riskFlagsFromLatestNight(input.latestNight) : [],
    showRiskSection: hasTipTraqData,
    medicationWindows,
    hasMedicationSelection: (input.currentMedications?.length ?? 0) > 0,
    hasDlmoTiming,
    zeitgebers: buildZeitgebers(phaseMinutes),
    activeProtocols: input.activeProtocols ?? [],
    latestBloodPanel: input.latestBloodPanel ?? null,
    protocolIdleMessage: buildProtocolIdleMessage(input.latestBloodPanel ?? null),
    canShareReport: hasMLuxProfile || hasTipTraqData,
  }
}
