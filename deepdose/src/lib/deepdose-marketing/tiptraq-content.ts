/** TipTraQ setup guide — six photo step tiles. */

import { DEEPDOSE_NAME } from '@/lib/brand/deepdose-brand'

export const TIPTRAQ_PAGE_META = {
  title: `At-home sleep testing · ${DEEPDOSE_NAME}`,
  description:
    'Charge the TipTraQ sensor, set up the app, wear it overnight, upload each morning, get an expert review, and receive a validated clinical sleep report.',
} as const

export const TIPTRAQ_PAGE_INTRO = {
  eyebrow: 'TipTraQ',
  titleWhite: 'At-home',
  titleAccent: 'sleep testing',
  lede:
    'Charge the sensor, set up the app, and wear TipTraQ overnight — usually across three nights. Each morning you upload; a sleep expert validates your recordings and you receive a clinical report.',
} as const

/** Which side holds the copy block. */
export type TipTraqStepCopySide = 'left' | 'right'

/** Vertical anchor for copy within the tile. */
export type TipTraqStepCopyValign = 'top' | 'center' | 'bottom'

export type TipTraqGuideStep = {
  id: string
  rank: number
  cue: string
  title: string
  body: string
  image: string
  alt: string
  copySide?: TipTraqStepCopySide
  copyValign?: TipTraqStepCopyValign
  /** CSS object-position for the full-bleed cover image */
  imagePosition?: string
}

export const TIPTRAQ_GUIDE_STEPS: readonly TipTraqGuideStep[] = [
  {
    id: 'charge',
    rank: 1,
    cue: '#acd3de',
    title: 'Charge the sensor',
    body: 'Top up the case, then open the app.',
    image: '/tiptraq/tiptraq-v3-1.png',
    alt: 'Open TipTraQ charging case with the soft fabric finger sensor, beside the companion app',
    copySide: 'left',
    copyValign: 'top',
    imagePosition: '92% center',
  },
  {
    id: 'app',
    rank: 2,
    cue: '#c9b6f2',
    title: 'Set up the app',
    body: 'Activate your study and confirm your details.',
    image: '/tiptraq/tiptraq-v3-2.png',
    alt: 'TipTraQ app screen for setting up a new sleep study',
    copySide: 'left',
    copyValign: 'bottom',
    imagePosition: '82% center',
  },
  {
    id: 'wear',
    rank: 3,
    cue: '#f2b8a2',
    title: 'Wear it overnight',
    body: 'Wrap the sensor, start recording, sleep as usual.',
    image: '/tiptraq/tiptraq-v3-3cut.png',
    alt: 'A hand wearing the soft TipTraQ fabric sensor around the finger',
    copySide: 'right',
    copyValign: 'center',
    imagePosition: '32% center',
  },
  {
    id: 'sync',
    rank: 4,
    cue: '#8b9cf8',
    title: 'Your nights sync',
    body: 'End each morning to upload — usually three nights.',
    image: '/tiptraq/tiptraq-v3-4c.png',
    alt: 'TipTraQ sleep centre dashboard listing each night’s recording progress',
    copySide: 'left',
    copyValign: 'bottom',
    imagePosition: '78% center',
  },
  {
    id: 'review',
    rank: 5,
    cue: '#acd3de',
    title: 'An expert reviews',
    body: 'Every recording validated by a sleep professional.',
    image: '/tiptraq/tiptraq-v3-5.png',
    alt: 'TipTraQ recording view with SpO₂, pulse rate and sleep-stage traces',
    copySide: 'left',
    copyValign: 'bottom',
    imagePosition: '88% center',
  },
  {
    id: 'results',
    rank: 6,
    cue: '#c9b6f2',
    title: 'Your results',
    body: 'TQ-AHI, oxygen, and sleep staging for your clinician.',
    image: '/tiptraq/tiptraq-v3-6b.png',
    alt: 'A validated TipTraQ sleep report with TQ-AHI, SpO₂ and sleep-stage summary',
    copySide: 'left',
    copyValign: 'bottom',
    imagePosition: '90% center',
  },
] as const

export const TIPTRAQ_PAGE_CTA = {
  label: 'Order your test',
  href: '/pricing',
} as const
