/**
 * Zeitgebers — daily cues that entrain the body clock.
 * Deepdose uses "dose" broadly: each timed cue, not medicines alone.
 */

export type ZeitgeberId = 'light' | 'meals' | 'meds' | 'exercise' | 'cognition' | 'sleep'

export type ZeitgeberDomain = {
  id: ZeitgeberId
  /** Deepdose ecosystem name, e.g. "Sunlight Dose" */
  label: string
  /** Short ecosystem name, e.g. "Sunlight" */
  shortLabel: string
  /** Everyday cue this dose times, e.g. "Light" */
  cue: string
  description: string
}

export const ZEITGEBER_DOMAINS: readonly ZeitgeberDomain[] = [
  {
    id: 'light',
    label: 'Sunlight Dose',
    shortLabel: 'Sunlight',
    cue: 'Light',
    description: 'Morning daylight and a dim evening set your melatonin timing.',
  },
  {
    id: 'meals',
    label: 'Nutrient Dose',
    shortLabel: 'Nutrient',
    cue: 'Food',
    description: 'When you eat anchors your metabolic clock through the day.',
  },
  {
    id: 'meds',
    label: 'Biomedical Dose',
    shortLabel: 'Biomedical',
    cue: 'Medicines & supplements',
    description: 'Tablets and supplements work better at the right phase of your day.',
  },
  {
    id: 'exercise',
    label: 'Physiological Dose',
    shortLabel: 'Physiological',
    cue: 'Movement',
    description: 'Movement is a strong daily cue, and timing shapes recovery and sleep.',
  },
  {
    id: 'cognition',
    label: 'Neurological Dose',
    shortLabel: 'Neurological',
    cue: 'Focus & mindfulness',
    description: 'Deep focus and mindful rest land best at the right point in your day.',
  },
  {
    id: 'sleep',
    label: 'Moonlight Dose',
    shortLabel: 'Moonlight',
    cue: 'Sleep',
    description: 'Bedtime and wake time are the anchor for every other dose.',
  },
] as const

/** Plain-language list for marketing — no jargon */
export const ZEITGEBER_PLAIN_LIST =
  'light, food, medicines, movement, focus, and sleep'

/** One-line education: zeitgeber → dose */
export const DOSE_ZEITGEBER_EDUCATION =
  'Chronobiologists call these zeitgebers — daily time cues. Deepdose calls each one a dose.'

export const DOSE_INTELLIGENCE_TAGLINE_SUPPORT =
  'Dose intelligence means timing every cue that sets your body clock — not just tablets.'
