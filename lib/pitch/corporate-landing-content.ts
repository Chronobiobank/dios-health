import type { KawasakiSlideMedia } from '@/lib/pitch/marketing-landing-content'
import { MARKETING_ROUTES } from '@/lib/pitch/marketing-routes'

export const CORPORATE_LANDING_META = {
  title: 'DIOS · Biological performance intelligence',
  description:
    'Measure your leadership team’s biological clock. Align calendars to circadian prime time.',
  openGraphTitle: 'DIOS · Biological performance intelligence',
  openGraphDescription:
    'Corporate circadian intelligence for executives who already wear Oura, Whoop, or Apple Watch.',
} as const

export const CORPORATE_HERO = {
  id: 'hero',
  slideNum: '01',
  eyebrow: 'The problem',
  headlineHtml: 'Your talent loses <em>44 days</em> a year',
  support: 'Not burnout. Circadian misalignment — biology vs calendar.',
  media: {
    image: '/standardised.jpg',
    video: '/first-light.mp4',
    scrim: 'light',
    priority: true,
    extendsUnderNav: true,
  } satisfies KawasakiSlideMedia,
  ctas: {
    primary: { label: 'Request briefing', href: MARKETING_ROUTES.cpoBriefing },
    secondary: { label: 'See product', href: '#product' },
  },
} as const

export const CORPORATE_STATS = {
  id: 'stats',
  slideNum: '02',
  eyebrow: 'The cost',
  headlineHtml: 'Presenteeism is <em>£103bn</em> a year',
  support: 'UK employers pay for days worked — not days performed.',
  stats: [
    { value: '£103bn', label: 'UK presenteeism / yr' },
    { value: '44', label: 'Days lost / employee' },
    { value: '77%', label: 'Drift in high-performers' },
    { value: '0', label: 'Platforms measuring clock time' },
  ],
} as const

export const CORPORATE_PROBLEM = {
  id: 'problem',
  slideNum: '03',
  eyebrow: 'The problem',
  headlineHtml: 'Wellness everywhere. <em>Clock nowhere.</em>',
  support: 'Bupa checks vitals. Vitality counts steps. Nobody maps biological prime time.',
} as const

export const CORPORATE_PROBLEM_PILLARS = [
  {
    id: 'mechanism',
    slideNum: '04',
    eyebrow: '01 — Mechanism',
    headlineHtml: 'Every leader has a <em>prime time</em>',
    support:
      'DLMO — when the brain shifts toward sleep — varies by six hours. One executive peaks at 9am. Another is in biological night.',
    metric: 'DLMO',
    metricNote: 'Up to 6h variance',
  },
  {
    id: 'cost',
    slideNum: '05',
    eyebrow: '02 — Cost',
    headlineHtml: 'Presenteeism <em>dwarfs</em> absenteeism',
    support:
      'They show up. They sit in meetings. Misalignment suppresses decision quality — silently, every day.',
    metric: '£21bn',
    metricNote: 'UK absenteeism alone',
  },
  {
    id: 'gap',
    slideNum: '06',
    eyebrow: '03 — Gap',
    headlineHtml: 'No wellness product <em>closes this</em>',
    support:
      'Apps track steps and mood. None tell you when to schedule the board meeting — or when not to fly.',
    metric: '—',
    metricNote: 'Category whitespace',
  },
] as const

export const CORPORATE_PRODUCT = {
  id: 'product',
  slideNum: '07',
  eyebrow: 'What DIOS does',
  headlineHtml: 'Measure the clock. <em>Recover the days.</em>',
  support: 'Plug into wearables they already own. Output a daily performance protocol.',
  steps: [
    {
      symbol: '◌',
      title: 'Connect',
      body: 'Oura, Whoop, Apple Watch — OAuth in minutes. Three nights. No new device.',
    },
    {
      symbol: '◎',
      title: 'Calculate',
      body: 'Proxy DLMO: peak cognition, worst call window, travel recovery curve.',
    },
    {
      symbol: '◉',
      title: 'Deliver',
      body: 'Meeting timing, light cues, travel recovery, medicine windows where needed.',
    },
  ],
} as const

