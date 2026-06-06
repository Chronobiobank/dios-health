/**
 * DIOS core table identifiers.
 *
 * Domain term: mel_sessions (melanopic engagement layer — DIOS Coach camera sessions).
 * Physical Postgres table: vaya_sessions (product-facing name retained for migration stability).
 */
export const MEL_SESSIONS_TABLE = 'vaya_sessions' as const

export type MelSessionsTableName = typeof MEL_SESSIONS_TABLE

/** Pull-based wearable ingestion logs — CLAUDE.md §1 */
export const WEARABLE_TELEMETRY_LOGS_TABLE = 'wearable_telemetry_logs' as const

/** Anonymous BTI outcomes — Chronobiobank isolation (CLAUDE.md §4) */
export const CHRONOBIOBANK_TELEMETRY_TABLE = 'chronobiobank_telemetry' as const
