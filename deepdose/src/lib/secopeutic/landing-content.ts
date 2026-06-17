/** Deepdose marketing — Secopeutic/Maven landing content (dios.health stylesheet classes). */

import { DEEPDOSE_NAME } from '@/lib/brand/deepdose-brand'
import { LANDING_CLINICIANS } from '@/lib/secopeutic/landing-clinicians'

export const DEEPDOSE_LANDING_META = {
  title: `${DEEPDOSE_NAME} — Precision chronotherapy`,
  description:
    'Patient-owned chronobiobank with evidence-graded medication timing windows from your circadian biology.',
} as const

export const DEEPDOSE_LANDING_HERO = {
  headlineLead: 'Learn',
  headlineAccent: 'Precision Timing',
  headlineSub: 'from your biology',
  support:
    'Our clinical-grade tools align each dose to your chronotype, DLMO, and wearable rhythm — not a generic alarm.',
} as const

export const DEEPDOSE_LANDING_PLATFORM = {
  pillars: [
    {
      id: 'learn',
      label: 'How it works',
      body: 'Consent, chronotype, dosing.',
      icon: 'book' as const,
      panelTitle: 'Evidence for patients',
      panelSeeAll: { label: 'See all', href: '/about' },
      panelLayout: 'grid' as const,
      panelItems: [
        {
          title: 'Dynamic consent before any data use.',
          meta: 'Onboarding · UK GDPR',
          href: '/login',
          clinicians: [LANDING_CLINICIANS.munro],
        },
        {
          title: 'MCTQ chronotype maps your biological night.',
          meta: 'Rhythm · DLMO estimate',
          href: '/login',
          clinicians: [LANDING_CLINICIANS.roenneberg],
        },
        {
          title: 'Eight BNF-aligned chronotherapy medications.',
          meta: 'Dosing · Phase-adjusted windows',
          href: '/login',
          clinicians: [LANDING_CLINICIANS.hermida, LANDING_CLINICIANS.levi],
        },
        {
          title: 'Circadian score tracks alignment over time.',
          meta: 'Dashboard · 0–100 scale',
          href: '/login',
          clinicians: [LANDING_CLINICIANS.foster, LANDING_CLINICIANS.munro],
        },
      ],
    },
    {
      id: 'tools',
      label: 'Your windows',
      body: 'Dashboard and dosing cards.',
      icon: 'tools' as const,
      panelTitle: `This week on ${DEEPDOSE_NAME}`,
      panelSeeAll: { label: 'Open dashboard', href: '/login' },
      panelLayout: 'grid' as const,
      panelItems: [
        {
          title: 'Medication cards with open/closed windows.',
          meta: 'Take it now · Window closed',
          href: '/login',
          clinicians: [LANDING_CLINICIANS.pigazzani],
        },
        {
          title: 'Phase offset from your DLMO.',
          meta: 'Timing · ± minutes',
          href: '/login',
          clinicians: [LANDING_CLINICIANS.roenneberg],
        },
        {
          title: 'Biological time vs clock time.',
          meta: 'BTI · Relative HH:MM',
          href: '/login',
          clinicians: [LANDING_CLINICIANS.foster],
        },
        {
          title: 'Evidence grade per medication.',
          meta: 'Chronopharmacology · A/B/C',
          href: '/about',
          clinicians: [LANDING_CLINICIANS.hermida, LANDING_CLINICIANS.levi],
        },
      ],
    },
    {
      id: 'clinics',
      label: 'Smart devices',
      body: 'Oura, Whoop, Apple Health.',
      icon: 'clinics' as const,
      panelTitle: 'Connected rhythm sources',
      panelSeeAll: { label: 'Learn more', href: '/about' },
      panelLayout: 'grid' as const,
      panelItems: [
        {
          title: 'Oura sleep stream — onset, wake, deep, REM.',
          meta: 'Core tier · OAuth consent',
          href: '/about',
          clinicians: [LANDING_CLINICIANS.foster],
        },
        {
          title: 'Whoop HRV and recovery signals.',
          meta: 'Core tier · Daily average',
          href: '/about',
          clinicians: [LANDING_CLINICIANS.munro],
        },
        {
          title: 'Apple HealthKit light and sleep.',
          meta: 'Core tier · User-authorized',
          href: '/about',
          clinicians: [LANDING_CLINICIANS.roenneberg],
        },
        {
          title: 'TipTraQ premium clinical-grade sleep.',
          meta: 'Premium · SpO₂ and respiratory',
          href: '/about',
          clinicians: [LANDING_CLINICIANS.munro, LANDING_CLINICIANS.foster],
        },
      ],
    },
  ],
} as const

export const DEEPDOSE_LANDING_CLOSE = {
  headline: 'Start with consent. Own your rhythm.',
  support: 'Onboard in minutes — consent, MCTQ chronotype, then your medication list.',
  cta: { label: 'Start onboarding', href: '/login' },
  secondaryCta: { label: `About ${DEEPDOSE_NAME}`, href: '/about' },
} as const

export const DEEPDOSE_LANDING_DISCLAIMER =
  `Decision support only. ${DEEPDOSE_NAME} surfaces timing windows from your data — it does not prescribe. Your clinician owns every treatment decision.`

export const DEEPDOSE_NAV_LINKS = [
  { label: 'About', href: '/about' },
  { label: 'Sign in', href: '/login' },
] as const
