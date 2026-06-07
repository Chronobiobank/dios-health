import { COACH_SESSIONS_TABLE } from '@/lib/dios/constants/tables'

/** Row shape for coach_sessions (stored in public.vaya_sessions). */
export type CoachSessionRow = {
  id: string
  patient_id: string
  started_at: string
}

export type CoachSessionInsert = Pick<CoachSessionRow, 'patient_id'>

/** Supabase `.from()` target — coach_sessions domain, vaya_sessions physical table. */
export function coachSessionsTable(): typeof COACH_SESSIONS_TABLE {
  return COACH_SESSIONS_TABLE
}
