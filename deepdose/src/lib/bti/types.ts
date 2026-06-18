export type BtiStatus = 'WINDOW_OPEN' | 'WINDOW_CLOSED' | 'CRITICAL_DRIFT'

export interface BtiPayload {
  patient_id: string
  medication_id: string
  clock_time_utc: string
  biological_time_relative: string
  bti_status: BtiStatus
  dosing_window_start: string
  dosing_window_end: string
  display_instruction: string
}
