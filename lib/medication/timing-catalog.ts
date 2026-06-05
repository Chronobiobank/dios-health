import type { MLuxProfileRow } from '@/lib/dashboard/mlux-profile'
import { formatMinutesLabel, parseDbTimeToMinutes } from '@/lib/dashboard/time-utils'
import { normalizeMinutesFromMidnight } from '@/lib/mlux'

export type MedicationTimingDefinition = {
  id: string
  name: string
  standardGuidance: string
  explanation: string
  instruction: string
  profileTimeKey?: keyof Pick<
    MLuxProfileRow,
    'simvastatin_optimal_time' | 'ramipril_optimal_time' | 'prednisolone_optimal_time' | 'salmeterol_optimal_time'
  >
  estimatedOffsetMinutes?: number
}

/** Chronotherapy modules — shared by insights, coach timeline, and intervention engine */
export const MEDICATION_TIMING_CATALOG: readonly MedicationTimingDefinition[] = [
  {
    id: 'atorvastatin',
    name: 'Atorvastatin',
    standardGuidance: 'Standard: take at night',
    explanation: 'Cholesterol synthesis peaks overnight — timing to your body clock improves statin efficacy.',
    instruction: 'Take at night with water',
    profileTimeKey: 'simvastatin_optimal_time',
  },
  {
    id: 'simvastatin',
    name: 'Simvastatin',
    standardGuidance: 'Standard: take at night',
    explanation: 'Evening dosing aligns with your liver’s cholesterol production rhythm.',
    instruction: 'Take at night with water',
    profileTimeKey: 'simvastatin_optimal_time',
  },
  {
    id: 'ramipril',
    name: 'Ramipril',
    standardGuidance: 'Standard: take in the morning',
    explanation: 'Blood pressure dipping overnight matters — your window matches when your cardiovascular rhythm is ready.',
    instruction: 'Take with water in the morning',
    profileTimeKey: 'ramipril_optimal_time',
  },
  {
    id: 'amlodipine',
    name: 'Amlodipine',
    standardGuidance: 'Standard: take in the morning',
    explanation: 'Calcium channel blockers work best when aligned with your blood pressure body-clock dip.',
    instruction: 'Take with water in the morning',
    estimatedOffsetMinutes: 60,
  },
  {
    id: 'sertraline',
    name: 'Sertraline',
    standardGuidance: 'Standard: take in the morning',
    explanation: 'SSRI timing to your cortisol peak can reduce side effects and improve mood stability.',
    instruction: 'Take in the morning with water',
    estimatedOffsetMinutes: 660,
  },
  {
    id: 'metformin',
    name: 'Metformin',
    standardGuidance: 'Standard: take with meals',
    explanation: 'Meal-aligned dosing supports glucose control when your metabolic clock is primed.',
    instruction: 'Take with your first meal',
    estimatedOffsetMinutes: 660,
  },
  {
    id: 'prednisolone',
    name: 'Prednisolone',
    standardGuidance: 'Standard: take in the morning',
    explanation: 'Cortisol peaks before waking — prednisolone lands best just ahead of your inflammatory surge.',
    instruction: 'Take in the morning with food',
    profileTimeKey: 'prednisolone_optimal_time',
  },
  {
    id: 'salmeterol',
    name: 'Salmeterol',
    standardGuidance: 'Standard: take morning and evening',
    explanation: 'Evening dosing can cover the pre-dawn bronchospasm window tied to your body clock.',
    instruction: 'Take as prescribed (often evening)',
    profileTimeKey: 'salmeterol_optimal_time',
  },
  {
    id: 'levothyroxine',
    name: 'Levothyroxine',
    standardGuidance: 'Standard: take on waking, empty stomach',
    explanation: 'Thyroid hormone absorbs best in your early waking window before food interferes.',
    instruction: 'Take on waking, 30 minutes before food',
    estimatedOffsetMinutes: 600,
  },
] as const

/** Day-one illustrative pair — morning BP + evening statin */
export const DAY_ONE_EXAMPLE_MEDICATION_IDS = ['ramipril', 'atorvastatin'] as const

export function normalizeMedicationToken(value: string): string {
  return value.trim().toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '')
}

function formatClock(minutes: number): string {
  return formatMinutesLabel(normalizeMinutesFromMidnight(minutes))
}

function formatDbTimeLabel(time: string): string {
  const minutes = parseDbTimeToMinutes(time)
  if (minutes === null) return time.slice(0, 5)
  return formatClock(minutes)
}

export function resolveMedicationWindowTime(
  definition: MedicationTimingDefinition,
  phaseMinutes: number,
  profile: MLuxProfileRow | null | undefined,
  hasPrecisionTiming: boolean
): { timeLabel: string; estimated: boolean } {
  if (definition.profileTimeKey && profile) {
    const fromProfile = profile[definition.profileTimeKey]
    if (fromProfile) {
      return {
        timeLabel: formatDbTimeLabel(fromProfile),
        estimated: !hasPrecisionTiming,
      }
    }
  }

  const offset = definition.estimatedOffsetMinutes ?? 180
  return {
    timeLabel: formatClock(phaseMinutes + offset),
    estimated: true,
  }
}

export { matchPatientMedications } from '@/lib/medication/patient-medications'
