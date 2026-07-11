/** Deepdose marketing · public landing content. */

import { DEEPDOSE_NAME } from '@/lib/brand/deepdose-brand'
import { DEEPDOSE_VOICE } from '@/lib/brand/deepdose-voice'
import { DEEPDOSE_RESEARCH_PAPERS } from '@/lib/deepdose-marketing/research-content'
import { EVIDENCE_HREF } from '@/lib/deepdose-marketing/site-nav-links'
import type { LandingHeroContent } from '@/lib/deepdose-marketing/landing-hero'

export const DEEPDOSE_LANDING_META = {
  title: `${DEEPDOSE_NAME} · Max your chemistry.`,
  description: `${DEEPDOSE_NAME}: max your chemistry — score your nights, plan what you take, find people on your clock.`,
} as const

export const DEEPDOSE_CVP = 'Max your chemistry.' as const

/** Home splash · one-line head + med baseline. */
export const DEEPDOSE_HOME_SPLASH = {
  headlineWhite: DEEPDOSE_VOICE.homeHeadlineWhite,
  headlineAccent: DEEPDOSE_VOICE.homeHeadlineAccent,
  lede: DEEPDOSE_VOICE.homeLede,
} as const

export const DEEPDOSE_HOME_SPLASH_HERO = {
  eyebrow: '',
  headlineWhite: DEEPDOSE_HOME_SPLASH.headlineWhite,
  headlineAccent: DEEPDOSE_HOME_SPLASH.headlineAccent,
  ...(DEEPDOSE_HOME_SPLASH.lede ? { support: DEEPDOSE_HOME_SPLASH.lede } : {}),
} as const

/** @deprecated Home uses on-page signup gate; kept for older imports. */
export const DEEPDOSE_HOME_ACTIONS = {
  mission: { label: 'About us', href: '/how' },
  create: { label: 'Enter', href: '/#enter' },
} as const

/** Default catalog codes for home med search baseline (two rows). */
export const DEEPDOSE_HOME_DEFAULT_MED_CODES = ['metformin', 'ramipril'] as const

/** Med search copy · home splash baseline. */
export const DEEPDOSE_HOME_POLY_SEARCH = {
  checkCta: 'Join Deepdose',
  expandCta: '+ Add medication',
  expandCtaAnother: '+ Add medication',
  medPlaceholders: ['Find your med', 'Add another'],
  medPlaceholderExtra: 'Search another medication',
} as const

/** Site-wide mission · three moves (story lives on /how). */
export const DEEPDOSE_MISSION = {
  eyebrow: 'Three moves',
  headlineWhite: DEEPDOSE_VOICE.missionHeadlineWhite,
  headlineAccent: DEEPDOSE_VOICE.missionHeadlineAccent,
  headline: 'Score. Plan. Boost. Find.',
  lede: DEEPDOSE_VOICE.missionLede,
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
  support: 'Peer-reviewed trials, not wellness folklore.',
  seeAll: { label: 'Published science', href: EVIDENCE_HREF },
  papers: EVIDENCE_PAPER_IDS.map(
    (id) => DEEPDOSE_RESEARCH_PAPERS.find((paper) => paper.id === id)!
  ),
} as const

