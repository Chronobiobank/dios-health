/** TipTraQ night — core fields from summary report / Sean James block. */

export type TipTraqDayType = 'weekday' | 'weekend'

export type TipTraqNightInput = {
  report_date: string
  night_index?: number
  day_type?: TipTraqDayType
  sleep_onset: string
  sleep_offset: string
  sleep_latency_minutes: number
  tst_minutes: number
  waso_minutes: number
  sleep_efficiency_pct: number
  rem_duration_minutes: number
  rem_pct_tst: number
  first_rem_onset?: string | null
  ahi: number
  min_spo2?: number | null
  mean_pr?: number | null
  min_pr?: number | null
  sns_pct?: number | null
  pns_pct?: number | null
  hypoxic_burden?: number | null
  signal_quality_pct?: number | null
  clinician_note?: string | null
}

export type TipTraqNightRecord = TipTraqNightInput & {
  id: string
  patient_id: string
  assessment_id: string | null
  clinician_id: string
  ahi_severity: string | null
  proxy_dlmo_time: string | null
  confidence_score: number | null
  confidence_label: string | null
  chronotype_signal: string | null
  apnea_confound_flag: boolean
  high_sympathetic_flag: boolean
  rem_delay_flag: boolean
  created_at: string
}

export type TipTraqBlockMetrics = {
  nightsLoaded: number
  nightsRequired: number
  blockComplete: boolean
  meanSleepOnset: string
  meanWake: string
  meanTstLabel: string
  meanEfficiencyPct: number
  meanAhi: number
  meanRemLatencyMins: number
  dlmoEstimate: string
  clockDriftMinutes: number
  socialJetlagLabel: string
  ahiSeverityBand: string
  clinicalRead: string
  confidenceLabel: string
}
