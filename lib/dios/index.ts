/**
 * DIOS core OS — patient identity, consent, session logging, data ingestion contracts.
 * Application routes and UI live under `app/`; clinical modules under `lib/dashboard`, `lib/vaya`, etc.
 */
export { MEL_SESSIONS_TABLE } from '@/lib/dios/constants/tables'
export {
  melSessionsTable,
  type MelSessionInsert,
  type MelSessionRow,
} from '@/lib/dios/core/mel-sessions'
