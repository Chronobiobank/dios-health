/** Deepdose marketing — Secopeutic/Maven landing content (dios.health stylesheet classes). */

import { DEEPDOSE_NAME } from '@/lib/brand/deepdose-brand'
import { DEEPDOSE_RESEARCH_PAPERS } from '@/lib/secopeutic/research-content'

export const DEEPDOSE_LANDING_META = {
  title: `${DEEPDOSE_NAME} · Know your window`,
  description:
    'DeepDose translates your biology into a precise treatment plan: timed light, meals, medicines, and sleep.',
} as const

export const DEEPDOSE_LANDING_HERO = {
  eyebrow: 'Chronotherapy',
  headlineWhite: 'Optimise',
  headlineAccent: 'your window',
  support:
    'DeepDose translates your unique biology into a precise treatment plan, delivering exactly what you need to heal.',
} as const

const EVIDENCE_PAPER_IDS = ['hermida-2020', 'pigazzani-2024', 'wallace-2003'] as const

export const DEEPDOSE_LANDING_EVIDENCE = {
  eyebrow: 'The evidence',
  headline: 'Timing is a clinical variable',
  support:
    'Decades of chronotherapy research show the same dose can do more, or harm less, depending on when it meets your body clock.',
  seeAll: { label: 'All research', href: '/research' },
  papers: EVIDENCE_PAPER_IDS.map(
    (id) => DEEPDOSE_RESEARCH_PAPERS.find((paper) => paper.id === id)!
  ),
} as const

export const DEEPDOSE_LANDING_PLATFORM = {
  pillars: [
    {
      id: 'test',
      label: 'Chrono test',
      body: 'Validated chronotype · your phase.',
      icon: 'test' as const,
      panelTitle: 'Your dose dash, in one glance',
      panelSeeAll: { label: 'Take the 3-min test', href: '/login' },
      panelLayout: 'grid' as const,
      panelItems: [
        {
          title: 'A short, validated test maps your chronotype: morning or evening phase.',
          meta: 'MEQ-style · Phase identification',
          href: '/login',
        },
        {
          title: 'Output is a biological phase, not a wellness personality label.',
          meta: 'Clinical pathway · Feeds your plan',
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
      id: 'plan',
      label: 'Dosing plan',
      body: 'Timed light, meals, meds, sleep.',
      icon: 'plan' as const,
      panelTitle: 'Your dosing plan',
      panelSeeAll: { label: 'Open dashboard', href: '/login' },
      panelLayout: 'grid' as const,
      panelItems: [
        {
          title: 'A 0–100 alignment score from how your daily cues match your phase.',
          meta: 'BTI · Window open, closed, or drifting',
          href: '/login',
        },
        {
          title: 'Morning light and meals, timed to anchor your clock.',
          meta: 'Zeitgebers · Sets the day',
          href: '/login',
        },
        {
          title: 'Medicines and supplements: take now or wait.',
          meta: 'Dose cards · Phase-adjusted',
          href: '/login',
        },
        {
          title: 'Movement and sleep: your recovery and bedtime windows.',
          meta: 'Zeitgebers · Rest & recovery',
          href: '/login',
        },
      ],
    },
    {
      id: 'social',
      label: 'Peer support',
      body: 'Share progress · see what works.',
      icon: 'social' as const,
      panelTitle: 'Community & social proof',
      panelSeeAll: { label: 'See the feed', href: '/login' },
      panelLayout: 'grid' as const,
      panelItems: [
        {
          title: 'Share your alignment streaks and timing wins. You choose what’s visible.',
          meta: 'Opt-in · You control sharing',
          href: '/login',
        },
        {
          title: 'See anonymised results from people who share your chronotype.',
          meta: 'Social proof · Like-for-like',
          href: '/login',
        },
        {
          title: 'Follow what’s working across the community: real timing experiments.',
          meta: 'Quantified-self · Outcomes feed',
          href: '/login',
        },
        {
          title: 'Privacy-first by design: consent-based, UK GDPR, nothing shared without you.',
          meta: 'Chronobiobank · Anonymous telemetry',
          href: '/login',
        },
      ],
    },
  ],
} as const

export const DEEPDOSE_LANDING_CLOSE = {
  headline: 'Find your right time',
  support:
    'Start with a free body-clock baseline from your phone and wearables — then see when to take light, meals, medicines, and sleep.',
  cta: { label: 'Start free', href: '/login' },
} as const

export const DEEPDOSE_CLINICIAN_LANDING = {
  eyebrow: 'For clinicians',
  title: 'Make time count for your panel.',
  support:
    'Device alerts first, then misalignment. TipTraQ nights profile patients for precision dosing — you review flagged records before outcomes slip.',
  steps: [
    {
      title: 'Triage by drift',
      meta: 'Device alerts and BTI misalignment rise to the top of your queue.',
    },
    {
      title: 'TipTraQ home nights',
      meta: 'Three-night kits set a dosing baseline and metabolic early warning.',
    },
    {
      title: 'Timing recommendations',
      meta: 'Evidence-graded windows you approve — decision support only.',
    },
    {
      title: 'Invite & link patients',
      meta: 'Share a code; patients opt in to clinical care sharing on their terms.',
    },
  ],
  cta: { label: 'Sign in', href: '/login?next=/clinical/dashboard' },
  accessNote:
    'Clinician accounts are issued by your practice. Contact us if you need access.',
} as const

export const DEEPDOSE_TERMS_DECISION_SUPPORT =
  `Decision support only. ${DEEPDOSE_NAME} suggests the best times for your daily cues. It does not prescribe. Your clinician makes every treatment decision.`

export const DEEPDOSE_NAV_LINKS = [
  { label: 'Research', href: '/research' },
  { label: 'Pricing', href: '/pricing' },
  { label: 'About', href: '/about' },
  { label: 'Sign in', href: '/login' },
] as const
