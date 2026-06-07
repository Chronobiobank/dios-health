import { SEAN_DINA_PATIENT } from '@/lib/coach/dina-scenarios'
import { formatMinutesLabel } from '@/lib/dashboard/time-utils'

/** Fixed Sean James demo context for public DINA scenario API — no patient PII. */
export function buildSeanDemoCoachContext(): string {
  const dlmoMinutes = 22 * 60 + 57
  const phaseLabel = formatMinutesLabel(dlmoMinutes)

  return `DEMO PATIENT: ${SEAN_DINA_PATIENT.name}
DLMO (body-clock night start): ${SEAN_DINA_PATIENT.dlmo}
Precision: CONFIRMED (TipTraQ + First Light scan)

Today's stack:
- Thyroid tablet — morning, before D3 (empty stomach window ~7:15)
- Vitamin D3 — morning, 30 min after thyroid tablet
- Magnesium — evening ~21:00 (moved from morning to avoid competition)
- Statin (atorvastatin) — night window ~21:45 (liver synthesis peak)
- Blood pressure tablet (ramipril) — evening ~21:30 (overnight dipping)
- Bone tablet (alendronate) — weekly morning, empty stomach
- Calcium — separate from bone tablet by at least 2 hours

Scenario rules you must follow:
- Plain English only. No pharmacological jargon.
- Maximum 3 sentences per response.
- No exclamation marks.
- Never diagnose or change prescriptions — encourage GP discussion when needed.
- Quote times from this schedule when relevant.

MLux phase time: ${phaseLabel} (CONFIRMED)`
}
