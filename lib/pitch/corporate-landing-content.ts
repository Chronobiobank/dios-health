import { BRAND_ECOSYSTEM, EXIQ_BRAND, EXIQ_ELEVATOR, Q_NARRATIVE } from '@/lib/brand/exiq-brand'
import type { KawasakiSlideMedia } from '@/lib/pitch/marketing-landing-content'
import { MARKETING_ROUTES } from '@/lib/pitch/marketing-routes'

export const CORPORATE_BRAND = {
  ...EXIQ_BRAND,
  logoClassName: 'exiq-wordmark',
} as const

export const CORPORATE_NAV = {
  links: [
    { label: 'Mechanism', href: '#mechanism' },
    { label: 'Product', href: '#product' },
    { label: 'Proof', href: '#proof' },
  ],
  cta: { label: 'Request briefing', href: MARKETING_ROUTES.cpoBriefing },
} as const

export const CORPORATE_FOOTER = {
  brandName: EXIQ_BRAND.name,
  descriptor: EXIQ_ELEVATOR,
  tagline: EXIQ_BRAND.category,
  copyrightYear: 2026,
  ecosystem: BRAND_ECOSYSTEM,
  links: [
    { label: 'Mechanism', href: '#mechanism' },
    { label: 'Product', href: '#product' },
    { label: 'Proof', href: '#proof' },
    { label: 'Request briefing', href: MARKETING_ROUTES.cpoBriefing },
    { label: 'Contact', href: '/contact' },
    { label: 'Privacy', href: '/privacy' },
    { label: 'Terms', href: '/terms' },
  ],
} as const

export const CORPORATE_PEAK_WINDOW = {
  eyebrow: 'The deliverable',
  title: 'Peak Window',
  headline: 'Two hours of prime cognition — protected, every day',
  support: 'EIOS maps biology through exIQ. Q cues light, timing, and movement to hold it.',
  hoursPerLeader: 2,
} as const

export const CORPORATE_LANDING_META = {
  title: 'exIQ on EIOS · Executive Intelligence',
  description:
    'Q delivers your daily cues. exIQ on EIOS maps Peak Window — EI alongside AI.',
  openGraphTitle: 'exIQ · Q delivers your cues',
  openGraphDescription:
    'Corporate Executive Intelligence on EIOS. Light, timing, movement — zeitgeber cues for leadership teams.',
} as const

/** 01 — Hero: one problem, one claim, one action */
export const CORPORATE_HERO = {
  id: 'hero',
  slideNum: '01',
  eyebrow: 'exIQ on EIOS',
  headlineHtml: 'Your talent loses <em>44 days</em> a year',
  support: 'Circadian misalignment — not burnout. Biology vs calendar.',
  media: {
    image: '/standardised.jpg',
    video: '/first-light.mp4',
    scrim: 'light',
    priority: true,
    extendsUnderNav: true,
  } satisfies KawasakiSlideMedia,
  cta: { label: 'Request briefing', href: MARKETING_ROUTES.cpoBriefing },
} as const

/** 02 — Mechanism: why the problem exists and why nothing else solves it */
export const CORPORATE_MECHANISM = {
  id: 'mechanism',
  slideNum: '02',
  eyebrow: 'The mechanism',
  headlineHtml: 'Six hours between <em>peak minds</em>',
  support:
    'DLMO sets when cognition peaks. Wellness counts steps. No platform maps biological prime time.',
  stats: [
    { value: '£103bn', label: 'UK presenteeism' },
    { value: '44', label: 'Days lost / leader' },
    { value: '6h', label: 'DLMO spread' },
    { value: '0', label: 'EI OS platforms' },
  ],
} as const

/** 03 — Product: EIOS platform · exIQ product · Q AI */
export const CORPORATE_PRODUCT = {
  id: 'product',
  slideNum: '03',
  eyebrow: 'Meet Q',
  headlineHtml: 'Q delivers your <em>daily cues</em>',
  support: Q_NARRATIVE,
  steps: [
    {
      symbol: '◌',
      title: 'Connect',
      body: 'Oura, Whoop, Apple Watch feed EIOS — three nights.',
    },
    {
      symbol: '◎',
      title: 'Calculate',
      body: 'exIQ on EIOS maps DLMO and Peak Window.',
    },
    {
      symbol: 'Q',
      title: 'Q',
      body: 'Light. Timing. Movement. Zeitgeber cues — daily.',
    },
  ],
} as const

/** 04 — Proof: numbers, calculator, evidence */
export const CORPORATE_PROOF = {
  id: 'proof',
  slideNum: '04',
  eyebrow: 'The proof',
  headlineHtml: 'Name the cost. <em>Protect Peak Window.</em>',
  support: 'Adjust your cohort. IPPR-backed model. Conservative 15% recovery.',
  methodology: 'IPPR 2024 · Cheng et al. · Projections only.',
  citations: [
    {
      source: 'IPPR 2024',
      quote: '£103bn presenteeism · 44 days lost per employee.',
    },
    {
      source: 'J. Occup. Health 2022',
      quote: 'Circadian misalignment linked to presenteeism — 8,155 workers.',
    },
    {
      source: 'EHJ · Hermida',
      quote: 'Personalised biological timing changed prospective outcomes.',
    },
  ],
  defaults: {
    executives: 50,
    salaryK: 220,
    travelDaysPerMonth: 4,
    sector: 'corporate' as const,
  },
  cta: { label: 'Request business case', href: MARKETING_ROUTES.cpoBriefing },
} as const

/** @deprecated Use CORPORATE_PROOF — kept for calculator imports */
export const CORPORATE_ROI = {
  defaults: CORPORATE_PROOF.defaults,
  ctas: { primary: CORPORATE_PROOF.cta },
} as const

/** 05 — Close: who, cost, one CTA */
export const CORPORATE_CLOSE = {
  id: 'close',
  slideNum: '05',
  eyebrow: 'Founding partners',
  headlineHtml: 'They have AI. <em>You have Q.</em>',
  support: 'EIOS for the platform. exIQ for corporate. Q for the cues — 10–50 leaders, signal in 90 days.',
  sectors: [
    { title: 'Banking & PE', body: 'One bad 3am call costs millions.' },
    { title: 'Law & professional services', body: 'Time zones erode billable cognition.' },
    { title: 'FTSE leadership', body: 'Boards built on diaries, not biology.' },
  ],
  programme: [
    { label: 'Cohort', value: '10–500 leaders' },
    { label: 'Entry', value: 'Wearable · 3 nights' },
    { label: 'Pricing', value: 'From £500/head/yr' },
    { label: 'Pilot', value: '5 UK founding slots' },
  ],
  cta: { label: 'Request briefing', href: MARKETING_ROUTES.cpoBriefing },
} as const

export const CORPORATE_SECTION_IDS = [
  CORPORATE_HERO.id,
  CORPORATE_MECHANISM.id,
  CORPORATE_PRODUCT.id,
  CORPORATE_PROOF.id,
  CORPORATE_CLOSE.id,
] as const
