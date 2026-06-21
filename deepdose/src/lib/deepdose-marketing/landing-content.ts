/** DeepDose marketing — public landing content. */

import { DEEPDOSE_NAME } from '@/lib/brand/deepdose-brand'
import { DEEPDOSE_RESEARCH_PAPERS } from '@/lib/deepdose-marketing/research-content'
import type { LandingHeroContent } from '@/lib/deepdose-marketing/landing-hero'

export const DEEPDOSE_LANDING_META = {
  title: `${DEEPDOSE_NAME} · Precision dosing for your body clock`,
  description:
    'Precision dosing aligns each medicine with your personal biological window — not a fixed alarm. Learn how DeepDose times doses to when your body is ready.',
} as const

export const DEEPDOSE_HOME_SPLASH = {
  headlineLine: 'We capture melatonin alignment',
  headlineAccent: 'so your medicines work better.',
} as const

export const DEEPDOSE_LANDING_HERO: LandingHeroContent = {
  eyebrow: 'Precision dosing',
  headlineWhite: 'Dose when your',
  headlineAccent: 'biology is ready',
  support:
    'The right dose at the wrong time is the wrong dose. DeepDose finds your window — then times each med to it.',
} as const

const EVIDENCE_PAPER_IDS = ['hermida-2020', 'pigazzani-2024', 'wallace-2003'] as const

export const DEEPDOSE_LANDING_EVIDENCE = {
  eyebrow: 'The evidence',
  headline: 'Timing matters',
  support: 'Peer-reviewed trials across blood pressure, glucose, sleep, and more.',
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
      body: 'Your melatonin anchor · tracked passively.',
      icon: 'test' as const,
      panelTitle: 'Your melatonin readout',
      panelSeeAll: { label: 'Take the 3-min test', href: '/login' },
      panelLayout: 'grid' as const,
      panelItems: [
        {
          title: 'We estimate when your melatonin switch flips — from phone, wearable, and chrono test data.',
          meta: 'Passive proxy · No blood test required',
          href: '/login',
        },
        {
          title: 'TipTraQ three-night block validates the anchor — like calibrating a CGM.',
          meta: 'Clinical validation · Verified badge',
          href: '/home-test',
        },
        {
          title: 'BCA tracks how steady your blackout window stays — drift moves every dose cue.',
          meta: 'Body clock alignment · Time-in-range',
          href: '/login',
        },
      ],
    },
    {
      id: 'plan',
      label: 'Dosing plan',
      body: 'Six cues · timed to your anchor.',
      icon: 'plan' as const,
      panelTitle: 'Your dosing plan',
      panelSeeAll: { label: 'Open dashboard', href: '/login' },
      panelLayout: 'grid' as const,
      panelItems: [
        {
          title: 'Six dose cues — light, meals, meds, movement, wind-down, blackout — all timed to your anchor.',
          meta: 'Zeitgebers · Phase-adjusted',
          href: '/login',
        },
        {
          title: 'Take now or wait: each medicine window opens and closes with your body clock.',
          meta: 'BTI · Window open, closed, or drifting',
          href: '/login',
        },
        {
          title: 'When drift pushes your anchor late, every cue shifts — not fixed 8am reminders.',
          meta: 'Precision dosing · Moves with you',
          href: '/login',
        },
        {
          title: 'Your clinician sees the same plan and can step in when windows slip.',
          meta: 'Shared record · Decision support',
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
  headline: 'Start free',
  support: 'Add your meds, baseline your rhythm, see when each window opens.',
  cta: { label: 'Sign up for free', href: '/login' },
} as const

export const DEEPDOSE_CLINICIAN_LANDING = {
  hero: {
    eyebrow: 'For clinicians',
    headlineWhite: 'Make time count',
    headlineAccent: 'for your panel.',
    support:
      'Device alerts first, then misalignment. TipTraQ nights profile patients for precision dosing — you review flagged records before outcomes slip.',
  },
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
  note: 'Decision support only. You make every treatment decision.',
  cta: { label: 'Sign in', href: '/login?next=/clinical/dashboard' },
  accessNote:
    'Clinician accounts are issued by your practice. Contact us if you need access.',
} as const

export const DEEPDOSE_ENTERPRISE_LANDING = {
  hero: {
    eyebrow: 'Chronobiobank',
    headlineWhite: 'Population',
    headlineAccent: 'intelligence',
    support:
      'Pseudonymised, consent-gated cohort data for ICBs, pharma R&D, and research — aggregates only, no identifiable patient records.',
  },
  steps: [
    {
      title: 'Licensed cohorts',
      meta: 'Query contributed records under active data licenses with purpose-bound access.',
    },
    {
      title: 'Population analytics',
      meta: 'Chronotype, timing shift, and outcome distributions across your licensed panel.',
    },
    {
      title: 'Cohort builder',
      meta: 'Filter by age band, medication, chronotype, and consent purpose codes.',
    },
    {
      title: 'Privacy by design',
      meta: 'Chronobiobank isolation — pseudonymised tokens only, full access audit trail.',
    },
  ],
  note: 'Licensed research and population planning only. Not a substitute for individual clinical care.',
  cta: { label: 'Sign in', href: '/login?next=/enterprise/dashboard' },
  accessNote:
    'Enterprise accounts are issued under data license. Contact us to access Chronobiobank.',
} as const

export const DEEPDOSE_TERMS_DECISION_SUPPORT =
  `Decision support only. ${DEEPDOSE_NAME} suggests the best times for your daily cues. It does not prescribe. Your clinician makes every treatment decision.`

export const DEEPDOSE_NAV_LINKS = [
  { label: 'Research', href: '/research' },
  { label: 'Pricing', href: '/pricing' },
  { label: 'About', href: '/about' },
  { label: 'Sign in', href: '/login' },
] as const
