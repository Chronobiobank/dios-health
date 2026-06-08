import { CLINICIAN_ENTRY, PATIENT_PREVIEW_ENTRY } from '@/lib/pitch/audience-entry-content'
import type { KawasakiSlideMedia } from '@/lib/pitch/marketing-landing-content'
import { MARKETING_ROUTES } from '@/lib/pitch/marketing-routes'

export const EVIDENCE_LANDING_META = {
  title: 'Why protocols go blind — DIOS',
  description:
    'You cannot see your protocol working between blood draws. Why the 90-day gap hurts patients and clinicians.',
} as const

export type EvidenceStorySlide = {
  id: string
  slideNum: string
  eyebrow: string
  headlineHtml: string
  support: string
  variant?: 'dark' | 'teal' | 'bronze'
  media?: KawasakiSlideMedia
}

/** Full-viewport problem story — continues landing slide 01 */
export const EVIDENCE_STORY_SLIDES: readonly EvidenceStorySlide[] = [
  {
    id: 'visibility-gap',
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
    id: 'the-wait',
    slideNum: '02',
    eyebrow: 'The wait',
    headlineHtml: 'You adjust. You <em>wait</em>.',
    support: 'You hope the protocol is working. The next panel is months away.',
    variant: 'dark',
  },
  {
    id: 'patients',
    slideNum: '03',
    eyebrow: 'Patients',
    headlineHtml: 'The clock was <em>wrong</em>.',
    support: 'It feels like the medicine failed. No one checked the timing.',
    variant: 'bronze',
  },
  {
    id: 'clinicians',
    slideNum: '04',
    eyebrow: 'Clinicians',
    headlineHtml: 'Sleep moves <em>first</em>.',
    support: 'Architecture shifts weeks before bloods move. Nothing reaches your workflow.',
  },
  {
    id: 'what-fails',
    slideNum: '05',
    eyebrow: 'What fails',
    headlineHtml: 'Apps miss <em>what matters</em>',
    support: 'Nothing tracks dose timing, sleep, or safety between blood panels.',
    variant: 'dark',
  },
] as const

export const EVIDENCE_CYCLE = {
  id: 'cycle',
  slideNum: '06',
  eyebrow: 'The cycle',
  headlineHtml: 'One panel every <em>90 days</em>.',
  support: 'Eighty-seven blind. Three with data. That is the whole loop.',
  metrics: [
    { value: '87', label: 'days blind' },
    { value: '3', label: 'days with data' },
    { value: '90', label: 'days per cycle' },
  ] as const,
} as const

export const EVIDENCE_CLOSING_SLIDE = {
  id: 'enough',
  slideNum: '07',
  eyebrow: 'Enough',
  headlineHtml: 'Not <em>good enough</em>.',
  support: 'Patients and clinicians both know it. DIOS closes the gap they cannot see.',
  variant: 'bronze' as const,
}

export const EVIDENCE_CTA_SECTION = {
  id: 'next',
  slideNum: '08',
  eyebrow: 'Next',
  headlineHtml: 'Four signals close the <em>gap</em>.',
  support: 'Sleep, dose timing, bloods, and light — before the next panel.',
  ctas: {
    primary: { label: 'See the model', href: MARKETING_ROUTES.scienceFourCadences },
    secondary: { label: CLINICIAN_ENTRY.cohortLabel, href: CLINICIAN_ENTRY.href },
    tertiary: { label: PATIENT_PREVIEW_ENTRY.ctaLabel, href: PATIENT_PREVIEW_ENTRY.href },
  },
} as const
