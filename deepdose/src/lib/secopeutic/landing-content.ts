/** Deepdose marketing — Secopeutic/Maven landing content (dios.health stylesheet classes). */

import { TIPTRAQ_HOME_HOOK } from '@/lib/clinical/tiptraq-program'
import { DEEPDOSE_NAME } from '@/lib/brand/deepdose-brand'

export const DEEPDOSE_LANDING_META = {
  title: `${DEEPDOSE_NAME} — Know your window`,
  description:
    'DeepDose translates your unique biology into a precise treatment plan — timed light, meals, medicines, and sleep.',
} as const

export const DEEPDOSE_LANDING_HERO = {
  headlineWhite: 'Know',
  headlineAccent: 'your window',
  support:
    'DeepDose translates your unique biology into a precise treatment plan, delivering exactly what you need to heal safely and effectively.',
} as const

export const DEEPDOSE_LANDING_PLATFORM = {
  pillars: [
    {
      id: 'quiz',
      label: 'The quiz',
      body: 'Validated chronotype · your phase.',
      icon: 'book' as const,
      panelTitle: 'Chronotype assessment',
      panelSeeAll: { label: 'Start quiz', href: '/login' },
      panelLayout: 'grid' as const,
      panelItems: [
        {
          title: 'A short, validated quiz maps your chronotype — morning or evening phase.',
          meta: 'MEQ-style · Phase identification',
          href: '/login',
        },
        {
          title: 'Output is a biological phase, not a wellness personality label.',
          meta: 'Clinical pathway · Feeds your score',
          href: '/login',
        },
        {
          title: 'Your clinician can see phase alongside medicines and daily cues.',
          meta: 'Shared record · Decision support',
          href: '/login',
        },
      ],
    },
    {
      id: 'score',
      label: 'The score',
      body: 'Alignment 0–100 · act on drift.',
      icon: 'tools' as const,
      panelTitle: 'Alignment score',
      panelSeeAll: { label: 'See your score', href: '/login' },
      panelLayout: 'grid' as const,
      panelHook: TIPTRAQ_HOME_HOOK,
      panelItems: [
        {
          title: 'A 0–100 score from how your daily cues align with your phase.',
          meta: 'Dashboard · Clinician-actionable',
          href: '/login',
        },
        {
          title: 'Window status and drift — when timing is on track or slipping.',
          meta: 'BTI · Open, closed, or critical',
          href: '/login',
        },
        {
          title: 'Optional home sleep test for verified clinical-grade timing data.',
          meta: 'TipTraQ · Three nights · GP programme',
          href: '/login',
        },
      ],
    },
    {
      id: 'dose',
      label: 'The dose',
      body: 'Light, meals, meds, movement, sleep.',
      icon: 'clinics' as const,
      panelTitle: 'Zeitgeber timing doses',
      panelSeeAll: { label: 'Open dashboard', href: '/login' },
      panelLayout: 'grid' as const,
      panelItems: [
        {
          title: 'Morning light — when to get outside.',
          meta: 'Zeitgeber · Sets the day',
          href: '/login',
        },
        {
          title: 'Meals — when to eat to support your clock.',
          meta: 'Zeitgeber · Metabolic timing',
          href: '/login',
        },
        {
          title: 'Medicines and supplements — take it now or wait.',
          meta: 'Dose cards · Phase-adjusted',
          href: '/login',
        },
        {
          title: 'Exercise and sleep — movement and bedtime windows.',
          meta: 'Zeitgeber · Recovery & rest',
          href: '/login',
        },
      ],
    },
  ],
} as const

export const DEEPDOSE_LANDING_CLOSE = {
  headline: 'Find your right time',
  support:
    'Start with a short chronotype quiz, track your daily cues, and see an alignment score your clinician can act on.',
  cta: { label: 'For clinicians', href: '/about' },
  secondaryCta: { label: 'Start your assessment', href: '/login' },
} as const

export const DEEPDOSE_TERMS_DECISION_SUPPORT =
  `Decision support only. ${DEEPDOSE_NAME} suggests the best times for your daily cues — it does not prescribe. Your clinician makes every treatment decision.`

export const DEEPDOSE_NAV_LINKS = [
  { label: 'Research', href: '/research' },
  { label: 'About', href: '/about' },
  { label: 'Sign in', href: '/login' },
] as const
