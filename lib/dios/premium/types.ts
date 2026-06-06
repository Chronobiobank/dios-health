import type { TipTraQNight } from '@/lib/mlux'

export type PatientIntegrationRecord = {
  id: string
  is_premium_tier: boolean
  oura_oauth_token: string | null
  whoop_oauth_token: string | null
  tiptraq_api_key: string | null
  apple_health_connected: boolean
  retinomic_tier?: 'FREE_SCREENING' | 'PREMIUM_VERIFICATION' | null
}

export type WearableTelemetryInsert = {
  patient_id: string
  synced_at: string
  sleep_onset_timestamp: string
  wake_timestamp: string
  deep_sleep_duration_minutes: number
  rem_duration_minutes: number
  daily_average_hrv: number
  intra_night_hrv_series: { recorded_at: string; value: number }[]
  lux_exposure_hours: number
  source: string
  ingestion_tier: 'CORE' | 'PREMIUM'
  average_spo2: number | null
  respiratory_disturbance_index: number | null
}

export type TipTraQClinicalNight = TipTraQNight

export type PremiumIngestionResult = {
  isPremium: boolean
  synced: boolean
  telemetryId: string | null
  source: 'tiptraq' | null
}
