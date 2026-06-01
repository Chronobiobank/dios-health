-- Domain mapping: mel_sessions (clinical/OS term) → physical table vaya_sessions (product name).
-- Application code references MEL_SESSIONS_TABLE in lib/dios/constants/tables.ts.

comment on table public.vaya_sessions is
  'Vaya camera sessions. Domain alias: mel_sessions (melanopic engagement layer).';
