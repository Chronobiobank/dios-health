/**
 * DIOS core table identifiers.
 *
 * Domain term: coach_sessions (DINA camera / voice engagement logs).
 * Physical Postgres table: dina_sessions (renamed from vaya_sessions in migration 030).
 */
export const COACH_SESSIONS_TABLE = 'dina_sessions' as const

/** @deprecated Use {@link COACH_SESSIONS_TABLE}. */
export const MEL_SESSIONS_TABLE = COACH_SESSIONS_TABLE

export type CoachSessionsTableName = typeof COACH_SESSIONS_TABLE

/** Pull-based wearable ingestion logs — CLAUDE.md §1 */
export const WEARABLE_TELEMETRY_LOGS_TABLE = 'wearable_telemetry_logs' as const

/** Anonymous BTI outcomes — Chronobiobank isolation (CLAUDE.md §4) */
export const CHRONOBIOBANK_TELEMETRY_TABLE = 'chronobiobank_telemetry' as const