export const DEEPDOSE_LANDING_PLATFORM = {
  pillars: [
    {
      id: 'test',
      label: 'Log',
      body: 'Night · Day · Energy · Fuel',
      icon: 'test' as const,
      panelTitle: 'Your dose readout',
      panelSeeAll: { label: 'Open Chemistry', href: '/dosage' },
      panelLayout: 'grid' as const,
      panelItems: [
        {
          title: 'People log the night — light, meds, and movement — then raise their sleep score.',
          meta: 'Rhythm · Sleep regularity',
          href: '/grid',
        },
        {
          title: 'Optional TipTraQ nights deepen the read when you want a stronger sleep score.',
          meta: 'Deeper read · TipTraQ',
          href: '/testkit',
        },
        {
          title: 'Drift shows when your clock slips, so you know what to correct before you log.',
          meta: 'Alignment · Catch drift early',
          href: '/dosage',
        },
      ],
    },
    {
      id: 'plan',
      label: 'Feed',
      body: 'People on your clock',
      icon: 'plan' as const,
      panelTitle: 'Your feed',
      panelSeeAll: { label: 'Sign in', href: '/grid' },
      panelLayout: 'grid' as const,
      panelItems: [
        {
          title: 'One dose at a time: photo plus sleep score, for early birds or night owls.',
          meta: 'You choose · Opt in',
          href: '/dose',
        },
        {
          title: 'Profile and Chemistry stay yours. Peers see what you publish for connection.',
          meta: 'Control · Private by default',
          href: '/profile',
        },
        {
          title: 'Correct together: compare notes when nights drift and update what you share.',
          meta: 'Correction · Shared learning',
          href: '/connect',
        },
        {
          title: 'Optional anonymised research share, never by default, stop anytime.',
          meta: 'Research · Consent first',
          href: '/how',
        },
      ],
    },
    {
      id: 'social',
      label: 'Friends',
      body: 'People on your clock',
      icon: 'social' as const,
      panelTitle: 'Friends & messages',
      panelSeeAll: { label: 'Open Friends', href: '/connect' },
      panelLayout: 'grid' as const,
      panelItems: [
        {
          title: 'People on your rhythm who see today’s doses — not follower counts or endless scroll.',
          meta: 'Similar clocks · Daily doses',
          href: '/connect',
        },
        {
          title: 'Message privately when it feels right. Dose together, not an attention feed.',
          meta: 'Chat · Private DMs',
          href: '/chat',
        },
        {
          title: 'See people who have been where you are and share what finally settled their nights.',
          meta: 'Peers · Real doses',
          href: '/connect',
        },
        {
          title: 'Privacy-first: consent-based, UK GDPR, nothing shared without you.',
          meta: 'Trust · You stay in control',
          href: '/privacy',
        },
      ],
    },
    {
      id: 'meds',
      label: 'Chemistry',
      body: 'Timing that shapes your match',
      icon: 'meds' as const,
      panelTitle: 'Why timing is chemistry',
      panelSeeAll: { label: 'See the science', href: '/science' },
      panelLayout: 'grid' as const,
      panelItems: [
        {
          title: 'Stacked chemistry and odd hours change how the same routine lands. Understanding that is how matching starts.',
          meta: 'Stacked chemistry · Real doses',
          href: '/dosage',
        },
        {
          title: 'Published trials show when medicines land better against the body clock, the same science behind clearer chemistry reads.',
          meta: 'Evidence · Timing trials',
          href: '/science',
        },
        {
          title: 'Share timing details with peers who get it, then correct together when drift shows up.',
          meta: 'Share · Connect · Correct',
          href: '/connect',
        },
        {
          title: 'Start free: understand your chemistry, share what fits, message when ready.',
          meta: 'Free · No attention feed',
          href: '/',
        },
      ],
    },
  ],
} as const

export const DEEPDOSE_LANDING_CLOSE = {
  headline: 'Start free',
  support: DEEPDOSE_VOICE.closeSupport,
  cta: { label: 'Sign up for free', href: '/' },
} as const

export const DEEPDOSE_PATIENT_PLAN_HERO = {
  eyebrow: 'Your timing check',
  headlineWhite: DEEPDOSE_MISSION.headlineWhite,
  headlineAccent: DEEPDOSE_MISSION.headlineAccent,
} as const

/** Patient landing lede · check + verdict in one line (no duplicate context). */
export function patientPlanHeroSupport(medCount: number, verdict: string): string {
  const intro =
    medCount === 1
      ? 'We checked your medicine at the time you take it.'
      : medCount > 1
        ? `We checked your ${medCount} medicines at the times you take them.`
        : 'We checked your medicines at the times you take them.'
  return `${intro} ${verdict}`
}

