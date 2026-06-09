import { Q_NARRATIVE } from '@/lib/brand/bodycloq-brand'
import {
  BRAND_ECOSYSTEM,
  CLOQ_CATEGORY,
  CLOQ_DESCRIPTOR,
  CLOQ_HEALTH_BRAND,
  CLOQ_TAGLINE,
} from '@/lib/brand/cloq-health'
import type { KawasakiSlideMedia } from '@/lib/pitch/marketing-landing-content'
import { MARKETING_ROUTES } from '@/lib/pitch/marketing-routes'

export const CORPORATE_BRAND = CLOQ_HEALTH_BRAND

export const CORPORATE_NAV = {
  links: [
    { label: 'Mechanism', href: '#mechanism' },
    { label: 'Product', href: '#product' },
    { label: 'Proof', href: '#proof' },
  ],
  cta: { label: 'Request briefing', href: MARKETING_ROUTES.cpoBriefing },
} as const

export const CORPORATE_FOOTER = {
  brandName: CLOQ_HEALTH_BRAND.legalName,
  copyrightMark: CLOQ_HEALTH_BRAND.copyrightMark,
  descriptor: CLOQ_TAGLINE,
  tagline: '',
  copyrightYear: 2026,
  ecosystem: BRAND_ECOSYSTEM,
  linkColumns: [
    {
      title: 'Explore',
      links: [
        { label: 'Mechanism', href: '/#mechanism' },
        { label: 'Product', href: '/#product' },
        { label: 'Proof', href: '/#proof' },
        { label: 'Request briefing', href: MARKETING_ROUTES.cpoBriefing },
      ],
    },
    {
      title: 'Company',
      links: [
        { label: 'Contact', href: '/contact' },
        { label: 'Privacy', href: '/privacy' },
        { label: 'Terms', href: '/terms' },
      ],
    },
  ],
} as const

export const CORPORATE_PEAK_WINDOW = {
  eyebrow: 'The deliverable',
  title: 'Peak Window',
  headline: 'Two hours of prime cognition — protected, every day',
  support: 'Your BodycloQ score maps it from wearables. Q cues light, timing, and movement to hold it.',
  hoursPerLeader: 2,
} as const

export const CORPORATE_LANDING_META = {
  title: CLOQ_DESCRIPTOR,
  description:
    'Circadian nootropics for peak performance. BodycloQ scores your prime time — Q delivers the cues.',
  openGraphTitle: CLOQ_DESCRIPTOR,
  openGraphDescription:
    'Wearables in, score out. BodycloQ maps your Peak Window — Q protects it every day.',
} as const

/** 01 — Hero: one problem, one claim, one action */
export const CORPORATE_HERO = {
  id: 'hero',
  slideNum: '01',
  eyebrow: CLOQ_CATEGORY,
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
    'DLMO sets when cognition peaks. Wellness counts steps. No platform scores biological prime time.',
  stats: [
    { value: '£103bn', label: 'UK presenteeism' },
    { value: '44', label: 'Days lost / professional' },
    { value: '6h', label: 'DLMO spread' },
    { value: '0', label: 'Circadian score platforms' },
  ],
} as const

/** 03 — Product: BodycloQ score + Q cue intelligence */
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
      body: 'Oura, Whoop, Apple Watch feed BodycloQ — three nights.',
    },
    {
      symbol: '◎',
      title: 'Score',
      body: 'BodycloQ maps DLMO, circadian score, and Peak Window per person.',
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
  support: 'BodycloQ for the score. Q for the cues — 10–50 professionals, signal in 90 days.',
  sectors: [
    { title: 'Banking & PE', body: 'One bad 3am call costs millions.' },
    { title: 'Law & professional services', body: 'Time zones erode billable cognition.' },
    { title: 'Surgery & high-cognition roles', body: 'Diaries built on shifts, not biology.' },
  ],
  programme: [
    { label: 'Cohort', value: '10–500 professionals' },
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
