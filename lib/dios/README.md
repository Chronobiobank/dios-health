# DIOS core (`lib/dios`)

Foundational **Operating System for Dose Intelligence** logic — separate from product UI and route handlers.

## Layout

| Path | Responsibility |
|------|----------------|
| `constants/` | Canonical table names and platform identifiers |
| `core/` | Session logging, shared types for ingestion boundaries |

## Product modules (outside this folder)

| Path | Responsibility |
|------|----------------|
| `lib/mel/` | Mel voice, MLux capture, ElevenLabs |
| `lib/dashboard/` | Patient dashboard, MLux profiles, protocols |
| `lib/clinic/` | Clinician panel and demo data |
| `lib/spectrum/` | Circadian Desynchrony Spectrum scoring |
| `app/api/` | HTTP boundaries (auth, Supabase) |

## mel_sessions ↔ vaya_sessions

Clinical and engineering docs refer to **mel_sessions** (melanopic engagement layer). The database table remains **`vaya_sessions`** for migration stability. All Supabase queries must use `MEL_SESSIONS_TABLE` from `lib/dios/constants/tables.ts`.
