/** TipTraQ setup guide , six photo step tiles. */

import { DEEPDOSE_NAME } from '@/lib/brand/deepdose-brand'

export const TIPTRAQ_PAGE_META = {
  title: `Homekit · ${DEEPDOSE_NAME}`,
  description:
    'Wear Homekit at home for a deeper chemistry read — charge, set up, overnight wear, upload, and a clearer rhythm baseline to share.',
} as const

export const TIPTRAQ_PAGE_INTRO = {
  eyebrow: 'Homekit',
  titleWhite: 'At-home',
  titleAccent: 'deeper read',
  lede: 'Wear Homekit overnight. Upload. Share a clearer score.',
} as const

/** Which side holds the media block. */
export type TipTraqStepCopySide = 'left' | 'right'

/** @deprecated Kept for older step data; light guide tiles ignore valign. */
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
  /** CSS object-position for the cover image */
  imagePosition?: string
}

export const TIPTRAQ_GUIDE_STEPS: readonly TipTraqGuideStep[] = [
  {
    id: 'charge',
    rank: 1,
    cue: '#acd3de',
    title: 'Charge the sensor',
    body: 'Top up the case overnight, then open the companion app.',
    image: '/tiptraq/tiptraq-v3-1.png',
    alt: 'Open Homekit charging case with the soft fabric finger sensor, beside the companion app',
    copySide: 'left',
    imagePosition: 'center',
  },
  {
    id: 'app',
    rank: 2,
    cue: '#c9b6f2',
    title: 'Set up the app',
    body: 'Activate your study and confirm the details once.',
    image: '/tiptraq/tiptraq-v3-2.png',
    alt: 'Homekit app screen for setting up a new sleep study',
    copySide: 'left',
    imagePosition: 'center',
  },
  {
    id: 'wear',
    rank: 3,
    cue: '#f2b8a2',
    title: 'Wear it overnight',
    body: 'Wrap the sensor, start recording, and sleep as usual.',
    image: '/tiptraq/tiptraq-v3-3cut.png',
    alt: 'A hand wearing the soft Homekit fabric sensor around the finger',
    copySide: 'right',
    imagePosition: 'center',
  },
  {
    id: 'sync',
    rank: 4,
    cue: '#8b9cf8',
    title: 'Your nights sync',
    body: 'End each morning to upload — usually across three nights.',
    image: '/tiptraq/tiptraq-v3-4c.png',
    alt: 'Homekit sleep centre dashboard listing each night’s recording progress',
    copySide: 'left',
    imagePosition: 'center',
  },
  {
    id: 'review',
    rank: 5,
    cue: '#acd3de',
    title: 'An expert reviews',
    body: 'Every recording is validated by a sleep professional.',
    image: '/tiptraq/tiptraq-v3-5.png',
    alt: 'Homekit recording view with SpO₂, pulse rate and sleep-stage traces',
    copySide: 'right',
    imagePosition: 'center',
  },
  {
    id: 'results',
    rank: 6,
    cue: '#c9b6f2',
    title: 'Your results',
    body: 'Clear oxygen, staging, and TQ-AHI for your phenotype.',
    image: '/tiptraq/tiptraq-v3-6b.png',
    alt: 'A validated Homekit sleep report with TQ-AHI, SpO₂ and sleep-stage summary',
    copySide: 'left',
    imagePosition: 'center',
  },
] as const

export const TIPTRAQ_PAGE_CTA = {
  label: 'Order Homekit',
  href: '/membership',
} as const
