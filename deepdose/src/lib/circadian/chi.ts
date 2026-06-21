/**
 * Circadian Health Index (CHI) — clinician-facing composite 0–100 summary.
 * Built from DLMO phase offset, social jet lag, vitamin D (optional), and signal quality.
 * Not the same as Body Clock Alignment (BCA), which measures melatonin vs blackout habits.
 */

export {
  calculateCCS as calculateCHI,
  type CCSInput as CHIInput,
  type CCSResult as CHIResult,
} from './score'

export const CHI_LABEL = 'Circadian Health Index'
export const CHI_ABBREV = 'CHI'
