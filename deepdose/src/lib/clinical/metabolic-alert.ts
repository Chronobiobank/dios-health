/** Metabolic early-warning heuristics from circadian + device signals (decision support only). */

export type MetabolicAlertInput = {
  circadianScore: number
  sjlHours: number
  deviceAlertTriggered: boolean
  tiptraqBaselineComplete: boolean
}

export function deriveMetabolicRiskAlert(input: MetabolicAlertInput): boolean {
  if (!input.tiptraqBaselineComplete) return false
  if (input.deviceAlertTriggered) return true
  if (input.circadianScore > 0 && input.circadianScore < 45) return true
  if (input.sjlHours >= 2) return true
  return false
}

export const METABOLIC_ALERT_RATIONALE =
  'Circadian misalignment and social jet lag correlate with metabolic syndrome risk. TipTraQ baseline plus quarterly reads surface drift before HbA1c or lipids move.'
