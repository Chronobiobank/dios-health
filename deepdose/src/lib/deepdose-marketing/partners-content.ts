/** Research & industry partnership · addiction healthcare, SSA, NIHR alignment. */

import { DEEPDOSE_NAME } from '@/lib/brand/deepdose-brand'
import {
  CHRONOBIOBANK_SCIENCE_HREF,
  TECHNOLOGY_DLMO_PROXY_HREF,
} from '@/lib/deepdose-marketing/site-nav-links'

export const PARTNERS_PAGE_META = {
  title: `Research partners · ${DEEPDOSE_NAME}`,
  description:
    'Smartphone-delivered circadian phase tracking for addiction treatment and recovery research · passive signals, governed cohorts, and clinical validation for community drug and alcohol services.',
} as const

export const PARTNERS_PAGE_INTRO = {
  eyebrow: 'Research partners',
  titleWhite: 'Timing at',
  titleAccent: 'relapse risk',
  lede: 'Phase tracking for addiction care and recovery research.',
} as const

export const PARTNERS_ALIGNMENT_TILES = [
  {
    id: 'smartphone',
    badge: 'Delivery',
    cue: '#acd3de',
    title: 'Smartphone-delivered support',
    teaser:
      'Continuous passive capture · light, movement, sleep timing, social jet lag, without daily questionnaires. Matches the UK push for digital treatment tools people already carry.',
  },
  {
    id: 'relapse',
    badge: 'Mechanism',
    cue: '#c9b6f2',
    title: 'Circadian disruption & relapse',
    teaser:
      'Irregular sleep and phase drift precede craving and return to use in published addiction science. Phase-aware prompts target the window when timing support may matter most.',
  },
  {
    id: 'community',
    badge: 'Population',
    cue: '#f2b8a2',
    title: 'Community treatment settings',
    teaser:
      'Polypharmacy, chaotic sleep, and real-world adherence, not idealised trial beds. Proxy DLMO from wearables, TipTraQ validation when clinical grade is needed, clinician-shared records.',
  },
  {
    id: 'data',
    badge: 'Governance',
    cue: '#8b9cf8',
    title: 'Federated research data',
    teaser:
      'Chronobiobank keeps intimate sleep architecture on-device; consent-gated aggregates for studies, aligned with the national addiction healthcare data roadmap.',
  },
] as const

export const PARTNERS_INSTRUMENT = {
  label: 'Research instrument',
  cue: '#acd3de',
  title: 'From wellness signal to study-grade readout',
  body:
    'Layer 1–2 estimate proxy DLMO continuously on-device. Layer 3 upgrades with TipTraQ for validated sleep staging and respiratory traces. Outputs · Biological Time Index, body-clock alignment, dosing windows · are structured for endpoints, not engagement metrics alone.',
  links: [
    { label: 'Technology stack', href: '/technology' },
    { label: 'Proxy DLMO methodology', href: TECHNOLOGY_DLMO_PROXY_HREF },
    { label: 'Science & trust', href: CHRONOBIOBANK_SCIENCE_HREF },
  ],
} as const

export const PARTNERS_COLLABORATION = {
  label: 'Industry partnership',
  cue: '#c9b6f2',
  title: 'Built for doctoral and fellowship programmes',
  body:
    `${DEEPDOSE_NAME} is opening industry partnerships with UK universities for addiction healthcare research, including SSA Flagship schemes, NIHR career development, and MRC fellowship routes under Addiction Healthcare Goals. We provide the platform, passive phase instrumentation, governed data access, and clinical validation path; academic leads own protocol, ethics, and publication.`,
  beats: [
    'Hypothesis-led studies in community drug and alcohol treatment',
    'Endpoints: phase drift, sleep regularity, window adherence, relapse proximity',
    'Dynamic consent and UK GDPR · model weights isolated from participant UI',
    'Training and dissemination with clinicians and recovery workers',
  ],
} as const

export const PARTNERS_PAGE_CTA = {
  primary: { label: 'Science & trust', href: CHRONOBIOBANK_SCIENCE_HREF },
  note:
    'Academic or clinical collaboration enquiries: contact the founder via About. We do not claim government endorsement · we align with published Addiction Healthcare Goals priorities.',
} as const
