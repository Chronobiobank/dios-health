import { DEEPDOSE_NAME } from '@/lib/brand/deepdose-brand'

export const DOSAGE_PAGE_META = {
  title: `Chemistry · ${DEEPDOSE_NAME}`,
  description:
    'Your timing tools for what you take.',
} as const

export const DOSAGE_PAGE = {
  eyebrow: 'Your chemistry',
  backToProfile: '← Back to profile',
  cta: 'Save my plan',
} as const

export const SHARE_PAGE_META = {
  title: `Log · ${DEEPDOSE_NAME}`,
  description: 'Log a dose — photo plus sleep score.',
} as const

export const SHARE_PAGE = {
  eyebrow: 'Log',
  titleBefore: 'One dose,',
  titleHighlight: 'today’s score',
  support: 'Log a dose. People on your clock see the night you actually lived.',
  pointsEyebrow: 'How doses work',
  points: [
    'Night, Day, Energy, or Fuel — photo plus sleep score',
    'People on your clock see today’s dose',
    'You stay in control of what you share',
  ],
  cta: { label: 'Log dose', href: '/dose' },
} as const

export const CONNECT_PAGE_META = {
  title: `Friends · ${DEEPDOSE_NAME}`,
  description: 'People on your clock who see today’s doses.',
} as const

export const CONNECT_PAGE = {
  eyebrow: 'Friends',
  titleBefore: 'On your',
  titleHighlight: 'clock',
  support: 'People on your rhythm. See their doses. Message when it feels right.',
  cta: { label: 'Open chat', href: '/chat' },
  secondary: { label: 'See my profile', href: '/profile' },
} as const
