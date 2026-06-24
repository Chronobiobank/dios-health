/** DeepDose marketing — public landing content. */

import { DEEPDOSE_NAME } from '@/lib/brand/deepdose-brand'
import { DEEPDOSE_RESEARCH_PAPERS } from '@/lib/deepdose-marketing/research-content'
import { EVIDENCE_HREF, TECHNOLOGY_DLMO_PROXY_HREF } from '@/lib/deepdose-marketing/site-nav-links'
import type { LandingHeroContent } from '@/lib/deepdose-marketing/landing-hero'

export const DEEPDOSE_LANDING_META = {
  title: `${DEEPDOSE_NAME} · Precision dosing for your body clock`,
  description:
    `Precision dosing aligns each medicine with your personal biological window — not a fixed alarm. Learn how ${DEEPDOSE_NAME} times doses to when your body is ready.`,
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
    `The right dose at the wrong time is the wrong dose. ${DEEPDOSE_NAME} finds your window — then times each med to it.`,
} as const

const EVIDENCE_PAPER_IDS = ['hermida-2020', 'pigazzani-2024', 'wallace-2003'] as const

export const DEEPDOSE_LANDING_EVIDENCE = {
  eyebrow: 'The evidence',
  headline: 'Timing matters',
  support: 'Peer-reviewed trials across blood pressure, glucose, sleep, and more.',
  seeAll: { label: 'Foundation', href: EVIDENCE_HREF },
  papers: EVIDENCE_PAPER_IDS.map(
    (id) => DEEPDOSE_RESEARCH_PAPERS.find((paper) => paper.id === id)!
  ),
} as const

export const DEEPDOSE_LANDING_PLATFORM = {
  pillars: [
    {
      id: 'test',
      label: 'Testing',
      body: 'Phase changes to melatonin',
      icon: 'test' as const,
      panelTitle: 'Your melatonin readout',
      panelSeeAll: { label: 'Take the 3-min test', href: '/login' },
      panelLayout: 'grid' as const,
      panelItems: [
        {
          title: 'We estimate proxy DLMO from sleep onset (−2 h) and MCTQ mid-sleep (−2.5 h) — published population markers.',
          meta: 'Proxy DLMO · Burgess & Roenneberg',
          href: TECHNOLOGY_DLMO_PROXY_HREF,
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
      label: 'Dosing',
      body: 'Meds timed to body clock',
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
      label: 'Sharing',
      body: 'Update gains with others',
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
          href: '/chronobiobank',
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
    headlineWhite: 'Scripts,',
    headlineAccent: 'timed right.',
    support:
      'Fixed pill times ignore body clock. See who needs you first — and confirm timing with a short home sleep test.',
  },
  steps: [
    {
      label: 'Queue',
      cue: '#f2b8a2',
      title: 'Patients first',
      meta: 'Missing data and sleep shifts rise to your queue first.',
    },
    {
      label: 'Validate',
      cue: '#acd3de',
      title: 'Home sleep test',
      meta: 'Three home nights anchor bedtime before retiming.',
    },
    {
      label: 'Retime',
      cue: '#c9b6f2',
      title: 'Suggested times',
      meta: 'Published trial dose times — you approve each one.',
    },
    {
      label: 'Link',
      cue: '#8b9cf8',
      title: 'Invite patients',
      meta: 'Send an invite code; patients choose what to share.',
    },
  ],
  cta: { label: 'Sign in', href: '/login?next=/clinical/dashboard' },
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
      label: 'License',
      cue: '#acd3de',
      title: 'Licensed cohorts',
      meta: 'Licensed records with purpose-bound access only.',
    },
    {
      label: 'Analytics',
      cue: '#c9b6f2',
      title: 'Cohort analytics',
      meta: 'Chronotype and dose-timing trends across your panel.',
    },
    {
      label: 'Cohorts',
      cue: '#8b9cf8',
      title: 'Cohort builder',
      meta: 'Filter by medication, chronotype, and consent code.',
    },
    {
      label: 'Privacy',
      cue: '#f2b8a2',
      title: 'Privacy first',
      meta: 'Pseudonymised tokens only; every access is audited.',
    },
  ],
  note: 'Licensed research and population planning only. Not a substitute for individual clinical care.',
  cta: { label: 'Sign in', href: '/login?next=/enterprise/dashboard' },
  accessNote:
    'Enterprise accounts are issued under data license. Contact us to access Chronobiobank.',
} as const

export const DEEPDOSE_TERMS_DECISION_SUPPORT =
  `Decision support only. ${DEEPDOSE_NAME} suggests the best times for your daily cues. It does not prescribe. Your clinician makes every treatment decision.`

export { DEEPDOSE_SITE_LINKS as DEEPDOSE_NAV_LINKS } from '@/lib/deepdose-marketing/site-nav-links'
