# DIOS Project Blueprint & Rules

## 🎯 System Overview
DIOS is a Clinical Decision Support & Personalized Chronotherapy Platform. It ingests passive circadian biometric data from wearable public APIs (via user-authorized consent) to calculate and output an optimized medication timing window (Biological Time Index).

## 🛠️ Codebase Rules & Tech Stack
- **Frontend Architecture:** React (TypeScript) SPA built via Vite.
- **Database & Backend:** Supabase (PostgreSQL, Row Level Security, Edge Functions) using the Supabase JS Client.
- **Deployment Strategy:** Static hosting, fully decoupled from database infrastructure.
- **Architecture Style:** Decoupled, modular service patterns. Never mix algorithmic math with UI controllers.
- **Data Compliance:** UK GDPR and HIPAA compliant design. Mock user authentication loops using standard OAuth 2.0 principles.

---

## 🏛️ ARCHITECTURE REQUIREMENTS FROM INVESTMENT DECK

The following parameters must govern all database schemas, API route design, and frontend service classes built by Cursor.

### 1. Ingestion Layer Data Schema
Data syncs are pull-based on trigger (e.g., dashboard load). No continuous real-time streaming overhead.
- **Core Tiers (Oura, Whoop, Apple HealthKit):** 
  - *Sleep Stream:* `sleep_onset_timestamp`, `wake_timestamp`, `deep_sleep_duration_minutes`, `rem_duration_minutes`.
  - *HRV Stream:* `daily_average_hrv`, `intra_night_hrv_series` (array of timestamps/values).
  - *Light Stream:* `lux_exposure_hours`.
- **Premium Tier (TipTraQ & Medical Hardware):** Core sleep architecture PLUS continuous SpO2 (oxygen saturation), real-time respiratory event localization, and pulse rate variability.

### 2. Biological Time Index (BTI) Engine Payload
The core engine calculation must be decoupled as an isolated service class. It consumes the Ingestion Layer Schema and returns a strictly formatted JSON payload:
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

### 3. User-Authorized Auth Architecture (No Corporate Blockers)
Bypass enterprise hardware partnerships by leveraging user-authorized public developer portals.
- **Table Constraints:** The `patients` schema must contain standard user tokens and an explicit tier column: `is_premium_tier` (boolean). Nullable columns for integration tokens must include: `oura_oauth_token`, `whoop_oauth_token`, `tiptraq_api_key`, `apple_health_connected` (boolean).

### 4. Chronobiobank Isolation Policy
- **Architectural Boundary:** Frontend interfaces must never access raw calculation weights, scoring baselines, or demographic training models.
- **Data Flow:** UI components may only hit endpoints serving the structured BTI payload. Telemetry is processed and anonymously saved to a centralized `chronobiobank_telemetry` table.

### 5. Clinician Triage Panel Alerting Rules
- **Clinical Grade Verification Badge:** Any patient record displaying `is_premium_tier = true` must render a prominent visual badge (`🛡️ Verified Clinical-Grade Data via TipTraQ`).
- **Automated Device Interruption Alerts:** If a patient's hardware sync fails (e.g., empty token fields, expired session, or no raw telemetry logs pulled within the last 36 hours), the triage controller must automatically flag that patient record with `device_alert_triggered = true` and push them to the top of the clinician's priority workflow queue.
