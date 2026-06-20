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
    description: 'Morning light reaches the retina and sets the master clock (SCN), the timekeeper every other rhythm follows.',
  },
  {
    id: 'meals',
    label: 'Nutrient Dose',
    shortLabel: 'Nutrient',
    cue: 'Food',
    description: 'Meal timing entrains the peripheral clocks in your liver and gut, shaping insulin response and glucose control.',
  },
  {
    id: 'meds',
    label: 'Biomedical Dose',
    shortLabel: 'Biomedical',
    cue: 'Medicines & supplements',
    description: 'Absorption, metabolism, and clearance shift across the day, so timing changes both efficacy and side effects.',
  },
  {
    id: 'exercise',
    label: 'Physiological Dose',
    shortLabel: 'Physiological',
    cue: 'Movement',
    description: 'Movement raises core temperature and cortisol, reinforcing the clock and driving cardiovascular repair.',
  },
  {
    id: 'cognition',
    label: 'Neurological Dose',
    shortLabel: 'Neurological',
    cue: 'Focus & mindfulness',
    description: 'Alertness and dopamine peak through the day; a mindful evening downshift lowers cortisol before sleep.',
  },
  {
    id: 'sleep',
    label: 'Blackout Dose',
    shortLabel: 'Blackout',
    cue: 'Darkness',
    description: 'Darkness triggers melatonin release, the signal for deep sleep, tissue repair, and overnight recovery.',
  },
] as const

/** Plain-language list for marketing — no jargon */
export const ZEITGEBER_PLAIN_LIST =
  'light, food, medicines, movement, focus, and darkness'

/** One-line education: zeitgeber → dose */
export const DOSE_ZEITGEBER_EDUCATION =
  'Chronobiologists call these zeitgebers — daily time cues. Deepdose calls each one a dose.'

export const DOSE_INTELLIGENCE_TAGLINE_SUPPORT =
  'Dose intelligence means timing every cue that sets your body clock — not just tablets.'
