/** Deepdose marketing · public landing content. */

import { DEEPDOSE_NAME } from '@/lib/brand/deepdose-brand'
import { DEEPDOSE_VOICE } from '@/lib/brand/deepdose-voice'
import { DEEPDOSE_RESEARCH_PAPERS } from '@/lib/deepdose-marketing/research-content'
import { EVIDENCE_HREF } from '@/lib/deepdose-marketing/site-nav-links'
import type { LandingHeroContent } from '@/lib/deepdose-marketing/landing-hero'

export const DEEPDOSE_LANDING_META = {
  title: `${DEEPDOSE_NAME} · Max Your Chemistry.`,
  description: DEEPDOSE_VOICE.homeLede,
} as const

export const DEEPDOSE_CVP = DEEPDOSE_VOICE.tagline

export const DEEPDOSE_POSITIONING_LINE = DEEPDOSE_VOICE.positioning

/** Home splash · Max Your Chemistry + founder claim. */
export const DEEPDOSE_HOME_SPLASH = {
  headlineWhite: DEEPDOSE_VOICE.homeHeadlineWhite,
  headlineAccent: DEEPDOSE_VOICE.homeHeadlineAccent,
  lede: DEEPDOSE_VOICE.homeLede,
  primaryCta: DEEPDOSE_VOICE.homePrimaryCta,
  secondaryCta: DEEPDOSE_VOICE.homeSecondaryCta,
} as const

export const DEEPDOSE_HOME_SPLASH_HERO = {
  eyebrow: '',
  headlineWhite: DEEPDOSE_HOME_SPLASH.headlineWhite,
  headlineAccent: DEEPDOSE_HOME_SPLASH.headlineAccent,
  support: DEEPDOSE_HOME_SPLASH.lede,
} as const

/** @deprecated Home uses a single primary CTA; kept for older imports. */
export const DEEPDOSE_HOME_ACTIONS = {
  mission: { label: 'About us', href: '/how' },
  create: { label: DEEPDOSE_VOICE.homePrimaryCta.label, href: DEEPDOSE_VOICE.homePrimaryCta.href },
} as const

/** Default catalog codes for home med search baseline (two rows). */
export const DEEPDOSE_HOME_DEFAULT_MED_CODES = ['metformin', 'ramipril'] as const

