/** Stripped mobile-first home landing — one idea per screen. */

import { MARKETING_ROUTES } from '@/lib/pitch/marketing-routes'

export { MARKETING_ROUTES }

export const HOME_LANDING_META = {
  title: 'DIOS — Optimise Your Script',
  description: 'Your medication has a biological window. DIOS finds it.',
  openGraphTitle: 'DIOS — Optimise Your Script',
  openGraphDescription: 'Your medication has a biological window. DIOS finds it.',
} as const

export const HOME_HERO = {
  tagline: ['Optimise', 'Your Script.'] as const,
  video: '/optimise-your-script.mp4',
  poster: '/your-light-dose.jpg',
} as const

export const HOME_PROBLEM = {
  eyebrow: 'The problem',
  headline: ['Med routines are', 'standardised guesswork.'] as const,
  emphasisLine: 1,
  primaryCta: { label: 'Fix it', href: MARKETING_ROUTES.onboarding },
  secondaryCta: { label: 'How', href: MARKETING_ROUTES.howItWorks },
} as const

export const HOME_INSIGHT = {
  headline: 'Optimal dosing syncs with your',
  headlineEmphasis: 'body clock.',
  statement: 'Med labels are the same for everyone. We match the dose to suit your body.',
  ctaLabel: 'Why body clocks matter',
  ctaHref: MARKETING_ROUTES.howItWorks,
} as const

export const HOME_AUDIENCE = {
  headline: ['One App.', 'Two Views.'] as const,
  patient: {
    who: 'For Patients',
    line: 'Take it now. Your window is open.',
    href: MARKETING_ROUTES.howItWorks,
  },
  clinician: {
    who: 'For Clinicians',
    line: 'Who needs attention this week?',
    href: MARKETING_ROUTES.clinicians,
  },
} as const

export const HOME_STEPS = {
  headline: ['Three steps.', 'No jargon.'] as const,
  steps: [
    { n: '01', line: 'Scan your clock in 60 seconds.' },
    { n: '02', line: 'Every drug timed to your biology.' },
    { n: '03', line: 'Track progress in one number.' },
  ],
  walkthroughCta: { label: 'Full walkthrough', href: MARKETING_ROUTES.howItWorks },
} as const

export const HOME_PROOF = {
  headline: ['The science', 'is published.'] as const,
  ctaLabel: 'Read the evidence',
  ctaHref: MARKETING_ROUTES.science,
  soundbites: [
    'Same drug at bedtime — 45% fewer cardiovascular events.',
    'Timed chemotherapy — toxicity cut fivefold.',
    'Light patterns predict heart disease and mortality.',
    'Stimulant timing matters — body clock delayed 45–90 minutes.',
  ] as const,
  cards: [
    {
      ref: 'Hermida et al. — n=19,084',
      finding: 'Bedtime antihypertensives cut cardiovascular events by 45%. Same drug. Different moment.',
      emphasis: '45%',
      doi: 'https://doi.org/10.1093/eurheartj/ehz754',
    },
    {
      ref: 'Levi et al. — The Lancet — n=186',
      finding: 'Timed chemotherapy cut toxicity fivefold. Response nearly doubled.',
      emphasis: 'fivefold',
      doi: 'https://doi.org/10.1016/S0140-6736(97)03358-8',
    },
    {
      ref: 'UK Biobank — n=89,000',
      finding: 'Light-dark patterns predict cardiovascular disease and all-cause mortality.',
      emphasis: 'cardiovascular disease',
      doi: 'https://doi.org/10.1073/pnas.2200325119',
    },
    {
      ref: 'Frontera-Pons et al. — 2025',
      finding: 'ADHD DLMO delayed 45–90 minutes. Stimulant timing matters clinically.',
      emphasis: '45–90 minutes',
      doi: 'https://doi.org/10.3389/fpsyt.2025.1697900',
    },
  ],
} as const

export const HOME_CTA = {
  headline: ['Optimise', 'your script.'] as const,
  patient: {
    who: 'Patient',
    line: 'Track your clock',
    detail: 'Free — phone camera',
    href: MARKETING_ROUTES.onboarding,
  },
  clinician: {
    who: 'Clinician',
    line: 'Enrol your cohort',
    detail: 'Primary care · specialists',
    href: `${MARKETING_ROUTES.clinicians}#cta`,
  },
} as const

