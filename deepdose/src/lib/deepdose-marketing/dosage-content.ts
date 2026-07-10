import { DEEPDOSE_NAME } from '@/lib/brand/deepdose-brand'

export const DOSAGE_PAGE_META = {
  title: `Chemistry · ${DEEPDOSE_NAME}`,
  description:
    'Your rhythm and dosing tools — secondary to today’s Real.',
} as const

export const DOSAGE_PAGE = {
  eyebrow: 'Your chemistry',
  backToProfile: '← Back to profile',
  cta: 'Save my plan',
} as const

export const SHARE_PAGE_META = {
  title: `Post · ${DEEPDOSE_NAME}`,
  description: 'Post today’s Real — a photo plus your sleep score.',
} as const

export const SHARE_PAGE = {
  eyebrow: 'Real',
  titleBefore: 'One photo,',
  titleHighlight: 'today’s score',
  support: 'Post today’s Real. Friends on your clock see the night you actually lived.',
  pointsEyebrow: 'How Real works',
  points: [
    'One Real per day — photo plus SRI',
    'Friends see today’s beat',
    'You stay in control of what you post',
  ],
  cta: { label: 'Post Real', href: '/real/post' },
} as const

export const CONNECT_PAGE_META = {
  title: `Friends · ${DEEPDOSE_NAME}`,
  description: 'People on your clock who see your daily Real.',
} as const

export const CONNECT_PAGE = {
  eyebrow: 'Friends',
  titleBefore: 'On your',
  titleHighlight: 'clock',
  support: 'People on your rhythm. See their Reals. Message when it feels right.',
  cta: { label: 'Open chat', href: '/chat' },
  secondary: { label: 'See my profile', href: '/profile' },
} as const
