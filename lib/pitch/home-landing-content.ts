/** Stripped mobile-first home landing — one idea per screen. */

import { MARKETING_ROUTES } from '@/lib/pitch/marketing-routes'

export { MARKETING_ROUTES }

export const HOME_LANDING_META = {
  title: 'DIOS — Quantify Your Meds',
  description: 'Your medication has a biological window. DIOS finds it.',
  openGraphTitle: 'DIOS — Quantify Your Meds',
  openGraphDescription: 'Your medication has a biological window. DIOS finds it.',
} as const

export const HOME_PROBLEM = {
  kicker: 'Dose Intelligence OS',
  lines: ['Most people take their meds at the', 'wrong time.'] as const,
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
    points: [
      { label: 'Take it now', text: 'Your optimal window is open.' },
      { label: 'One notification', text: 'The right moment, every day.' },
    ] as const,
    href: MARKETING_ROUTES.howItWorks,
  },
  clinician: {
    who: 'For Clinicians',
    points: [
      { label: 'Triage Board', text: 'See who needs attention this week.' },
      { label: 'PTH Trajectory', text: 'Track hormone trends instantly.' },
      { label: 'Safety Alerts', text: 'Real-time patient risk flags.' },
    ] as const,
    href: MARKETING_ROUTES.clinicians,
  },
} as const

export const HOME_STEPS = {
  headline: ['Three steps.', 'No jargon.'] as const,
  steps: [
    {
      n: '01',
      title: 'Scan your clock',
      detail: '60 seconds. Phone camera. Sleep data. Blood panel if available.',
    },
    {
      n: '02',
      title: 'Map every drug to your window',
      detail: 'Your protocol aligned to your biology. Not a generic schedule.',
    },
    {
      n: '03',
      title: 'Track whether it is working',
      detail: 'One number. Biological progress. Clinician sees it too.',
    },
  ],
} as const

export const HOME_PROOF = {
  headline: ['The science', 'is published.'] as const,
  moreLabel: 'Full evidence library',
  moreHref: MARKETING_ROUTES.science,
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
  headline: ['Quantify', 'your meds.'] as const,
  patient: {
    who: 'Patient',
    line: 'Start measuring your clock',
    detail: 'Free — phone camera',
    href: MARKETING_ROUTES.onboarding,
  },
  clinician: {
    who: 'Clinician',
    line: 'Enrol your first cohort',
    detail: 'Coimbra · Gominak · circadian',
    href: `${MARKETING_ROUTES.clinicians}#cta`,
  },
} as const