/** Med search copy · post-join / account flows (no longer homepage hero). */
export const DEEPDOSE_HOME_POLY_SEARCH = {
  checkCta: 'Find Your Sync',
  expandCta: '+ add another med/supp',
  expandCtaAnother: '+ add another med/supp',
  medPlaceholders: ['1st med/supp', '2nd med/supp'],
  medPlaceholderExtra: 'Search another medication',
} as const
/** Site-wide mission · four stages (story lives on /how). */
export const DEEPDOSE_MISSION = {
  eyebrow: 'Four stages',
  headlineWhite: DEEPDOSE_VOICE.missionHeadlineWhite,
  headlineAccent: DEEPDOSE_VOICE.missionHeadlineAccent,
  headline: 'Screen. Score. Share. Sync.',
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
      id: 'screen',
      label: 'Screen',
      body: 'Infrastructure · passive SRI',
      icon: 'test' as const,
      panelTitle: 'Your nights',
      panelSeeAll: { label: 'Find Your Sync', href: '/connect' },
      panelLayout: 'grid' as const,
      panelItems: [
        {
          title: 'Sensors run in the background so chronotype matching works — you do not open the app for accelerometer updates.',
          meta: 'Screen · Plumbing',
          href: '/',
        },
        {
          title: 'Optional Homekit nights deepen your chronotype when you want a stronger read.',
          meta: 'Deeper read · Homekit',
          href: '/testkit',
        },
        {
          title: 'Screen removes friction. Retention comes from Sync, Share, and Score.',
          meta: 'Onboarding · Not the habit',
          href: '/how',
        },
      ],
    },
    {
      id: 'score',
      label: 'Score',
      body: 'chronotype profile',
      icon: 'plan' as const,
      panelTitle: 'Your score',
      panelSeeAll: { label: 'Open Profile', href: '/profile' },
      panelLayout: 'grid' as const,
      panelItems: [
        {
          title: 'Score is your chemical chronotype profile — stability, energy pattern, social window — not a diagnosis.',
          meta: 'Profile · chronotype',
          href: '/profile',
        },
        {
          title: 'Watch gains on calendar tiles as nights lock in — ownership over building your chemistry.',
          meta: 'Progression · Calendar',
          href: '/profile',
        },
        {
          title: 'The score matters for what it unlocks: trust, tribe weight, and windows others can read.',
          meta: 'Unlocks · Not vanity',
          href: '/profile',
        },
      ],
    },
    {
      id: 'share',
      label: 'Share',
      body: 'Express your chemistry',
      icon: 'meds' as const,
      panelTitle: 'Your feed',
      panelSeeAll: { label: 'Open Home', href: '/grid' },
      panelLayout: 'grid' as const,
      panelItems: [
        {
          title: 'Dose here because only people in your chronotype group understand what the night feels like.',
          meta: 'Dose · Why here',
          href: '/dose',
        },
        {
          title: 'Four chronotypes — Wolf, Lion, Bear, Dolphin.',
          meta: 'chronotype · Expression',
          href: '/grid',
        },
        {
          title: 'Profile and chemistry stay yours. Peers see what you publish.',
          meta: 'Control · Private by default',
          href: '/profile',
        },
      ],
    },
    {
      id: 'sync',
      label: 'Sync',
      body: 'Find your people',
      icon: 'social' as const,
      panelTitle: 'Your matches',
      panelSeeAll: { label: 'Open Sync', href: '/connect' },
      panelLayout: 'grid' as const,
      panelItems: [
        {
          title: 'Who is online in your biological window right now — compatible chemical chronotypes.',
          meta: 'Sync · Value prop',
          href: '/connect',
        },
        {
          title: 'The moment you think “these are my people” is the retention engine.',
          meta: 'Tribe · Recognition',
          href: '/connect',
        },
        {
          title: 'Chat when the match fits. No forced 9-to-5 energy.',
          meta: 'Chat · On your clock',
          href: '/chat',
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

/** Profile · chemical chronotype score tiles (protocols live on /dosage). */
export const PATIENT_SLEEP_WAKE_DASH = {
  title: 'Your chemistry.',
  diagnosticEyebrow: 'Your chronotype profile',
  subtitleBefore: 'We use AI and your phone data to calculate your ',
  subtitleHighlight: 'chemical chronotype score',
  subtitleAfter:
    '. It shows how locked your nights are, and which daily changes can strengthen your chemistry.',
  scienceLink: 'Read the science',
  scienceHref: '/science',
  dosageLink: 'See the dosage',
  scoreTile: 'Your score',
  historyTile: 'History',
  sleepMattersTile: 'Your chemistry',
  sleepLabel: 'Lights off',
  wakeLabel: 'Lights on',
  sleepHint: '',
  wakeHint: '',
  riskTile: 'Lifestyle alignment',
  riskHint:
    'Your phone score reflects how steady your chemical chronotype is. It is a personal rhythm profile — not a medical diagnosis.',
  dosageCta: 'Open dosage protocol',
  cta: 'Save my plan',
} as const

/** Six-dose protocol — expands from chronotype score into what to do. */
export const PATIENT_SIX_DOSE_PROTOCOL = {
  eyebrow: 'Your protocol',
  title: 'Six doses to strengthen your chemistry',
  support:
    'Sunlight, nutrient, biomedical, physiological, neurological, and blackout. Hold them and your nights line up.',
  education: 'Lined-up nights raise your score. Stronger score, clearer chemical chronotype.',
} as const

/** Consumer → GP handoff after public analysis (optional clinical deepen). */
export const LANDING_GP_HANDOFF_COPY = {
  eyebrow: 'Your chemistry picture',
  shareCta: 'Take this to your GP',
  shareOptionalCta: 'Print a summary for your GP',
  tiptraqCta: 'Get a Homekit read →',
  disclaimer:
    'Decision support only, not a diagnosis. Homekit nights deepen your chronotype when you want more than a phone score.',
  summaryTitle: 'Summary for your GP',
  summaryMeta:
    'Printable sleep–medicine summary for a medication review and home sleep testing.',
  summaryEmpty: 'Run a chemistry check on your sleep–wake plan first, then share the summary with your GP.',
  summaryTipTraqBody:
    'If nights feel broken or breathing may be involved, a Homekit (three nights) can deepen your chronotype read before anyone changes your meds.',
} as const

export const DEEPDOSE_PLAN_NEXT_STEPS = {
  entryCta: 'Save my plan →',
  continueCta: 'Continue →',
  backCta: 'Back',
  steps: ['Screen', 'Share', `Join ${DEEPDOSE_NAME}`] as const,
  clock: {
    eyebrow: 'Step 1 of 3',
    headline: 'Here’s your SRI screen',
    support:
      'Your SRI from how locked your nights are and when you take your medicines. Phone sensors keep screening from signup.',
    stats: {
      sri: 'SRI',
      wake: 'Typical wake',
      sleep: 'Sleep target',
      chronotype: 'chemical chronotype',
    },
    note: 'A first chronotype screen from what you told us. Phone and wearable data sharpen it later.',
  },
  doses: {
    eyebrow: 'Step 2 of 3',
    headline: 'Here are your six doses',
    support:
      'Sunlight, food, movement, focus, connection, and blackout. Hold them to raise your SRI and give chemistry a fairer chance.',
    education: `${DEEPDOSE_NAME} times six daily cues to your chemical chronotype. More locked nights, chemistry that works.`,
  },
  join: {
    eyebrow: 'Step 3 of 3',
    headline: 'Share details. Sync and connect.',
    support:
      'Understand your chemical chronotype, share what you choose, and find people on compatible chemistry. Stay free, or deepen the read with Homekit.',
    commons: {
      title: 'Commons',
      figure: 'Free',
      points: [
        'Understand and save your chemical chronotype',
        'Share details you choose for connection',
        'Match and message people on compatible chemistry',
        'Help research only if you opt in',
      ],
      cta: { label: 'Join Commons free', href: '/' },
    },
    paid: {
      title: 'Deeper read',
      figure: 'From Testkit',
      points: [
        'Homekit, three nights',
        'Stronger chronotype baseline to share',
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
    { label: 'Homekit (optional)', status: 'upcoming' as const },
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
  journeyPlaceholder: 'Your chemistry journey',
  avatarEditLabel: 'Edit',
  avatarEmptyLabel: 'Add photo',
  baseline:
    'Free to join · understand your chemical chronotype, share details you choose, sync with peers, and help research if you want to.',
} as const

/** Social /profile — identity + Chemistry tile (SRI). */
export const SOCIAL_PROFILE = {
  chemistryTitle: 'chronotype score',
  sleepLabel: 'Lights off',
  wakeLabel: 'Lights on',
  share: 'Post your dose',
  matches: 'Friends',
  join: 'Find Your Sync',
} as const

export const DEEPDOSE_PATIENT_PLAN_DEEPER = [
  {
    title: 'Body clock test · refine your anchor with a three-night home sleep test.',
    meta: 'Optional · Homekit · Clinical validation',
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
      title: 'Sync with people on a compatible chemical chronotype.',
      meta: 'Sync · opt in · you control what others see',
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