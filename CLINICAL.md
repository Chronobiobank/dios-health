# DIOS — Clinical infrastructure statement

## Platform purpose

**DIOS (Dose Intelligence Operating System)** is foundational infrastructure for **Dose Intelligence**: measuring each patient’s circadian light biology (Melanopic Lux, MLux), deriving a personal body-clock phase, and aligning medication and zeitgeber protocols to that phase.

DIOS is **clinical decision support**, not a diagnostic device in isolation. It helps clinicians and patients act on published chronotherapy evidence with patient-specific timing.

## Intended clinical use

- **Primary users:** Patients (self-management via Mel) and licensed clinicians (review, prescribe, monitor).
- **Inputs:** Smartphone camera session (Layer 1 — Mel), optional blood circadian panels (Layer 2), optional TipTraQ sleep/ANS nights (Layer 3).
- **Outputs:** MLux phase time estimate, Circadian Desynchrony Spectrum node scores, timed medication and light/meal/movement cues, adherence logging.
- **Setting:** Community and primary care in the UK and compatible jurisdictions; designed for NHS integration discussions with clear data-governance boundaries.

## Data integrity and patient safety

1. **Layered confidence** — Outputs are labelled ESTIMATED, PRECISION, or CONFIRMED according to active data layers. The UI presents risk (magenta), optimal (orange), and informational blue tones as **informative**, not alarmist.
2. **Consent** — Chronobiobank clinical use is required; research contribution is optional and revocable. Consent records are stored separately from raw streams.
3. **Session integrity** — Melanopic engagement sessions (`mel_sessions`, table `vaya_sessions`) are append-only engagement logs for audit and model improvement governance.
4. **No silent substitution** — When ElevenLabs, Deepgram, or camera access is unavailable, Mel degrades to text input; sessions remain usable.
5. **Human in the loop** — Protocol cards and spectrum nodes support clinician review; DIOS does not autonomously change prescribed medicines.

## Regulatory considerations (non-exhaustive)

- Classify intended use with local **SaMD / CDS** frameworks before deployment beyond research demos.
- Maintain **UK GDPR** lawful basis, DPIA, and processor agreements for Supabase, Vercel, Anthropic, Deepgram, and ElevenLabs where enabled.
- Preserve **audit trails** for dose confirmations and consultation exports shown in the clinician panel.
- Validate algorithm changes against documented MLux and phase-time methodology (`/evidence/tiptraq`).

## Institutional trust

This document is the primary reference for NHS, research, and pharma partners evaluating DIOS as **infrastructure** — not a single-feature app. Technical module boundaries are described in `lib/dios/README.md`.

**Optimise Your Script.**
