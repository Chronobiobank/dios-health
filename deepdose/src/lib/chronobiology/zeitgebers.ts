/**
 * Zeitgebers — daily cues that entrain the body clock.
 * Deepdose uses "dose" broadly: each timed cue, not medicines alone.
 */

export type ZeitgeberId = 'light' | 'meals' | 'meds' | 'exercise' | 'sleep'

export type ZeitgeberDomain = {
  id: ZeitgeberId
  label: string
  shortLabel: string
  description: string
}

export const ZEITGEBER_DOMAINS: readonly ZeitgeberDomain[] = [
  {
    id: 'light',
    label: 'Light',
    shortLabel: 'Light',
    description: 'Morning daylight and a dim evening help set melatonin timing.',
  },
  {
    id: 'meals',
    label: 'Meals',
    shortLabel: 'Meals',
    description: 'When you eat anchors your metabolic clock through the day.',
  },
  {
    id: 'meds',
    label: 'Medicines & supplements',
    shortLabel: 'Meds & supps',
    description: 'Tablets and supplements work better at the right phase of your day.',
  },
  {
    id: 'exercise',
    label: 'Exercise',
    shortLabel: 'Exercise',
    description: 'Movement is a strong daily cue — timing matters for recovery and sleep.',
  },
  {
    id: 'sleep',
    label: 'Sleep',
    shortLabel: 'Sleep',
    description: 'Bedtime and wake time are the anchor for every other cue.',
  },
] as const

/** Plain-language list for marketing — no jargon */
export const ZEITGEBER_PLAIN_LIST =
  'light, meals, medicines and supplements, exercise, and sleep'

/** One-line education: zeitgeber → dose */
export const DOSE_ZEITGEBER_EDUCATION =
  'Chronobiologists call these zeitgebers — daily time cues. Deepdose calls each one a dose.'

export const DOSE_INTELLIGENCE_TAGLINE_SUPPORT =
  'Dose intelligence means timing every cue that sets your body clock — not just tablets.'