/** Profile · Levels-style modular sleep-score tiles (protocols live on /dosage). */
export const PATIENT_SLEEP_WAKE_DASH = {
  title: 'Sleep matters.',
  diagnosticEyebrow: 'Your Risk Profile',
  subtitleBefore: 'We use AI and your phone data to calculate your ',
  subtitleHighlight: 'sleep score',
  subtitleAfter:
    '. It shows how locked your nights are, and which daily changes can raise your score and lower your risk of chronic disease and early death.',
  scienceLink: 'Read the science',
  scienceHref: '/science',
  dosageLink: 'See the dosage',
  scoreTile: 'Your score',
  historyTile: 'History',
  sleepMattersTile: 'Sleep matters',
  sleepLabel: 'Lights off',
  wakeLabel: 'Lights on',
  sleepHint: '',
  wakeHint: '',
  riskTile: 'Disease risk',
  riskHint:
    'Lower sleep score, higher disease risk. Your phone score is a proxy from population studies (including UK Biobank-style evidence). It is not a personal diagnosis.',
  dosageCta: 'Open dosage protocol',
  cta: 'Save my plan',
} as const

/** Six-dose protocol — expands from sleep-score read into what to do. */
export const PATIENT_SIX_DOSE_PROTOCOL = {
  eyebrow: 'Your protocol',
  title: 'Six doses to raise your sleep score',
  support:
    'Sunlight, nutrient, biomedical, physiological, neurological, and blackout. Hold them and your nights line up.',
  education: 'Lined-up nights raise your sleep score. Higher score, lower disease risk.',
} as const

/** Consumer → GP handoff after public risk analysis. */
export const LANDING_GP_HANDOFF_COPY = {
  eyebrow: 'Your risk picture',
  shareCta: 'Take this to your GP',
  shareOptionalCta: 'Print a summary for your GP',
  tiptraqCta: 'Get a TipTraQ early-risk read →',
  disclaimer:
    'Decision support only, not a diagnosis. TipTraQ nights deepen the clinical picture when you want more than a phone score.',
  summaryTitle: 'Summary for your GP',
  summaryMeta:
    'Printable sleep–medicine risk summary for a medication review and home sleep testing.',
  summaryEmpty: 'Run a risk check on your sleep–wake plan first, then share the summary with your GP.',
  summaryTipTraqBody:
    'If nights feel broken or breathing may be involved, a TipTraQ home sleep test (three nights) can confirm the early-risk picture before anyone changes your meds.',
} as const

export const DEEPDOSE_PLAN_NEXT_STEPS = {
  entryCta: 'Save my plan →',
  continueCta: 'Continue →',
  backCta: 'Back',
  steps: ['Sleep score', 'Six doses', `Join ${DEEPDOSE_NAME}`] as const,
  clock: {
    eyebrow: 'Step 1 of 3',
    headline: 'Here’s your sleep score',
    support:
      'Your sleep score from how locked your nights are and when you take your medicines. Wearables refine past, current, and future nights.',
    stats: {
      sri: 'Sleep score',
      wake: 'Typical wake',
      sleep: 'Sleep target',
      chronotype: 'Rhythm hint',
    },
    note: 'A first read from what you told us. Phone and wearable data sharpen it later.',
  },
  doses: {
    eyebrow: 'Step 2 of 3',
    headline: 'Here are your six doses',
    support:
      'Sunlight, food, movement, focus, connection, and blackout. Hold them to raise your sleep score and give your meds a fairer chance.',
    education: `${DEEPDOSE_NAME} times six daily cues to your rhythm. More locked nights, stronger doses.`,
  },
  join: {
    eyebrow: 'Step 3 of 3',
    headline: 'Share details. Connect and correct.',
    support:
      'Understand your chemistry, share what you choose, and find people on a similar rhythm. Stay free, or deepen the read with TipTraQ.',
    commons: {
      title: 'Commons',
      figure: 'Free',
      points: [
        'Understand and save your chemistry profile',
        'Share details you choose for connection',
        'Match and message people on a similar rhythm',
        'Help research only if you opt in',
      ],
      cta: { label: 'Join Commons free', href: '/' },
    },
    paid: {
      title: 'Deeper read',
      figure: 'From Testkit',
      points: [
        'TipTraQ home sleep test, three nights',
        'Stronger chemistry baseline to share',
        'Verified sleep badge when you want it',
        'Quarterly re-reads catch drift early',
      ],
      cta: { label: 'Browse membership', href: '/membership' },
    },
    skip: 'Or keep browsing, no account needed.',
  },
} as const

