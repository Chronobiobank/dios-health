import type { MLuxProfileRow } from '@/lib/dashboard/mlux-profile'
import { LAYER_BIT_BLOOD, LAYER_BIT_SMARTPHONE, LAYER_BIT_TIPTRAQ } from '@/lib/dashboard/dlmo-merge'
import { normalizeMinutesFromMidnight } from '@/lib/mlux'
import { GOMINAK_TARGETS, getGominakRangeStatus } from '@/lib/dashboard/blood-panel-gominak'
import {
  formatMinutesLabel,
  parseDbTimeToMinutes,
  parseTimeToMinutes,
} from '@/lib/dashboard/time-utils'
import { resolveMedicationWindowTime } from '@/lib/medication/timing-catalog'
import { matchPatientMedications } from '@/lib/medication/patient-medications'

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

export type { NightFlagsRow }

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

function buildMedicationWindows(
  currentMedications: string[] | null | undefined,
  profile: InsightsMLuxProfile | null,
  phaseMinutes: number,
  hasDlmoTiming: boolean,
  confidenceScore: number | null
): MedicationWindowCard[] {
  const matched = matchPatientMedications(currentMedications)
  if (matched.length === 0) return []

  const showCaveat = (confidenceScore ?? 0) < 60

  return matched.map((definition) => {
    const { timeLabel, estimated } = resolveMedicationWindowTime(
      definition,
      phaseMinutes,
      profile,
      hasDlmoTiming && profile?.mlux_phase_time != null
    )

    return {
      id: definition.id,
      name: definition.name,
      standardGuidance: definition.standardGuidance,
      diosWindow: `Your window: ${timeLabel}${estimated ? ' · ESTIMATED' : ''}`,
      explanation: definition.explanation,
      estimated,
      showCaveat,
    }
  })
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
