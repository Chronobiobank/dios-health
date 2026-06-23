# DeepDose Project Blueprint & Rules

## Repository hygiene

- **Single active app:** `deepdose/` only. Do not add root-level app code, migrations, or deploy config.
- **Supabase:** `deepdose/supabase/` → project **DeepDose** (`yavqgklsfmawhrqvuvuf`). Run `npx supabase` and `db push` from `deepdose/`.
- **Deploy:** Vercel project `deepdose` (root directory `deepdose/`). See `deepdose/DEPLOY.md`.
- **After schema changes:** `npx supabase db advisors --linked` from `deepdose/` — treat `rls_disabled_in_public` as a blocker.
- **Secrets:** `service_role` and `SUPABASE_ACCESS_TOKEN` never in frontend or git.

---

## System overview

DeepDose is a Clinical Decision Support & Personalized Chronotherapy Platform. It ingests passive circadian biometric data from wearable public APIs (via user-authorized consent) to calculate and output an optimized medication timing window (Biological Time Index).

## Codebase rules & tech stack

- **Frontend:** Next.js (TypeScript), React, Tailwind — `deepdose/src/`
- **Database & backend:** Supabase (PostgreSQL, Row Level Security, Edge Functions) via Supabase JS Client
- **Deployment:** Vercel (app) + Supabase (database), decoupled
- **Architecture:** Decoupled, modular service patterns. Never mix algorithmic math with UI controllers.
- **Compliance:** UK GDPR and HIPAA compliant design. OAuth 2.0 for user-authorized integrations.

---

## Architecture requirements (investment deck)

These parameters govern database schemas, API routes, and frontend services in **DeepDose**.

### 1. Ingestion layer data schema

Pull-based sync on trigger (e.g. dashboard load). No continuous real-time streaming overhead.

- **Core tiers (Oura, Whoop, Apple HealthKit):**
  - *Sleep:* `sleep_onset_timestamp`, `wake_timestamp`, `deep_sleep_duration_minutes`, `rem_duration_minutes`
  - *HRV:* `daily_average_hrv`, `intra_night_hrv_series`
  - *Light:* `lux_exposure_hours`
- **Premium tier (TipTraQ & medical hardware):** Core sleep plus continuous SpO2, respiratory events, pulse rate variability

### 2. Biological Time Index (BTI) engine payload

Isolated service class consuming ingestion schema; returns:

```json
{
  "patient_id": "uuid",
  "medication_id": "string",
  "clock_time_utc": "ISO-8601",
  "biological_time_relative": "HH:MM",
  "bti_status": "WINDOW_OPEN | WINDOW_CLOSED | CRITICAL_DRIFT",
  "dosing_window_start": "ISO-8601",
  "dosing_window_end": "ISO-8601",
  "display_instruction": "Take it now. Your window is open."
}
```

### 3. User-authorized auth architecture

- **`patients` / profile tier:** `is_premium_tier` (boolean)
- **Integration tokens (nullable):** `oura_oauth_token`, `whoop_oauth_token`, `tiptraq_api_key`, `apple_health_connected`

### 4. Chronobiobank isolation

- UI must not access raw calculation weights, baselines, or demographic training models
- UI hits endpoints serving structured BTI payload only
- Anonymous outcomes → `chronobiobank_telemetry` (contributor hash, no PII)

### 5. Clinician triage alerting

- **`is_premium_tier = true`:** render `🛡️ Verified Clinical-Grade Data via TipTraQ`
- **Device alert:** empty tokens or no telemetry sync within 36h → `device_alert_triggered = true`, priority queue
