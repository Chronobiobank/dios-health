import { DEEPDOSE_NAME } from '@/lib/brand/deepdose-brand'

export const DOSAGE_PAGE_META = {
  title: `Chemistry · ${DEEPDOSE_NAME}`,
  description: 'Your timing tools for what you take.',
} as const

export const DOSAGE_PAGE = {
  eyebrow: 'Your chemistry',
  backToProfile: '← Back to profile',
  cta: 'Save my plan',
} as const

export const SHARE_PAGE_META = {
  title: `Dose · ${DEEPDOSE_NAME}`,
  description: 'Post a photo into your tribe feed.',
} as const

export const SHARE_PAGE = {
  eyebrow: 'Dose',
  titleBefore: 'One post,',
  titleHighlight: 'your tribe',
  support: 'Post into a tribe feed. People on that chemistry see the night you actually lived.',
  pointsEyebrow: 'How posts work',
  points: [
    'Wolf, Lion, Bear, or Dolphin',
    'People in that tribe see today’s post',
    'You stay in control of what you share',
  ],
  cta: { label: 'Post dose', href: '/dose' },
} as const

export const CONNECT_PAGE_META = {
  title: `Sync · ${DEEPDOSE_NAME}`,
  description:
    'Who is online in your biological window — people in your tribe.',
} as const

export const CONNECT_PAGE = {
  eyebrow: 'Sync',
  titleBefore: 'On your',
  titleHighlight: 'tribe',
  support: 'People on your chemistry. See their doses. Message when it feels right.',
  cta: { label: 'Open chat', href: '/chat' },
  secondary: { label: 'See my profile', href: '/profile' },
} as const
