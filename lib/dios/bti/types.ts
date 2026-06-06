/** BTI engine output — CLAUDE.md §2 */

export type BtiStatus = 'WINDOW_OPEN' | 'WINDOW_CLOSED' | 'CRITICAL_DRIFT'

export type BtiEnginePayload = {
  patient_id: string
  medication_id: string
  clock_time_utc: string
  biological_time_relative: string
  bti_status: BtiStatus
  dosing_window_start: string
  dosing_window_end: string
  display_instruction: string
}

export type IngestionTier = 'CORE' | 'PREMIUM'

/** Latest wearable pull row — mirrors Ingestion Layer + `wearable_telemetry_logs`. */
export type WearableTelemetryLogRow = {
  id: string
  patient_id: string
  synced_at: string
  sleep_onset_timestamp: string
  wake_timestamp: string
  deep_sleep_duration_minutes: number
  rem_duration_minutes: number
  daily_average_hrv: number
  intra_night_hrv_series: { recorded_at: string; value: number }[]
  lux_exposure_hours: number
  source: string | null
  ingestion_tier?: IngestionTier
  average_spo2?: number | null
  respiratory_disturbance_index?: number | null
  created_at: string
}

/** Anonymous Chronobiobank contribution — no raw patient_id stored. */
export type ChronobiobankTelemetryInsert = {
  contributor_hash: string
  medication_id: string
  clock_time_utc: string
  biological_time_relative: string
  bti_status: BtiStatus
  dosing_window_start: string
  dosing_window_end: string
  display_instruction: string
  phase_delay_minutes: number
  daily_average_hrv: number
  lux_exposure_hours: number
}
