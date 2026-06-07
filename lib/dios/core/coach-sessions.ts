import { COACH_SESSIONS_TABLE } from '@/lib/dios/constants/tables'

/** Row shape for DINA engagement sessions (public.dina_sessions). */
export type CoachSessionRow = {
  id: string
  patient_id: string
  started_at: string
}

export type CoachSessionInsert = Pick<CoachSessionRow, 'patient_id'>

/** Supabase `.from()` target for DINA session logs. */
export function coachSessionsTable(): typeof COACH_SESSIONS_TABLE {
  return COACH_SESSIONS_TABLE
}
