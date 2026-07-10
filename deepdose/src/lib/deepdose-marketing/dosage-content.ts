import { DEEPDOSE_NAME } from '@/lib/brand/deepdose-brand'

export const DOSAGE_PAGE_META = {
  title: `Chemistry · ${DEEPDOSE_NAME}`,
  description:
    'Understand your rhythm and chemistry so you can share what fits and connect with people on a similar clock.',
} as const

export const DOSAGE_PAGE = {
  eyebrow: 'Your chemistry',
  backToProfile: '← Back to profile',
  cta: 'Save my plan',
} as const

export const SHARE_PAGE_META = {
  title: `Share · ${DEEPDOSE_NAME}`,
  description: 'Share what you choose about your chemistry. You stay in control.',
} as const

export const SHARE_PAGE = {
  eyebrow: 'Share',
  titleBefore: 'Share chemistry,',
  titleHighlight: 'keep control',
  support:
    'Share details that help others understand your rhythm. Opt in to research only if you want. You can stop anytime.',
  pointsEyebrow: 'What you share',
  points: [
    'Only what you choose to show for connection',
    'Optional anonymised research, never by default',
    'Off until you turn it on',
  ],
  cta: { label: 'Review sharing', href: '/' },
} as const

export const CONNECT_PAGE_META = {
  title: `Connect · ${DEEPDOSE_NAME}`,
  description: 'Find people on a similar chemistry and rhythm. Message when it feels right.',
} as const

export const CONNECT_PAGE = {
  eyebrow: 'Connect',
  titleBefore: 'Your',
  titleHighlight: 'matches',
  support:
    'People on your rhythm. Share details, connect, and correct together.',
  cta: { label: 'Open chat', href: '/chat' },
  secondary: { label: 'See my profile', href: '/profile' },
} as const
