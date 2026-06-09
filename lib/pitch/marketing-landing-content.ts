import { CLINICIAN_ENTRY, PATIENT_PREVIEW_ENTRY } from '@/lib/pitch/audience-entry-content'
import { MARKETING_ROUTES } from '@/lib/pitch/marketing-routes'

/** `/learn` is not a route; curriculum links use science */
export const MARKETING_LEARN_ROUTE = MARKETING_ROUTES.learn

export { CORPORATE_LANDING_META as MARKETING_LANDING_META } from '@/lib/pitch/corporate-landing-content'

export type KawasakiNavConfig = {
  links: readonly { label: string; href: string }[]
  cta: { label: string; href: string }
}

export type KawasakiEcosystemItem = {
  name: string
  role: string
}

export type KawasakiBrandConfig = {
  name: string
  logoMark: string
  logoGlyph: string
  logoClassName?: string
}

export type KawasakiFooterLinkColumn = {
  title: string
  links: readonly { label: string; href: string }[]
}

export type KawasakiFooterConfig = {
  /** Title-case legal entity — footer bar right */
  brandName: string
  /** Unbounded caps mark — footer bar left after © year */
  copyrightMark?: string
  descriptor: string
  tagline: string
  copyrightYear: number
  links?: readonly { label: string; href: string }[]
  linkColumns?: readonly KawasakiFooterLinkColumn[]
  ecosystem?: readonly KawasakiEcosystemItem[]
}

export const KAWASAKI_NAV = {
  links: [
    { label: 'Product', href: '#product' },
    { label: 'ROI', href: '#roi' },
    { label: 'Evidence', href: MARKETING_ROUTES.evidence },
    { label: 'Clinicians', href: MARKETING_ROUTES.clinicians },
  ],
  cta: { label: 'Request briefing', href: MARKETING_ROUTES.cpoBriefing },
} as const

export const KAWASAKI_FOOTER = {
  brandName: 'DIOS',
  descriptor: 'Biological performance intelligence',
  tagline: 'Make Time Count',
  copyrightYear: 2026,
  links: [
    { label: 'Learn', href: MARKETING_LEARN_ROUTE },
    { label: 'Science', href: MARKETING_ROUTES.science },
    { label: 'How it works', href: MARKETING_ROUTES.howItWorks },
    { label: 'Live demo', href: MARKETING_ROUTES.howItWorksDemo },
    { label: 'Technology', href: MARKETING_ROUTES.technology },
    { label: 'Evidence', href: MARKETING_ROUTES.evidence },
    { label: 'Clinicians', href: MARKETING_ROUTES.clinicians },
    { label: 'DINA', href: MARKETING_ROUTES.dina },
    { label: 'Chronobiobank', href: MARKETING_ROUTES.chronobiobank },
    { label: PATIENT_PREVIEW_ENTRY.navLabel, href: PATIENT_PREVIEW_ENTRY.href },
    { label: CLINICIAN_ENTRY.navLabel, href: CLINICIAN_ENTRY.href },
    { label: 'Contact', href: '/contact' },
    { label: 'Privacy', href: '/privacy' },
    { label: 'Terms', href: '/terms' },
  ],
} as const

export type KawasakiSlideVariant = 'default' | 'dark' | 'teal' | 'bronze' | 'center'

export type KawasakiSlideLink = {
  label: string
  href: string
}

export type KawasakiSlideMedia = {
  /** Poster / reduced-motion fallback; sole background when `video` is omitted */
  image: string
  video?: string
  scrim: 'light' | 'dark' | 'teal' | 'cta'
  priority?: boolean
  /** Pull background under the fixed top nav (slide 01 only) */
  extendsUnderNav?: boolean
}

export type KawasakiStorySlide = {
  id: string
  slideNum: string
  eyebrow: string
  headlineHtml: string
  support: string
  link?: KawasakiSlideLink
  media?: KawasakiSlideMedia
  variant?: Exclude<KawasakiSlideVariant, 'center'>
}

/** Full-viewport story slides (01–08) */
export const KAWASAKI_STORY_SLIDES: readonly KawasakiStorySlide[] = [
  {
    id: 's0',
    slideNum: '01',
    eyebrow: 'Problem',
    headlineHtml: '87 days <em>blind</em>',
    support: 'You cannot see your protocol working between blood draws.',
    link: { label: 'Why protocols go blind', href: MARKETING_ROUTES.visibilityGap },
    media: {
      image: '/standardised.jpg',
      video: '/first-light.mp4',
      scrim: 'light',
      priority: true,
      extendsUnderNav: true,
    },
  },
  {
    id: 's1',
    slideNum: '02',
    eyebrow: 'What fails',
    headlineHtml: 'Apps miss <em>what matters</em>',
    support: 'Nothing tracks dose timing, sleep, or safety between blood panels.',
    variant: 'dark',
  },
  {
    id: 's2',
    slideNum: '03',
    eyebrow: 'Solution',
    headlineHtml: 'We close the <em>90-day gap</em>',
    support: 'Four signals show what quarterly bloods miss.',
    link: { label: 'See the model', href: MARKETING_ROUTES.scienceFourCadences },
    variant: 'bronze',
  },
  {
    id: 's3',
    slideNum: '04',
    eyebrow: 'How',
    headlineHtml: 'Sleep is your <em>early signal</em>',
    support: 'Sleep changes weeks before your next blood panel.',
    link: { label: 'The technology', href: MARKETING_ROUTES.technology },
    media: {
      image: '/sleep-is%20your-early-signal.jpg',
      scrim: 'light',
    },
  },
  {
    id: 's4',
    slideNum: '05',
    eyebrow: 'Platform',
    headlineHtml: '<em>DIOS</em> for clinicians',
    support: 'Every confirmed dose appears on your dashboard.',
    link: { label: 'Live demo', href: MARKETING_ROUTES.howItWorksDemo },
  },
  {
    id: 's5',
    slideNum: '06',
    eyebrow: 'Patients',
    headlineHtml: '<em>DINA</em> for patients',
    support:
      'Tells you when to take each medicine. Warns your clinic if timing is unsafe.',
    link: { label: 'Meet DINA', href: MARKETING_ROUTES.dina },
    variant: 'bronze',
  },
  {
    id: 's6',
    slideNum: '07',
    eyebrow: 'Practitioners',
    headlineHtml: 'Built for <em>high-dose D3</em>',
    support: 'For practitioners who prescribe vitamin D as a hormone.',
    link: { label: 'For clinicians', href: MARKETING_ROUTES.clinicians },
    media: {
      image: '/practitioners.jpg',
      scrim: 'dark',
    },
  },
  {
    id: 's7',
    slideNum: '08',
    eyebrow: 'Vision',
    headlineHtml: 'Your data. <em>Your consent.</em>',
    support: 'Helps practitioners improve immune and metabolic care in practice.',
    link: { label: 'Chronobiobank', href: MARKETING_ROUTES.chronobiobank },
  },
] as const

export const KAWASAKI_CTA_SECTION = {
  id: 's8',
  slideNum: '09',
  eyebrow: 'Join free',
  headlineHtml: 'Start with <em>one patient</em>',
  media: {
    image: '/standardised.jpg',
    video: '/start-with-one-patient.mp4',
    scrim: 'cta',
  },
  ctas: {
    primary: { label: PATIENT_PREVIEW_ENTRY.ctaLabel, href: PATIENT_PREVIEW_ENTRY.href },
    secondary: { label: CLINICIAN_ENTRY.cohortLabel, href: CLINICIAN_ENTRY.href },
    tertiary: { label: 'Learn more →', href: MARKETING_LEARN_ROUTE },
  },
} as const
