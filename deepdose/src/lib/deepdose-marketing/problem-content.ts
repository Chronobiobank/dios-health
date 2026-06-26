/** The precision-timing problem — why one-size dosing fails. */

import { DEEPDOSE_NAME } from '@/lib/brand/deepdose-brand'

export const PROBLEM_PAGE_META = {
  title: `The Fix · ${DEEPDOSE_NAME}`,
  description:
    'Drug effect follows circadian biology. Standard dosing schedules hide benefits that appear when timing matches each patient’s clock.',
} as const

export const PROBLEM_PAGE_INTRO = {
  eyebrow: 'The Fix',
  titleWhite: 'Clock time,',
  titleAccent: 'is not body time.',
  lede: `Many diabetes and cardiometabolic medicines vary in effect and safety by time of day. Practice rarely accounts for each patient’s circadian context — ${DEEPDOSE_NAME} turns that gap into actionable timing.`,
} as const

export const PROBLEM_PAGE_SECTIONS = [
  {
    id: 'masking',
    title: 'Standardised dosing hides heterogeneity',
    body: 'Trials and guidelines often fix one clock time for everyone, diluting benefits that show up when dosing matches internal rhythm and daily routines.',
  },
  {
    id: 'rhythms',
    title: 'Key mechanisms are rhythmic',
    body: 'Glucose tolerance, insulin sensitivity, blood pressure, and hormone systems (RAAS, cortisol) shift across 24 hours — changing how drugs work.',
  },
  {
    id: 'subgroups',
    title: 'Highest-risk groups get missed',
    body: 'Non-dippers, nocturnal hypertension, shift workers, sleep apnea, and dawn phenomenon often gain most from tailored timing — yet are rarely flagged in primary care.',
  },
  {
    id: 'barriers',
    title: 'Barriers block adoption',
    body: 'Short visits, adherence worries, and no simple tools push GPs towards one-size instructions instead of individualised chronotherapy.',
  },
] as const

export const PROBLEM_PAGE_OUTCOMES = {
  title: 'Why fixing it helps',
  items: [
    'Matched timing can lower nocturnal BP, blunt morning glucose peaks, and improve side-effect profiles — especially in high cardiovascular risk.',
    'Individual timing respects sleep, meals, and work — improving efficacy without fighting adherence.',
  ],
} as const

export const PROBLEM_PAGE_CLINICIAN = {
  title: 'What clinicians need',
  items: [
    'Quick phenotyping: dipper vs non-dipper, sleep timing, shift work, dawn-risk — without full ambulatory testing.',
    'Evidence-graded rules: per-drug timing impact (high / medium / low) with references and confidence.',
    'EHR-ready support: proposed times, interaction flags, patient preferences recorded.',
    'Trial-ready modules: pragmatic n-of-1 or clinic pilots to build local evidence fast.',
  ],
} as const

export const PROBLEM_PAGE_CASE = {
  title: 'One example',
  body: 'A 58-year-old with type 2 diabetes, dawn fasting glucose, and nocturnal hypertension may benefit from bedtime basal insulin or evening ARB dosing — after simple phenotyping confirms nocturnal BP elevation and sleep timing that supports safe evening doses.',
} as const

export const PROBLEM_PAGE_CTA = {
  label: 'Pilot timing-smart prescriptions',
  href: '/clinician-landing',
} as const

export const PROBLEM_PAGE_HREF = '/problem' as const

export const PROBLEM_PAGE_HOME_LINK = {
  label: 'The Fix',
  href: PROBLEM_PAGE_HREF,
} as const