export const DEEPDOSE_PATIENT_PLAN_PERSONAL_BRIDGE = {
  eyebrow: 'Next step',
  headline: DEEPDOSE_MISSION.headline,
  body: 'This plan uses typical wake times and trial averages, not your body clock yet. A quick three-minute test shows when you personally absorb each medicine best.',
  cta: { label: DEEPDOSE_PLAN_NEXT_STEPS.entryCta },
  appCta: { label: 'Personalise my plan →' },
  populationLabel: 'Based on typical timing, not personal yet',
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
    { id: 'timing' as const, label: 'Today', body: 'Your chemistry now', tone: 'lilac' as const },
    { id: 'dosing' as const, label: 'Your windows', body: 'When rhythm fits best', tone: 'peach' as const },
    { id: 'sharing' as const, label: 'Share', body: 'Peers, trust & research', tone: 'blue' as const },
  ],
  app: [
    { id: 'timing' as const, label: 'Chemistry', body: 'What you run today', tone: 'lilac' as const },
    { id: 'dosing' as const, label: 'Your windows', body: 'When to act on it', tone: 'peach' as const },
    { id: 'sharing' as const, label: 'Share', body: 'Peers, trust & research', tone: 'blue' as const },
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
  locationPlaceholder: 'Your city or region',
  journeyPlaceholder: 'Your rhythm journey',
  avatarEditLabel: 'Edit',
  avatarEmptyLabel: 'Add photo',
  baseline:
    'Free to join · understand your chemistry, share details you choose, connect with peers, and help research if you want to.',
} as const

/** Social /profile — identity + Chemistry tile (SRI). */
export const SOCIAL_PROFILE = {
  chemistryTitle: 'Sleep score',
  sleepLabel: 'Lights off',
  wakeLabel: 'Lights on',
  share: 'Log dose',
  matches: 'Friends',
  join: 'Join free',
} as const

export const DEEPDOSE_PATIENT_PLAN_DEEPER = [
  {
    title: 'Body clock test · refine your anchor with a three-night home sleep test.',
    meta: 'Optional · TipTraQ · Clinical validation',
    href: '/testkit',
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
      title: 'Share chemistry details with someone you trust.',
      meta: 'Private link · you choose who sees it',
      href: '/share',
      showPeers: false,
    },
    {
      title: 'Connect with people on a similar rhythm for connection and correction.',
      meta: 'Connect · opt in · you control what others see',
      href: '/connect',
      showPeers: true,
    },
    {
      title: 'Help research with anonymised outcomes (optional).',
      meta: 'Optional research · UK GDPR, no personal details shared',
      href: '/how',
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
      'Fixed pill times ignore body clock. See who needs you first, and confirm timing with a short home sleep test.',
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
      meta: 'Published trial dose times · you approve each one.',
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
      'Pseudonymised, consent-gated cohort data for ICBs, pharma R&D, and research · aggregates only, no identifiable patient records.',
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

export { DEEPDOSE_SITE_LINKS as DEEPDOSE_NAV_LINKS, DEEPDOSE_FOOTER_LINKS } from '@/lib/deepdose-marketing/site-nav-links'