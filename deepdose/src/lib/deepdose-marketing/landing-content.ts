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

import { PROBLEM_PAGE_HREF } from '@/lib/deepdose-marketing/problem-content'

export const DEEPDOSE_HOME_SPLASH = {
  eyebrow: 'Precision dosing',
  headlineWhite: 'Dose smart,',
  headlineAccent: 'recover fast.',
  lede: 'Deepdose removes the guesswork from most dosing apps. Enter your meds below for a free chrono-dosing plan and start feeling better.',
} as const

export const DEEPDOSE_HOME_SPLASH_HERO = {
  eyebrow: DEEPDOSE_HOME_SPLASH.eyebrow,
  headlineWhite: DEEPDOSE_HOME_SPLASH.headlineWhite,
  headlineAccent: DEEPDOSE_HOME_SPLASH.headlineAccent,
  supportBeforeLink: 'Deepdose removes the guesswork from most dosing apps',
  supportLink: { label: '(read how)', href: PROBLEM_PAGE_HREF },
  supportAfterLink:
    '. Enter your meds below for a free chrono-dosing plan and start feeling better.',
} as const

/** Default catalog codes for home splash placeholder rows (Blood sugar → Mood meds). */
export const DEEPDOSE_HOME_DEFAULT_MED_CODES = [
  'metformin',
  'ramipril',
  'atorvastatin',
  'sertraline',
] as const

/** Home poly search — wake tile copy. */
export const DEEPDOSE_HOME_POLY_SEARCH = {
  checkCta: 'Fix my timing',
  expandCta: '+ Add other medications',
  expandCtaAnother: '+ Add medication',
  medPlaceholders: ['Blood sugar', 'Blood pressure', 'Cholesterol', 'Mood meds'],
  medPlaceholderExtra: 'Search another medication',
  whyTitle: 'Why does this matter?',
  whyDetail: [
    'On 2+ medicines, the usual issue is dose-time clash — one drug taken at the wrong time of day for your mix.',
    'We show which times to move, using circadian evidence — not a generic interaction checker.',
  ],
} as const

/** Site-wide mission — deficit (wrong-time dosing) → benefit (chronotherapy). */
export const DEEPDOSE_MISSION = {
  eyebrow: 'Precision dosing',
  headlineWhite: 'Dose when your',
  headlineAccent: 'biology is ready',
  headline: 'Dose when your biology is ready',
  lede: `The right dose at the wrong time is the wrong dose. ${DEEPDOSE_NAME} finds your window — then times each med to when your body is ready, so the same dose can work harder.`,
} as const

export const DEEPDOSE_LANDING_HERO: LandingHeroContent = {
  eyebrow: DEEPDOSE_MISSION.eyebrow,
  headlineWhite: DEEPDOSE_MISSION.headlineWhite,
  headlineAccent: DEEPDOSE_MISSION.headlineAccent,
  support: DEEPDOSE_MISSION.lede,
} as const

const EVIDENCE_PAPER_IDS = ['hermida-2020', 'pigazzani-2024', 'wallace-2003'] as const

