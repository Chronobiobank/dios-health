import { HOME_INSIGHT, HOME_STEPS } from '@/lib/pitch/home-landing-content'
import { MARKETING_ROUTES } from '@/lib/pitch/marketing-routes'

export { MARKETING_ROUTES }

export const HOW_IT_WORKS_META = {
  title: 'How it works — DIOS Dose Intelligence',
  description:
    'A timed dose is the optimal dose. Three steps to scan your clock, map your protocol, and track progress.',
} as const

export const HOW_IT_WORKS_HERO = {
  eyebrow: 'Dose Intelligence OS',
  headline: 'Your biology has a window.',
  headlineEmphasis: 'DIOS finds it.',
  lede: 'Not clock time. Not population averages. Your circadian phase — measured, mapped, and tracked.',
} as const

export const HOW_IT_WORKS_INSIGHT = HOME_INSIGHT

export const HOW_IT_WORKS_STEPS = HOME_STEPS

export const HOW_IT_WORKS_DEMO = {
  label: 'See the live patient demo',
  href: MARKETING_ROUTES.howItWorksDemo,
  detail: 'Sean James daily snapshot — Photonic Age, Chronoimmune spectrum, and next steps.',
} as const

export const HOW_IT_WORKS_CTA = {
  label: 'Start measuring your clock',
  href: MARKETING_ROUTES.onboarding,
  detail: 'Free — 60-second phone scan',
} as const
