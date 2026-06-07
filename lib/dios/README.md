# DIOS core (`lib/dios`)

Foundational **Operating System for Dose Intelligence** logic — separate from product UI and route handlers.

## Layout

| Path | Responsibility |
|------|----------------|
| `constants/` | Canonical table names and platform identifiers |
| `core/` | Session logging, shared types for ingestion boundaries |
| `ingestion/` | Ingestion Layer schema types + mock pull-sync generator (UI/BTI dev) |
| `bti/` | Client BTI engine service — `calculateBiologicalWindow` + payload types |
| `premium/` | Premium tier verification + `MockTipTraQAdapter` clinical ingestion |

## Product modules (outside this folder)

| Path | Responsibility |
|------|----------------|
| `lib/coach/` | DINA voice agent, MLux capture, ElevenLabs |
| `lib/dashboard/` | Patient dashboard, MLux profiles, protocols |
| `lib/clinic/` | Clinician panel and demo data |
| `lib/spectrum/` | Circadian Desynchrony Spectrum scoring |
| `app/api/` | HTTP boundaries (auth, Supabase) |

## coach_sessions ↔ vaya_sessions

Clinical and engineering docs refer to **coach_sessions** (DINA engagement logs). The database table remains **`vaya_sessions`** for migration stability. All Supabase queries must use `COACH_SESSIONS_TABLE` from `lib/dios/constants/tables.ts`.
