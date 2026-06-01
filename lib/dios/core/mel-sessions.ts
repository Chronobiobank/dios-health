import { MEL_SESSIONS_TABLE } from '@/lib/dios/constants/tables'

/** Row shape for mel_sessions (stored in public.vaya_sessions). */
export type MelSessionRow = {
  id: string
  patient_id: string
  started_at: string
}

export type MelSessionInsert = Pick<MelSessionRow, 'patient_id'>

/** Supabase `.from()` target — mel_sessions domain, vaya_sessions physical table. */
export function melSessionsTable(): typeof MEL_SESSIONS_TABLE {
  return MEL_SESSIONS_TABLE
}
