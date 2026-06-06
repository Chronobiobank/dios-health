/**
 * Ingestion Layer Data Schema — CLAUDE.md §1
 * Pull-based sync payloads consumed by the BTI engine (decoupled from UI).
 */

export type WearableIntegrationState = {
  oura_oauth_token: string | null
  whoop_oauth_token: string | null
  apple_health_connected: boolean
}

/** Sleep stream — wearable pull on dashboard load. */
export type SleepStream = {
  sleep_onset_timestamp: string
  wake_timestamp: string
  deep_sleep_duration_minutes: number
  rem_duration_minutes: number
}

export type HrvSample = {
  recorded_at: string
  value: number
}

/** HRV stream — nightly autonomic recovery curve. */
export type HrvStream = {
  daily_average_hrv: number
  intra_night_hrv_series: HrvSample[]
}

/** Light stream — melanopic-relevant exposure in rolling window. */
export type LightStream = {
  /** Total meaningful lux-exposure hours in the sync window (wearable-normalised). */
  lux_exposure_hours: number
}

export type MockPersonaKey = 'early-riser' | 'insomniac' | 'night-shift-worker'

export type IngestionLayerPayload = {
  patient_id: string
  persona_key: MockPersonaKey
  display_name: string
  /** ISO-8601 — pull trigger timestamp (e.g. dashboard load). */
  synced_at: string
  integration: WearableIntegrationState
  sleep_stream: SleepStream
  hrv_stream: HrvStream
  light_stream: LightStream
}
