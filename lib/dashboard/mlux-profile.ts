import type { BodyClockModel } from '@/lib/dashboard/body-clock'
import {
  ZEITGEber_LIGHT_END_OFFSET,
  ZEITGEber_LIGHT_START_OFFSET,
  classifyChronotypeFromPhaseMinutes,
  normalizeMinutesFromMidnight,
} from '@/lib/mlux'
import { formatMinutesLabel, parseDbTimeToMinutes } from '@/lib/dashboard/time-utils'

export type MLuxDominantLayer = 'smartphone' | 'blood' | 'tiptraq' | null

export type MLuxProfileRow = {
  nights_count: number | null
  // Supabase column: mlux_phase_time
  mlux_phase_time: string | null
  // Supabase column: mlux_phase_minutes
  mlux_phase_minutes: number | null
  dominant_layer?: MLuxDominantLayer
  confidence_score: number | null
  confidence_band_minutes: number | null
  confidence_label: string | null
  chronotype: string | null
  simvastatin_optimal_time: string | null
  ramipril_optimal_time: string | null
  prednisolone_optimal_time: string | null
  salmeterol_optimal_time: string | null
  light_dose_window_start: string | null
  light_dose_window_end: string | null
}

export type TipTraqNightRow = {
  id: string
  report_date: string
  mlux_phase_time?: string | null
  confidence_score: number | null
  confidence_label: string | null
}

function timeToMinutes(value: string | null): number | null {
  return parseDbTimeToMinutes(value)
}

export function resolveChronotypeLabel(profile: MLuxProfileRow): string {
  const phaseMinutes =
    parseDbTimeToMinutes(profile.mlux_phase_time) ??
    (profile.mlux_phase_minutes != null
      ? normalizeMinutesFromMidnight(profile.mlux_phase_minutes)
      : null)

  if (phaseMinutes !== null) {
    return classifyChronotypeFromPhaseMinutes(phaseMinutes)
  }

  return profile.chronotype ?? 'Intermediate type'
}

export function buildBodyClockFromMLuxProfile(profile: MLuxProfileRow): BodyClockModel {
  const phaseMinutes =
    parseDbTimeToMinutes(profile.mlux_phase_time) ??
    (profile.mlux_phase_minutes != null
      ? normalizeMinutesFromMidnight(profile.mlux_phase_minutes)
      : null) ??
    22 * 60

  const sleepStartMinutes = phaseMinutes + 120
  const sleepEndMinutes = sleepStartMinutes + 480

  const lightStartMinutes =
    timeToMinutes(profile.light_dose_window_start) ?? phaseMinutes + ZEITGEber_LIGHT_START_OFFSET
  const lightEndMinutes =
    timeToMinutes(profile.light_dose_window_end) ?? phaseMinutes + ZEITGEber_LIGHT_END_OFFSET

  const doseWindows = [
    { label: 'Simvastatin', minutes: timeToMinutes(profile.simvastatin_optimal_time) },
    { label: 'Ramipril', minutes: timeToMinutes(profile.ramipril_optimal_time) },
    { label: 'Prednisolone', minutes: timeToMinutes(profile.prednisolone_optimal_time) },
    { label: 'Salmeterol', minutes: timeToMinutes(profile.salmeterol_optimal_time) },
  ].flatMap((window) => (window.minutes !== null ? [{ label: window.label, minutes: window.minutes }] : []))

  const phaseLabel = profile.mlux_phase_time
    ? formatMinutesLabel(timeToMinutes(profile.mlux_phase_time) ?? phaseMinutes)
    : formatMinutesLabel(phaseMinutes)

  return {
    chronotypeLabel: resolveChronotypeLabel(profile),
    phaseLabel: `MLux phase ${phaseLabel}`,
    sleepStartMinutes,
    sleepEndMinutes,
    phaseMinutes: ((phaseMinutes % 1440) + 1440) % 1440,
    lightStartMinutes,
    lightEndMinutes,
    doseWindows,
  }
}

export function formatReportDate(date: string): string {
  return new Date(`${date}T12:00:00`).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

export function formatDbTime(time: string | null): string {
  if (!time) return '—'
  const minutes = timeToMinutes(time)
  if (minutes === null) return time.slice(0, 5)
  return formatMinutesLabel(minutes)
}
