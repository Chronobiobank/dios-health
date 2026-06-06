import { createClient } from '@/lib/supabase/client'
import {
  CHRONOBIOBANK_TELEMETRY_TABLE,
  WEARABLE_TELEMETRY_LOGS_TABLE,
} from '@/lib/dios/constants/tables'
import type {
  BtiEnginePayload,
  BtiStatus,
  ChronobiobankTelemetryInsert,
  WearableTelemetryLogRow,
} from '@/lib/dios/bti/types'

const REFERENCE_SLEEP_MIDPOINT_MINUTES = 3 * 60
const CRITICAL_DRIFT_THRESHOLD_MINUTES = 90
const LOW_HRV_THRESHOLD = 40
const LOW_LUX_THRESHOLD_HOURS = 0.5
const PREMIUM_LOW_SPO2_THRESHOLD = 92
const PREMIUM_HIGH_RDI_THRESHOLD = 5
const BIOLOGICAL_WINDOW_CENTER_MINUTES = 21 * 60
const BIOLOGICAL_WINDOW_HALF_WIDTH_MINUTES = 45
const PREMIUM_WINDOW_HALF_WIDTH_MINUTES = 35

const DISPLAY_INSTRUCTION: Record<BtiStatus, string> = {
  WINDOW_OPEN: 'Take it now. Your window is open.',
  WINDOW_CLOSED: 'Your window is not open yet. I will remind you when it is.',
  CRITICAL_DRIFT:
    'Your biological clock has shifted significantly. Review timing with your clinician.',
}

