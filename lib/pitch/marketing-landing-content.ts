import { MARKETING_ROUTES } from '@/lib/pitch/marketing-routes'

/** `/learn` is not a route; curriculum links use science */
export const MARKETING_LEARN_ROUTE = MARKETING_ROUTES.learn

export const MARKETING_LANDING_META = {
  title: 'DIOS · Make Time Count',
  description: 'Close the 90-day visibility gap in chronoimmunology.',
  openGraphTitle: 'DIOS · Make Time Count',
  openGraphDescription: 'Close the 90-day visibility gap in chronoimmunology.',
} as const

export const KAWASAKI_NAV = {
  links: [
    { label: 'Learn', href: MARKETING_LEARN_ROUTE },
    { label: 'Science', href: MARKETING_ROUTES.science },
    { label: 'For clinicians', href: MARKETING_ROUTES.clinicians },
    { label: 'DINA', href: MARKETING_ROUTES.dina },
  ],
  cta: { label: 'Enrol', href: MARKETING_ROUTES.onboarding },
} as const

export const KAWASAKI_FOOTER = {
  descriptor: 'Precision Chronoimmunology',
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
    { label: 'Enrol', href: MARKETING_ROUTES.onboarding },
    { label: 'Contact', href: '/contact' },
    { label: 'Privacy', href: '/privacy' },
    { label: 'Terms', href: '/terms' },
  ],
} as const

export type KawasakiSlideVariant = 'default' | 'dark' | 'teal' | 'center'

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
    support: 'Four cadences show what quarterly bloods cannot.',
    link: { label: 'See the model →', href: MARKETING_ROUTES.howItWorks },
    variant: 'teal',
    media: {
      image: '/the-solution.webp',
      scrim: 'teal',
    },
  },
  {
    id: 's3',
    slideNum: '04',
    eyebrow: 'How',
    headlineHtml: 'Sleep is your <em>early signal</em>',
    support: 'Sleep changes weeks before your next blood panel.',
    link: { label: 'The technology →', href: MARKETING_ROUTES.technology },
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
    link: { label: 'Live demo →', href: MARKETING_ROUTES.howItWorksDemo },
    media: {
      image: '/for%20clinicians.jpg',
      scrim: 'light',
    },
  },
  {
    id: 's5',
    slideNum: '06',
    eyebrow: 'Patients',
    headlineHtml: '<em>DINA</em> for patients',
    support: 'A free agent that tells them when to take every dose.',
    media: {
      image: '/for%20patients.jpg',
      scrim: 'light',
    },
  },
  {
    id: 's6',
    slideNum: '07',
    eyebrow: 'Practitioners',
    headlineHtml: 'We support <em>high-dose Soltriol</em>',
    support:
      'Built for advanced immunology practitioners prescribing vitamin D as a hormone.',
    media: {
      image: '/practitioners.jpg',
      scrim: 'dark',
    },
  },
  {
    id: 's7',
    slideNum: '08',
    eyebrow: 'Vision',
    headlineHtml: 'User-owned <em>Chronobank</em>',
    support:
      'We are building it to help practitioners apply immune and metabolic care in practice.',
    link: { label: 'Chronobiobank →', href: MARKETING_ROUTES.chronobiobank },
    media: {
      image: '/chronobiobank.png',
      scrim: 'light',
    },
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
    primary: { label: 'Enrol a patient', href: MARKETING_ROUTES.onboarding },
    secondary: { label: 'More on Soltriol', href: MARKETING_LEARN_ROUTE },
    tertiary: { label: 'Patient? Get DINA ↗', href: MARKETING_ROUTES.dina },
  },
} as const
