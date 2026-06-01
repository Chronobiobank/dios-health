/**
 * DIOS core table identifiers.
 *
 * Domain term: mel_sessions (melanopic engagement layer — Vaya camera sessions).
 * Physical Postgres table: vaya_sessions (product-facing name retained for migration stability).
 */
export const MEL_SESSIONS_TABLE = 'vaya_sessions' as const

export type MelSessionsTableName = typeof MEL_SESSIONS_TABLE