export const CORPORATE_BUYER = {
  id: 'buyers',
  slideNum: '08',
  eyebrow: 'Who it is for',
  headlineHtml: 'Leaders you <em>cannot afford</em> to lose',
  support: 'One CPO decision. Senior leadership covered. Not a perk — infrastructure.',
  sectors: [
    { num: '01', title: 'Law & professional services', body: 'Time zones erode billable cognition.' },
    { num: '02', title: 'Banking & private equity', body: 'One bad 3am decision costs millions.' },
    { num: '03', title: 'FTSE leadership teams', body: 'Boards built on diaries, not biology.' },
    { num: '04', title: 'Management consultancies', body: 'Weekly travel accumulates jet lag.' },
    { num: '05', title: 'Founders & scale-up CEOs', body: 'Irreplaceable by Monday morning.' },
  ],
  cta: { label: 'Request briefing', href: MARKETING_ROUTES.cpoBriefing },
} as const

export const CORPORATE_ROI = {
  intro: {
    id: 'roi',
    slideNum: '09',
    eyebrow: 'ROI calculator',
    headlineHtml: 'What misalignment <em>costs you</em>',
    support: 'Adjust your cohort. Conservative 15% recovery.',
  },
  methodology: 'IPPR 2024 · Cheng et al. · NHS reference costs. Projections only.',
  defaults: {
    executives: 50,
    salaryK: 220,
    travelDaysPerMonth: 4,
    sector: 'corporate' as const,
  },
  ctas: {
    primary: { label: 'Request business case', href: MARKETING_ROUTES.cpoBriefing },
  },
} as const

export const CORPORATE_EVIDENCE = {
  id: 'evidence',
  slideNum: '11',
  eyebrow: 'Evidence',
  headlineHtml: 'Peer-reviewed. <em>Not wellness.</em>',
  citations: [
    {
      source: 'IPPR · 2024',
      quote: '£103bn presenteeism. 44 productivity days lost per employee per year.',
      href: 'https://www.ippr.org/',
    },
    {
      source: 'J. Occupational Health · 2022',
      quote: 'Circadian misalignment directly linked to presenteeism across 8,155 office workers.',
      href: MARKETING_ROUTES.evidence,
    },
    {
      source: 'EHJ · Hermida',
      quote: 'Personalised biological timing changed cardiovascular outcomes in prospective trials.',
      href: MARKETING_ROUTES.evidence,
    },
  ],
} as const

export const CORPORATE_CLOSING = {
  id: 'closing',
  slideNum: '12',
  eyebrow: 'Founding partners',
  headlineHtml: 'They have Bupa. <em>You have DIOS.</em>',
  support: 'Pilot 10–50 executives. Signal in 90 days. Five UK founding slots.',
  programme: [
    { label: 'Size', value: '10–500 executives' },
    { label: 'Entry', value: 'Existing wearable' },
    { label: 'Onboarding', value: '3 nights · no clinic' },
    { label: 'Pricing', value: 'From £500/head/yr' },
    { label: 'Class', value: 'Clinical decision support' },
    { label: 'Pilot', value: '5 partners · UK' },
  ],
  ctas: {
    primary: { label: 'Request briefing', href: MARKETING_ROUTES.cpoBriefing },
    secondary: { label: 'Clinicians', href: MARKETING_ROUTES.clinicians },
    tertiary: { label: 'Evidence', href: MARKETING_ROUTES.evidence },
  },
} as const

export const CORPORATE_SECTION_IDS = [
  CORPORATE_HERO.id,
  CORPORATE_STATS.id,
  CORPORATE_PROBLEM.id,
  ...CORPORATE_PROBLEM_PILLARS.map((p) => p.id),
  CORPORATE_PRODUCT.id,
  CORPORATE_BUYER.id,
  CORPORATE_ROI.intro.id,
  'roi-result',
  CORPORATE_EVIDENCE.id,
  CORPORATE_CLOSING.id,
] as const