function minutesToHHMM(totalMinutes: number): string {
  const normalized = ((totalMinutes % 1440) + 1440) % 1440
  const hours = Math.floor(normalized / 60)
  const minutes = normalized % 60
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`
}

function clockMinutesFromDate(date: Date): number {
  return date.getUTCHours() * 60 + date.getUTCMinutes()
}

function sleepMidpointMinutes(onset: Date, wake: Date): number {
  let onsetMin = clockMinutesFromDate(onset)
  let wakeMin = clockMinutesFromDate(wake)
  if (wakeMin <= onsetMin) {
    wakeMin += 24 * 60
  }
  return Math.floor((onsetMin + wakeMin) / 2) % (24 * 60)
}

function phaseDelayMinutes(midpointMinutes: number): number {
  let delay = midpointMinutes - REFERENCE_SLEEP_MIDPOINT_MINUTES
  if (delay > 12 * 60) delay -= 24 * 60
  if (delay < -12 * 60) delay += 24 * 60
  return delay
}

function biologicalMinutesAtClock(clockMinutes: number, delayMinutes: number): number {
  return (clockMinutes + delayMinutes + 24 * 60) % (24 * 60)
}

function clockUtcFromBiologicalMinutes(
  biologicalMinutes: number,
  phaseDelay: number,
  anchor: Date
): Date {
  const clockMinutes = (biologicalMinutes - phaseDelay + 24 * 60) % (24 * 60)
  const result = new Date(anchor)
  result.setUTCHours(0, 0, 0, 0)
  result.setUTCMinutes(clockMinutes)
  if (result.getTime() < anchor.getTime() - 12 * 60 * 60 * 1000) {
    result.setUTCDate(result.getUTCDate() + 1)
  }
  return result
}

function applyPremiumPhaseCorrection(
  phaseDelay: number,
  telemetry: WearableTelemetryLogRow
): number {
  if (telemetry.ingestion_tier !== 'PREMIUM') {
    return phaseDelay
  }

  const rdi = telemetry.respiratory_disturbance_index ?? 0
  const spo2 = telemetry.average_spo2 ?? 96
  const remShare =
    telemetry.rem_duration_minutes /
    Math.max(1, telemetry.rem_duration_minutes + telemetry.deep_sleep_duration_minutes)

  let correction = 0
  if (rdi >= PREMIUM_HIGH_RDI_THRESHOLD) {
    correction += Math.min(18, (rdi - PREMIUM_HIGH_RDI_THRESHOLD) * 3)
  }
  if (spo2 < PREMIUM_LOW_SPO2_THRESHOLD) {
    correction += (PREMIUM_LOW_SPO2_THRESHOLD - spo2) * 0.6
  }
  if (remShare < 0.2) {
    correction += 8
  }

  return phaseDelay + correction
}

function resolveBtiStatus(input: {
  phaseDelayMinutes: number
  dailyAverageHrv: number
  luxExposureHours: number
  biologicalNowMinutes: number
  isPremium: boolean
  averageSpo2?: number | null
  respiratoryDisturbanceIndex?: number | null
}): BtiStatus {
  const {
    phaseDelayMinutes: delay,
    dailyAverageHrv,
    luxExposureHours,
    biologicalNowMinutes,
    isPremium,
    averageSpo2,
    respiratoryDisturbanceIndex,
  } = input

  const driftThreshold = isPremium ? 75 : CRITICAL_DRIFT_THRESHOLD_MINUTES
  const hrvThreshold = isPremium ? 35 : LOW_HRV_THRESHOLD

  const respiratoryCritical =
    isPremium &&
    ((respiratoryDisturbanceIndex ?? 0) >= PREMIUM_HIGH_RDI_THRESHOLD + 2 ||
      (averageSpo2 ?? 96) < 90)

  if (
    Math.abs(delay) >= driftThreshold ||
    dailyAverageHrv < hrvThreshold ||
    luxExposureHours < LOW_LUX_THRESHOLD_HOURS ||
    respiratoryCritical
  ) {
    return 'CRITICAL_DRIFT'
  }

  const halfWidth = isPremium ? PREMIUM_WINDOW_HALF_WIDTH_MINUTES : BIOLOGICAL_WINDOW_HALF_WIDTH_MINUTES
  const windowStart = BIOLOGICAL_WINDOW_CENTER_MINUTES - halfWidth
  const windowEnd = BIOLOGICAL_WINDOW_CENTER_MINUTES + halfWidth

  if (biologicalNowMinutes >= windowStart && biologicalNowMinutes <= windowEnd) {
    return 'WINDOW_OPEN'
  }

  return 'WINDOW_CLOSED'
}

/** Simulated chronotherapy calculation — isolated from UI controllers. */
export function simulateBiologicalWindowFromTelemetry(
  telemetry: WearableTelemetryLogRow,
  medicationId: string,
  evaluatedAt: Date = new Date()
): BtiEnginePayload {
  const onset = new Date(telemetry.sleep_onset_timestamp)
  const wake = new Date(telemetry.wake_timestamp)
  const midpoint = sleepMidpointMinutes(onset, wake)
  const phaseDelay = applyPremiumPhaseCorrection(phaseDelayMinutes(midpoint), telemetry)
  const isPremium = telemetry.ingestion_tier === 'PREMIUM'
  const halfWidth = isPremium ? PREMIUM_WINDOW_HALF_WIDTH_MINUTES : BIOLOGICAL_WINDOW_HALF_WIDTH_MINUTES
  const clockMinutes = clockMinutesFromDate(evaluatedAt)
  const biologicalNow = biologicalMinutesAtClock(clockMinutes, phaseDelay)

  const windowBioStart = BIOLOGICAL_WINDOW_CENTER_MINUTES - halfWidth
  const windowBioEnd = BIOLOGICAL_WINDOW_CENTER_MINUTES + halfWidth

  const dosingWindowStart = clockUtcFromBiologicalMinutes(windowBioStart, phaseDelay, evaluatedAt)
  const dosingWindowEnd = clockUtcFromBiologicalMinutes(windowBioEnd, phaseDelay, evaluatedAt)

  const btiStatus = resolveBtiStatus({
    phaseDelayMinutes: phaseDelay,
    dailyAverageHrv: telemetry.daily_average_hrv,
    luxExposureHours: telemetry.lux_exposure_hours,
    biologicalNowMinutes: biologicalNow,
    isPremium,
    averageSpo2: telemetry.average_spo2,
    respiratoryDisturbanceIndex: telemetry.respiratory_disturbance_index,
  })

  return {
    patient_id: telemetry.patient_id,
    medication_id: medicationId,
    clock_time_utc: evaluatedAt.toISOString(),
    biological_time_relative: minutesToHHMM(biologicalNow),
    bti_status: btiStatus,
    dosing_window_start: dosingWindowStart.toISOString(),
    dosing_window_end: dosingWindowEnd.toISOString(),
    display_instruction: DISPLAY_INSTRUCTION[btiStatus],
  }
}

async function hashContributorId(patientId: string): Promise<string> {
  const salt =
    process.env.NEXT_PUBLIC_CHRONOBIOBANK_SALT ?? 'dios-chronobiobank-contributor-v1'
  const data = new TextEncoder().encode(`${salt}:${patientId}`)
  const digest = await crypto.subtle.digest('SHA-256', data)
  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('')
}

function toChronobiobankInsert(
  payload: BtiEnginePayload,
  telemetry: WearableTelemetryLogRow,
  contributorHash: string,
  phaseDelay: number
): ChronobiobankTelemetryInsert {
  return {
    contributor_hash: contributorHash,
    medication_id: payload.medication_id,
    clock_time_utc: payload.clock_time_utc,
    biological_time_relative: payload.biological_time_relative,
    bti_status: payload.bti_status,
    dosing_window_start: payload.dosing_window_start,
    dosing_window_end: payload.dosing_window_end,
    display_instruction: payload.display_instruction,
    phase_delay_minutes: phaseDelay,
    daily_average_hrv: telemetry.daily_average_hrv,
    lux_exposure_hours: telemetry.lux_exposure_hours,
  }
}

/**
 * Pull latest wearable telemetry, simulate BTI window, persist anonymous Chronobiobank outcome,
 * and return the structured payload for UI consumption (CLAUDE.md §2 + §4).
 */
export async function calculateBiologicalWindow(
  patientId: string,
  medicationId: string
): Promise<BtiEnginePayload> {
  const supabase = createClient()

  const { data: telemetry, error: fetchError } = await supabase
    .from(WEARABLE_TELEMETRY_LOGS_TABLE)
    .select(
      'id, patient_id, synced_at, sleep_onset_timestamp, wake_timestamp, deep_sleep_duration_minutes, rem_duration_minutes, daily_average_hrv, intra_night_hrv_series, lux_exposure_hours, source, ingestion_tier, average_spo2, respiratory_disturbance_index, created_at'
    )
    .eq('patient_id', patientId)
    .order('synced_at', { ascending: false })
    .limit(1)
    .maybeSingle<WearableTelemetryLogRow>()

  if (fetchError) {
    throw new Error(`Failed to load wearable telemetry: ${fetchError.message}`)
  }

  if (!telemetry) {
    throw new Error('No wearable telemetry found for patient. Sync a wearable source first.')
  }

  const evaluatedAt = new Date()
  const payload = simulateBiologicalWindowFromTelemetry(telemetry, medicationId, evaluatedAt)

  const onset = new Date(telemetry.sleep_onset_timestamp)
  const wake = new Date(telemetry.wake_timestamp)
  const phaseDelay = phaseDelayMinutes(sleepMidpointMinutes(onset, wake))
  const contributorHash = await hashContributorId(patientId)

  const { error: insertError } = await supabase
    .from(CHRONOBIOBANK_TELEMETRY_TABLE)
    .insert(toChronobiobankInsert(payload, telemetry, contributorHash, phaseDelay))

  if (insertError) {
    throw new Error(`Failed to save Chronobiobank telemetry: ${insertError.message}`)
  }

  return payload
}
