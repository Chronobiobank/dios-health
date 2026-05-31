import type { BodyClockModel } from '@/lib/dashboard/body-clock'
import {
  ZEITGEber_LIGHT_END_OFFSET,
  ZEITGEber_LIGHT_START_OFFSET,
  classifyChronotypeFromDlmoMinutes,
  normalizeMinutesFromMidnight,
} from '@/lib/dlmo'
import { formatMinutesLabel, parseDbTimeToMinutes } from '@/lib/dashboard/time-utils'

export type DlmoDominantLayer = 'smartphone' | 'blood' | 'tiptraq' | null

export type DlmoProfileRow = {
  nights_count: number | null
  proxy_dlmo_rolling: string | null
  proxy_dlmo_minutes_from_midnight: number | null
  dominant_layer?: DlmoDominantLayer
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
  proxy_dlmo_time: string | null
  confidence_score: number | null
  confidence_label: string | null
}

function timeToMinutes(value: string | null): number | null {
  return parseDbTimeToMinutes(value)
}

export function resolveChronotypeLabel(profile: DlmoProfileRow): string {
  const dlmoMinutes =
    parseDbTimeToMinutes(profile.proxy_dlmo_rolling) ??
    (profile.proxy_dlmo_minutes_from_midnight != null
      ? normalizeMinutesFromMidnight(profile.proxy_dlmo_minutes_from_midnight)
      : null)

  if (dlmoMinutes !== null) {
    return classifyChronotypeFromDlmoMinutes(dlmoMinutes)
  }

  return profile.chronotype ?? 'Intermediate type'
}

export function buildBodyClockFromDlmoProfile(profile: DlmoProfileRow): BodyClockModel {
  const dlmoMinutes =
    parseDbTimeToMinutes(profile.proxy_dlmo_rolling) ??
    (profile.proxy_dlmo_minutes_from_midnight != null
      ? normalizeMinutesFromMidnight(profile.proxy_dlmo_minutes_from_midnight)
      : null) ??
    22 * 60

  const sleepStartMinutes = dlmoMinutes + 120
  const sleepEndMinutes = sleepStartMinutes + 480

  const lightStartMinutes =
    timeToMinutes(profile.light_dose_window_start) ?? dlmoMinutes + ZEITGEber_LIGHT_START_OFFSET
  const lightEndMinutes =
    timeToMinutes(profile.light_dose_window_end) ?? dlmoMinutes + ZEITGEber_LIGHT_END_OFFSET

  const doseWindows = [
    { label: 'Simvastatin', minutes: timeToMinutes(profile.simvastatin_optimal_time) },
    { label: 'Ramipril', minutes: timeToMinutes(profile.ramipril_optimal_time) },
    { label: 'Prednisolone', minutes: timeToMinutes(profile.prednisolone_optimal_time) },
    { label: 'Salmeterol', minutes: timeToMinutes(profile.salmeterol_optimal_time) },
  ].flatMap((window) => (window.minutes !== null ? [{ label: window.label, minutes: window.minutes }] : []))

  const dlmoLabel = profile.proxy_dlmo_rolling
    ? formatMinutesLabel(timeToMinutes(profile.proxy_dlmo_rolling) ?? dlmoMinutes)
    : formatMinutesLabel(dlmoMinutes)

  return {
    chronotypeLabel: resolveChronotypeLabel(profile),
    msfscLabel: `DLMO ${dlmoLabel}`,
    sleepStartMinutes,
    sleepEndMinutes,
    dlmoMinutes: ((dlmoMinutes % 1440) + 1440) % 1440,
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
