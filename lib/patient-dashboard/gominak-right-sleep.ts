import { GOMINAK_TARGETS } from '@/lib/dashboard/blood-panel-gominak'
import { formatMinutesLabel, parseDbTimeToMinutes } from '@/lib/dashboard/time-utils'
import { normalizeMinutesFromMidnight } from '@/lib/mlux'

function formatClock(minutes: number): string {
  return formatMinutesLabel(normalizeMinutesFromMidnight(minutes))
}

export const RIGHT_SLEEP_PROTOCOL_LABEL = 'Gominak RightSleep'

export const RIGHT_SLEEP_D3_TARGET =
  `${GOMINAK_TARGETS.vitaminD3.min}–${GOMINAK_TARGETS.vitaminD3.max} nmol/L`

function dlmoMinutes(dlmoEstimate: string): number | null {
  return parseDbTimeToMinutes(dlmoEstimate)
}

/** ~90 minutes before DLMO — evening light curfew (zeitgeber). */
export function rightSleepLightCurfew(dlmoEstimate: string): string {
  const phase = dlmoMinutes(dlmoEstimate)
  if (phase == null) return 'about 90 minutes before your sleep window'
  return formatClock(normalizeMinutesFromMidnight(phase - 90))
}

/** ~10 hours before DLMO — morning light anchor. */
export function rightSleepMorningLight(dlmoEstimate: string): string {
  const phase = dlmoMinutes(dlmoEstimate)
  if (phase == null) return 'within an hour of waking'
  return formatClock(normalizeMinutesFromMidnight(phase - 600))
}

export function rightSleepBaselineBloodsDetail(): string {
  return `Order the Gominak panel (vitamin D, B12, ferritin) and log results — RightSleep starts with a baseline, then retest D monthly until you hold ${RIGHT_SLEEP_D3_TARGET}.`
}

export function rightSleepD3CorrectionDetail(vitaminDValue: string | null): string {
  const reading = vitaminDValue ? ` (${vitaminDValue})` : ''
  return `Your D${reading} is below the RightSleep target (${RIGHT_SLEEP_D3_TARGET}). Titrate dose with your clinician, retest in 4 weeks, and do not push past range without labs.`
}

export function rightSleepBVitaminsDetail(): string {
  return 'Once vitamin D is in range, run the B-complex phase from the RightSleep workbook (multivitamin, then B50 for ~3 months) so gut bacteria and sleep architecture can catch up.'
}