export const DEEPDOSE_LANDING_EVIDENCE = {
  eyebrow: 'The evidence',
  headline: 'Timing matters',
  support: 'Peer-reviewed trials across blood pressure, glucose, sleep, and more.',
  seeAll: { label: 'Published science', href: EVIDENCE_HREF },
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
          title: 'Share your alignment streaks and timing wins. You choose what\'s visible.',
          meta: 'Opt-in · You control sharing',
          href: '/login',
        },
        {
          title: 'See anonymised results from people who share your chronotype.',
          meta: 'Social proof · Like-for-like',
          href: '/login',
        },
        {
          title: 'Follow what\'s working across the community: real timing experiments.',
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
    {
      id: 'meds',
      label: 'Medications',
      body: 'Check your combination risk',
      icon: 'meds' as const,
      panelTitle: 'Your medication sync',
      panelSeeAll: { label: 'Check my combination', href: '/' },
      panelLayout: 'grid' as const,
      panelItems: [
        {
          title: 'Most people on multiple medications have never been told that timing them against each other changes the outcome.',
          meta: 'Polypharmacy · Timing interactions',
          href: '/',
        },
        {
          title: 'Atorvastatin works best in the evening — nocturnal cholesterol synthesis is the target. Morning dosing misses the window.',
          meta: 'Statin timing · TIME substudy (Dundee)',
          href: '/evidence',
        },
        {
          title: 'Ramipril taken at bedtime reduces major cardiovascular events by up to 45% versus morning dosing.',
          meta: 'ACE inhibitor · Hygia Trial, 19,084 patients',
          href: '/evidence',
        },
        {
          title: 'Enter your combination and we show you the conflicts — no account needed.',
          meta: 'Free · Instant · No sign-up required',
          href: '/',
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

export const DEEPDOSE_PATIENT_PLAN_HERO = {
  eyebrow: 'Your timing check',
  headlineWhite: DEEPDOSE_MISSION.headlineWhite,
  headlineAccent: DEEPDOSE_MISSION.headlineAccent,
} as const

/** Patient landing lede — check + verdict in one line (no duplicate context). */
export function patientPlanHeroSupport(medCount: number, verdict: string): string {
  const intro =
    medCount === 1
      ? 'We checked your medicine at the time you take it.'
      : medCount > 1
        ? `We checked your ${medCount} medicines at the times you take them.`
        : 'We checked your medicines at the times you take them.'
  return `${intro} ${verdict}`
}

export const DEEPDOSE_PATIENT_PLAN_PERSONAL_BRIDGE = {
  eyebrow: 'Next step',
  headline: DEEPDOSE_MISSION.headline,
  body: 'This plan uses typical wake times and trial averages — not your body clock yet. A quick three-minute test shows when you personally absorb each medicine best.',
  cta: { label: 'Personalise my plan →' },
  populationLabel: 'Based on typical timing · not personal yet',
  benefitHint:
    'When we know your body clock, each dose can land in the window where it works hardest.',
  ladder: [
    { label: 'Checked your medicines', status: 'done' as const },
    { label: 'Saw how they line up today', status: 'done' as const },
    { label: 'Three-minute body clock test', status: 'current' as const },
    { label: 'TipTraQ home test (optional)', status: 'upcoming' as const },
  ],
} as const

export const DEEPDOSE_PATIENT_PLAN_TABS = {
  landing: [
    { id: 'timing' as const, label: 'Today', body: 'How you take them now', tone: 'lilac' as const },
    { id: 'dosing' as const, label: 'Your plan', body: 'When each one works best', tone: 'peach' as const },
    { id: 'sharing' as const, label: 'Share', body: 'GP, family & research', tone: 'blue' as const },
  ],
  app: [
    { id: 'timing' as const, label: 'Your meds', body: 'How you take them today', tone: 'lilac' as const },
    { id: 'dosing' as const, label: 'Your windows', body: 'When to take each one', tone: 'peach' as const },
    { id: 'sharing' as const, label: 'Share', body: 'GP, family & research', tone: 'blue' as const },
  ],
} as const

export const DEEPDOSE_PATIENT_PLAN_TIMING = {
  syncEyebrow: 'Timing check',
  syncCaption: 'compared with what usually works',
  syncedChip: (count: number) => `${count} on track`,
  reviewChip: (count: number) => `${count} worth a look`,
  syncMeter: (pct: number) => `${pct}% on track`,
  syncScoreAria: (synced: number, total: number) => `${synced} of ${total} on track`,
  dosingTitle: 'When to take each',
} as const

export const DEEPDOSE_PATIENT_PLAN_PROFILE = {
  firstNamePlaceholder: 'First name',
  familyNamePlaceholder: 'Family name',
  baseline:
    'Free to join — save your plan, get dose reminders, share with your GP, and help research if you want to.',
} as const

export const DEEPDOSE_PATIENT_PLAN_DEEPER = [
  {
    title: 'Body clock test — refine your anchor with a three-night home sleep test.',
    meta: 'Optional · TipTraQ · Clinical validation',
    href: '/home-test',
  },
  {
    title: 'Read the trials and evidence behind your plan.',
    meta: 'Optional · Hygia · TIME substudy',
    href: '/science',
  },
] as const

export const DEEPDOSE_PATIENT_PLAN_SHARING = {
  linkLabel: 'Get started →',
  items: [
    {
      title: 'Share with your GP or someone you trust.',
      meta: 'Private link · you choose who sees it',
      href: '/login',
      showPeers: false,
    },
    {
      title: 'Compare streaks with others who wake and dose like you.',
      meta: 'Community · opt in · you control what others see',
      href: '/login',
      showPeers: true,
    },
    {
      title: 'Help research with anonymised outcomes (optional).',
      meta: 'Chronobiobank · UK GDPR · no personal details shared',
      href: '/chronobiobank',
      showPeers: false,
    },
  ],
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

export { DEEPDOSE_SITE_LINKS as DEEPDOSE_NAV_LINKS, DEEPDOSE_FOOTER_LINKS } from '@/lib/deepdose-marketing/site-nav-links'