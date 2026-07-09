# Deepdose UX Strategy & Product Requirements (v2.0)

**Classification:** Federated Clinical Decision Support System (CDS)  
**Core mission:** Restoring upstream circadian chemistry to safely drive downstream drug subtraction.  
**Design mandate:** Zero screen attraction. Zero cognitive load. Maximum biological utility.

## Philosophy

Deepdose focuses on **outcomes, not mechanics**. Success is measured by systemic subtraction — fewer medicines, less screen time, and the platform working its way out of the patient's life.

## Implementation map (codebase)

| PRD surface | Route | Code |
|-------------|-------|------|
| Clinician activation gate | `/gate` | `src/app/(public)/gate/page.tsx`, `ClinicalActivationGate.tsx` |
| Tri-focal biochemical dashboard | `/patient/dashboard/status` (alias `/dashboard` when signed in) | `BiochemicalTriFocalDashboard.tsx`, `build-tri-focal-status.ts` |
| On-device SRI engine | — | `src/lib/unmed/local-engine.ts` (`DeepdoseLocalEngine`) |
| Product copy & thresholds | — | `src/lib/unmed/product-philosophy.ts` |
| Styles (dios-glass, no token overwrite) | — | `src/styles/deepdose-clinical-dash.css` |

## Pillars

1. **Passive smartphone telemetry** — Sleep Regularity Index (SRI) from `wearable_sleep_logs` via on-device matrix engine.
2. **TipTraQ hardware verification** — AHI and SpO₂ from `tiptraq_nights`.
3. **City Lab biomarkers** — L2 blood panel (schema ready; UI shows pending until ingest ships).

## Cursor build prompt

When extending this release, preserve existing `dios-glass` tokens and dark-shell components. Wire new clinical logic through isolated services under `src/lib/unmed/` — never mix algorithmic math with UI controllers. User-facing brand is always **Deepdose**.
