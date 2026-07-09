/** The Fix: consumer story. Clinician pitch lives on /clinician-landing. */

import { DEEPDOSE_NAME } from '@/lib/brand/deepdose-brand'

export const PROBLEM_PAGE_META = {
  title: `The Fix · ${DEEPDOSE_NAME}`,
  description:
    'Non-conformists carry more sleep debt and more scripts. Wrong-time dosing wastes the dose. Max every dose you already take.',
} as const

export const PROBLEM_PAGE_INTRO = {
  eyebrow: 'The Fix',
  titleWhite: 'More scripts.',
  titleAccent: 'Less recovery.',
  lede: `Non-conformists live off the clinic clock. Late nights, stacked meds, thin recovery. The trap: when a dose underperforms, another gets added. ${DEEPDOSE_NAME} breaks that loop by timing what you already take.`,
} as const

export const PROBLEM_PAGE_SECTIONS = [
  {
    id: 'trap',
    title: 'The cascade trap',
    body: 'If a med feels weak, the rational move looks like more medicine. That is a losing game. Wrong hour, weak effect, new script. Timing flips the payoff: same dose, better return, fewer add-ons.',
  },
  {
    id: 'rhythms',
    title: 'Your body still runs on a clock',
    body: 'Blood pressure, glucose, mood chemistry, and sleep hormones shift across 24 hours. A morning label on a late life is often the wrong bet.',
  },
  {
    id: 'subgroups',
    title: 'Highest-risk lives get missed',
    body: 'Late social rhythms, night work, sleep apnea, and polypharmacy travel together. Clinics rarely map that, so meds accumulate while sleep stays broken.',
  },
  {
    id: 'agency',
    title: 'Keep the life. Upgrade the dose.',
    body: 'You should not have to become someone else for medicine to work. Smart dosing respects the life you live and makes each tablet earn its place.',
  },
] as const

export const PROBLEM_PAGE_CASE = {
  title: 'One example',
  body: 'Antidepressant, blood-pressure med, sleep aid. Nights after midnight. Mornings that never recover. Retiming what you already take can change how you feel before anyone adds another script.',
} as const

export const PROBLEM_PAGE_CTA = {
  label: 'Know my risk',
  href: '/profile',
} as const

export const PROBLEM_PAGE_HREF = '/problem' as const

export const PROBLEM_PAGE_HOME_LINK = {
  label: 'The Fix',
  href: PROBLEM_PAGE_HREF,
} as const
