/** Deepdose marketing — Secopeutic/Maven landing content (dios.health stylesheet classes). */

import {
  DOSE_ZEITGEBER_EDUCATION,
  ZEITGEBER_PLAIN_LIST,
} from '@/lib/chronobiology/zeitgebers'
import { TIPTRAQ_HOME_HOOK } from '@/lib/clinical/tiptraq-program'
import { DEEPDOSE_NAME } from '@/lib/brand/deepdose-brand'
import { LANDING_CLINICIANS } from '@/lib/secopeutic/landing-clinicians'

export const DEEPDOSE_LANDING_META = {
  title: `${DEEPDOSE_NAME} — Why timing matters`,
  description:
    `Learn the best time for ${ZEITGEBER_PLAIN_LIST} from your body clock — with your clinician.`,
} as const

export const DEEPDOSE_LANDING_HERO = {
  headline: 'Why Timing Matters',
  support:
    'Your body clock sets the best time for your habits — we use advanced tracking tools to optimise your goals.',
} as const

export const DEEPDOSE_LANDING_PLATFORM = {
  pillars: [
    {
      id: 'learn',
      label: 'The idea',
      body: 'Consent, quiz, clock, cues, and score.',
      icon: 'book' as const,
      panelTitle: 'What is a dose?',
      panelSeeAll: { label: 'See all', href: '/about' },
      panelLayout: 'grid' as const,
      panelItems: [
        {
          title: 'You choose what data we can use.',
          meta: 'Consent first · UK GDPR',
          href: '/login',
          clinicians: [LANDING_CLINICIANS.munro],
        },
        {
          title: 'A short quiz maps whether you are a morning or night person.',
          meta: 'Body clock · Sleep pattern',
          href: '/login',
          clinicians: [LANDING_CLINICIANS.roenneberg],
        },
        {
          title: DOSE_ZEITGEBER_EDUCATION,
          meta: `Light · Meals · Meds · Movement · Sleep`,
          href: '/about',
          clinicians: [LANDING_CLINICIANS.foster, LANDING_CLINICIANS.roenneberg],
        },
        {
          title: 'A simple score shows how aligned your daily cues are.',
          meta: 'Dashboard · 0–100',
          href: '/login',
          clinicians: [LANDING_CLINICIANS.foster, LANDING_CLINICIANS.munro],
        },
      ],
    },
    {
      id: 'tools',
      label: 'The dose',
      body: 'Light, meals, meds, movement, and sleep.',
      icon: 'tools' as const,
      panelTitle: `Timed cues on your ${DEEPDOSE_NAME} dashboard`,
      panelSeeAll: { label: 'Open dashboard', href: '/login' },
      panelLayout: 'grid' as const,
      panelItems: [
        {
          title: 'Morning light — when to get outside.',
          meta: 'Zeitgeber · Sets the day',
          href: '/login',
          clinicians: [LANDING_CLINICIANS.foster],
        },
        {
          title: 'Meals — when to eat to support your clock.',
          meta: 'Zeitgeber · Metabolic timing',
          href: '/login',
          clinicians: [LANDING_CLINICIANS.roenneberg],
        },
        {
          title: 'Medicines and supplements — take it now or wait.',
          meta: 'Dose cards · Phase-adjusted',
          href: '/login',
          clinicians: [LANDING_CLINICIANS.pigazzani, LANDING_CLINICIANS.hermida],
        },
        {
          title: 'Exercise and sleep — movement and bedtime windows.',
          meta: 'Zeitgeber · Recovery & rest',
          href: '/login',
          clinicians: [LANDING_CLINICIANS.munro, LANDING_CLINICIANS.foster],
        },
      ],
    },
    {
      id: 'clinics',
      label: 'The test',
      body: 'GP advised kit, three nights, quarterly.',
      icon: 'clinics' as const,
      panelTitle: 'What to expect from a home sleep test',
      panelHook: TIPTRAQ_HOME_HOOK,
      panelSeeAll: { label: 'Patient sign in', href: '/login' },
      panelLayout: 'grid' as const,
      panelItems: [
        {
          title: 'Your GP recommends a kit — you wear it for three nights at home.',
          meta: '£149 · About half a typical private test',
          href: '/login',
          clinicians: [LANDING_CLINICIANS.munro, LANDING_CLINICIANS.foster],
        },
        {
          title: 'Your clinician adds the report — your dashboard updates.',
          meta: `Timing for ${ZEITGEBER_PLAIN_LIST}`,
          href: '/login',
          clinicians: [LANDING_CLINICIANS.munro, LANDING_CLINICIANS.foster],
        },
        {
          title: 'Check again every three months — like a routine blood test.',
          meta: '£99 per check · Track changes over time',
          href: '/login',
          clinicians: [LANDING_CLINICIANS.munro],
        },
        {
          title: 'Free kit if you join our research programme.',
          meta: 'Anonymous data · You stay in control',
          href: '/about',
          clinicians: [LANDING_CLINICIANS.munro, LANDING_CLINICIANS.foster],
        },
        {
          title: 'Oura Ring — sleep, heart rate, recovery.',
          meta: 'Wearable · Good accuracy',
          href: '/about',
          clinicians: [LANDING_CLINICIANS.foster],
        },
        {
          title: 'Whoop — strain, sleep, and recovery.',
          meta: 'Wearable · Daily tracking',
          href: '/about',
          clinicians: [LANDING_CLINICIANS.munro],
        },
        {
          title: 'Apple Health — sleep and activity from your phone.',
          meta: 'Wearable · Connect in app',
          href: '/about',
          clinicians: [LANDING_CLINICIANS.roenneberg],
        },
      ],
    },
  ],
} as const

export const DEEPDOSE_LANDING_CLOSE = {
  headline: 'Start your precision dosing regimen today',
  support:
    'Sign up in minutes — agree how we use your data, answer a short sleep quiz, then add your medicines and daily cues.',
  cta: { label: 'Start onboarding', href: '/login' },
  secondaryCta: { label: `About ${DEEPDOSE_NAME}`, href: '/about' },
} as const

export const DEEPDOSE_TERMS_DECISION_SUPPORT =
  `Decision support only. ${DEEPDOSE_NAME} suggests the best times for your daily cues — it does not prescribe. Your clinician makes every treatment decision.`

export const DEEPDOSE_NAV_LINKS = [
  { label: 'About', href: '/about' },
  { label: 'Sign in', href: '/login' },
] as const
