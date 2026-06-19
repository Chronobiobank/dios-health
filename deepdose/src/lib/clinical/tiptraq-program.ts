/**
 * TipTraQ GP program — clinician acquisition wedge for DeepDose.
 * 3-night baseline kit → precision dosing profile → quarterly re-read (Gominak panel cadence).
 */

export const TIPTRAQ_BASELINE_NIGHTS = 3

/** Quarterly review after baseline — mirrors recurring blood-panel cadence */
export const TIPTRAQ_REVIEW_INTERVAL_DAYS = 90

/**
 * UK disruptive pricing vs WatchPAT 3-night rental (~£295) and clinic packages (£600–£900).
 */
export const TIPTRAQ_STUDY_PRICING_UK = {
  currency: 'GBP' as const,
  baselineGbp: 149,
  quarterlyRereadGbp: 99,
  /** UK competitor anchor — WatchPAT 3-night rental */
  ukWatchPat3NightGbp: 295,
  includes: [
    'Reusable device setup and home onboarding',
    'Multi-night capture (3-night baseline or quarterly re-read)',
    'FDA-cleared AI sleep staging and respiratory analysis',
    'Clinician review workflow — precision dosing profile in DeepDose',
  ],
} as const

/** Home page — patients who order on GP advice; clinician uploads results */
export const TIPTRAQ_HOME_HOOK =
  'If your GP suggests a home sleep test: three nights at home for £149 — about half a typical private test. Your clinician adds your results to Deepdose; we show the best times for light, meals, medicines, exercise, and sleep on your dashboard. Check again every three months, like a blood test. Free if you join our research programme.'

export function formatTipTraqBaselineFee(): string {
  return `£${TIPTRAQ_STUDY_PRICING_UK.baselineGbp}`
}

export function formatTipTraqQuarterlyFee(): string {
  return `£${TIPTRAQ_STUDY_PRICING_UK.quarterlyRereadGbp}`
}

export function formatTipTraqStudyFeeRange(): string {
  const { baselineGbp, quarterlyRereadGbp } = TIPTRAQ_STUDY_PRICING_UK
  return `${formatTipTraqBaselineFee()} baseline · ${formatTipTraqQuarterlyFee()} quarterly`
}

export function formatTipTraqStudyFeeCaption(): string {
  return `${formatTipTraqBaselineFee()} for 3 nights · ${formatTipTraqQuarterlyFee()} quarterly re-read`
}

export type TipTraqAssessmentStatus =
  | 'kit_ordered'
  | 'baseline_in_progress'
  | 'baseline_complete'
  | 'review_due'
  | 'review_complete'

export const TIPTRAQ_GP_VALUE_PROPOSITION = {
  headline: 'TipTraQ — your clinical entry point',
  subline:
    'Order a home sleep kit. Three nights sets each patient\'s dosing baseline. Quarterly re-reads profile metabolic drift before it shows in labs.',
  trojanHorse:
    '£149 for three nights — half what WatchPAT rental costs — with a precision dosing profile, not just an AHI score. Patients who opt into research can get it free.',
  baseline:
    'Three consecutive nights at home — medical-grade SpO₂, respiratory events, and sleep staging establish DLMO and chronotype for BTI windows.',
  quarterly:
    'Re-order the kit every quarter (like Gominak blood panels) to refresh the patient profile and catch circadian drift.',
  metabolic:
    'Metabolic early warning when social jet lag, circadian misalignment, or sync gaps suggest insulin resistance and cardiovascular timing risk.',
  outputs: [
    'Verified clinical-grade patient badge',
    'Personalised medication timing windows',
    'Quarterly review queue in triage',
    'Metabolic drift alerts for proactive GP outreach',
  ],
} as const

export function nextQuarterlyReviewFrom(iso: string): string {
  const d = new Date(iso)
  d.setDate(d.getDate() + TIPTRAQ_REVIEW_INTERVAL_DAYS)
  return d.toISOString()
}

export function assessmentStatusFromNights(
  nightsRecorded: number,
  currentStatus: TipTraqAssessmentStatus
): TipTraqAssessmentStatus {
  if (currentStatus === 'kit_ordered' && nightsRecorded > 0) {
    return 'baseline_in_progress'
  }
  if (nightsRecorded >= TIPTRAQ_BASELINE_NIGHTS) {
    return 'baseline_complete'
  }
  return currentStatus
}

export function isReviewDue(nextReviewAt: string | null): boolean {
  if (!nextReviewAt) return false
  return new Date(nextReviewAt).getTime() <= Date.now()
}
