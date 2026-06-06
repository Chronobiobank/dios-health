import { resolveTimelinePhaseMinutes } from '@/lib/dashboard/timebot-timeline'
import { formatMinutesLabel } from '@/lib/dashboard/time-utils'
import type { MLuxProfileRow } from '@/lib/dashboard/mlux-profile'
import {
  DAY_ONE_EXAMPLE_MEDICATION_IDS,
  MEDICATION_TIMING_CATALOG,
  resolveMedicationWindowTime,
} from '@/lib/medication/timing-catalog'
import {
  listUnmatchedPatientMedications,
  matchPatientMedications,
  readPatientMedicationList,
} from '@/lib/medication/patient-medications'
import type { DailyIntervention, ChronotypePhase } from '@/src/lib/engine/types'

function parseHHmmToMinutes(value: string): number | null {
  const match = value.trim().match(/^(\d{1,2}):(\d{2})$/)
  if (!match) return null
  const h = Number(match[1])
  const m = Number(match[2])
  if (h < 0 || h > 23 || m < 0 || m > 59) return null
  return h * 60 + m
}

/** Sleep proxy from TRE close + chronotype — feeds timeline phase anchor */
export function estimateSleepTimeFromIntervention(
  intervention: DailyIntervention,
  chronotype: ChronotypePhase
): string {
  const firstMeal = parseHHmmToMinutes(intervention.firstMealTime) ?? 8 * 60 + 30
  const treClose = firstMeal + intervention.treWindowHours * 60
  const blueLightCutoff = treClose - 150
  const sleepDelay =
    chronotype === 'delayed' ? 150 : chronotype === 'advanced' ? 90 : 120
  const sleepMinutes = ((blueLightCutoff + sleepDelay) % 1440 + 1440) % 1440
  return formatMinutesLabel(sleepMinutes)
}

export type MedicationTimingWindow = {
  id: string
  name: string
  timeLabel: string
  standardGuidance: string
  directive: string
  estimated: boolean
  isExample: boolean
}

export type MedicationTimingPlan = {
  intro: string
  phaseCaption: string
  windows: MedicationTimingWindow[]
  showingExamples: boolean
  hasPatientMeds: boolean
  unmatchedMedications: string[]
}

export function buildMedicationTimingFromIntervention(input: {
  intervention: DailyIntervention
  chronotype: ChronotypePhase
  currentMedications?: string[] | null
  fallbackSleepTime?: string | null
  mluxProfile?: MLuxProfileRow | null
}): MedicationTimingPlan {
  const sleepTime =
    input.fallbackSleepTime?.trim() ||
    estimateSleepTimeFromIntervention(input.intervention, input.chronotype)
  const { minutes: phaseMinutes, fromRolling } = resolveTimelinePhaseMinutes(null, sleepTime)
  const hasPrecisionTiming = input.mluxProfile?.mlux_phase_time != null

  const profileMeds = readPatientMedicationList(input.currentMedications)
  const hasPatientMeds = profileMeds.length > 0
  const patientDefs = matchPatientMedications(input.currentMedications)
  const unmatchedMedications = listUnmatchedPatientMedications(input.currentMedications)
  const showingExamples = !hasPatientMeds
  const activeDefs = showingExamples
    ? MEDICATION_TIMING_CATALOG.filter((definition) =>
        (DAY_ONE_EXAMPLE_MEDICATION_IDS as readonly string[]).includes(definition.id)
      )
    : patientDefs

  const sortedDefs = [...activeDefs].sort((a, b) => {
    const ao = a.estimatedOffsetMinutes ?? 180
    const bo = b.estimatedOffsetMinutes ?? 180
    return ao - bo
  })

  const windows: MedicationTimingWindow[] = sortedDefs.map((definition) => {
    const { timeLabel, estimated } = resolveMedicationWindowTime(
      definition,
      phaseMinutes,
      input.mluxProfile ?? null,
      hasPrecisionTiming || fromRolling
    )
    return {
      id: definition.id,
      name: definition.name,
      timeLabel,
      standardGuidance: definition.standardGuidance,
      directive: definition.instruction,
      estimated,
      isExample: showingExamples,
    }
  })

  const phaseCaption = `Anchored to your ${input.intervention.firstMealTime} first-meal window · phase estimate from scan`

  let intro = showingExamples
    ? 'Your eye scan sets your body-clock phase. These example windows show how DIOS quantifies common meds on your schedule — add yours in Settings to personalise.'
    : 'DIOS matched your medications to today’s body-clock anchor from your baseline scan.'

  if (hasPatientMeds && windows.length === 0) {
    intro =
      'Your medications are saved, but DIOS could not match them to a timing module yet. Pick supported meds in Settings or ask DiDi.'
  } else if (hasPatientMeds && unmatchedMedications.length > 0) {
    intro = `Personal windows for ${windows.length} medication${windows.length === 1 ? '' : 's'} on your profile. ${unmatchedMedications.length} entr${unmatchedMedications.length === 1 ? 'y' : 'ies'} still need a supported module.`
  }

  return {
    intro,
    phaseCaption,
    windows,
    showingExamples,
    hasPatientMeds,
    unmatchedMedications,
  }
}
