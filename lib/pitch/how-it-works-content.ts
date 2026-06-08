import { PATIENT_PREVIEW_ENTRY } from '@/lib/pitch/audience-entry-content'
import { HOME_INSIGHT, HOME_STEPS } from '@/lib/pitch/home-landing-content'
import { MARKETING_ROUTES } from '@/lib/pitch/marketing-routes'

export { MARKETING_ROUTES }

export const HOW_IT_WORKS_META = {
  title: 'How it works — DIOS Dose Intelligence',
  description:
    'Medicine timing matched to your body clock. Scan, map your protocol, and track progress in three steps.',
} as const

export const HOW_IT_WORKS_HERO = {
  eyebrow: 'Dose Intelligence OS',
  headline: 'Your biology has a window.',
  headlineEmphasis: 'DIOS finds it.',
  lede: 'Not the time on the label. Your sleep and light rhythm — measured, mapped, and tracked.',
} as const

export const HOW_IT_WORKS_INSIGHT = HOME_INSIGHT

export const HOW_IT_WORKS_STEPS = HOME_STEPS

export const HOW_IT_WORKS_COHORT = {
  eyebrow: 'Clinician view',
  headline: 'Who needs attention this week?',
  lede: 'Twelve patients sorted red, amber, and green — the same queue your practice sees on Monday morning.',
  triageLink: { label: 'Open full triage demo', href: MARKETING_ROUTES.cliniciansTriage },
} as const

export const HOW_IT_WORKS_DEMO = {
  label: 'See the live patient demo',
  href: MARKETING_ROUTES.howItWorksDemo,
  detail: 'Sean James daily snapshot — body-clock timing guidance, protocol modules, and next steps.',
} as const

export const HOW_IT_WORKS_CTA = {
  label: PATIENT_PREVIEW_ENTRY.ctaLabel,
  href: PATIENT_PREVIEW_ENTRY.href,
  detail: PATIENT_PREVIEW_ENTRY.detail,
} as const
