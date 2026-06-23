/** DeepDose marketing — public landing content. */

import { DEEPDOSE_NAME } from '@/lib/brand/deepdose-brand'
import { DEEPDOSE_RESEARCH_PAPERS } from '@/lib/deepdose-marketing/research-content'
import {
  CHRONOBIOBANK_RESEARCH_HREF,
  TECHNOLOGY_DLMO_PROXY_HREF,
} from '@/lib/deepdose-marketing/site-nav-links'
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
  seeAll: { label: 'All research', href: CHRONOBIOBANK_RESEARCH_HREF },
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
      'Once-daily labels hide phase. Triage drift and device gaps — validate with TipTraQ.',
  },
  steps: [
    {
      label: 'Queue',
      cue: '#f2b8a2',
      title: 'Triage by drift',
      meta: 'Device alerts and BTI misalignment rise to the top of your queue.',
    },
    {
      label: 'Validate',
      cue: '#acd3de',
      title: 'TipTraQ home nights',
      meta: 'Three-night kits set a dosing baseline and metabolic early warning.',
    },
    {
      label: 'Retime',
      cue: '#c9b6f2',
      title: 'Timing recommendations',
      meta: 'Evidence-graded windows you approve — decision support only.',
    },
    {
      label: 'Link',
      cue: '#8b9cf8',
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
      label: 'License',
      cue: '#acd3de',
      title: 'Licensed cohorts',
      meta: 'Query contributed records under active data licenses with purpose-bound access.',
    },
    {
      label: 'Analytics',
      cue: '#c9b6f2',
      title: 'Population analytics',
      meta: 'Chronotype, timing shift, and outcome distributions across your licensed panel.',
    },
    {
      label: 'Cohorts',
      cue: '#8b9cf8',
      title: 'Cohort builder',
      meta: 'Filter by age band, medication, chronotype, and consent purpose codes.',
    },
    {
      label: 'Privacy',
      cue: '#f2b8a2',
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

export { DEEPDOSE_SITE_LINKS as DEEPDOSE_NAV_LINKS } from '@/lib/deepdose-marketing/site-nav-links'
