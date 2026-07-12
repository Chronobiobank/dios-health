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
  description: 'Post a photo into your chemical phenotype feed.',
} as const

export const SHARE_PAGE = {
  eyebrow: 'Dose',
  titleBefore: 'One post,',
  titleHighlight: 'your phenotype',
  support: 'Post into a phenotype feed. People on that chemistry see the night you actually lived.',
  pointsEyebrow: 'How posts work',
  points: [
    'Night Creator, Early Explorer, Twilight Transformer, or Pulse Shifter',
    'People in that phenotype group see today’s post',
    'You stay in control of what you share',
  ],
  cta: { label: 'Post dose', href: '/dose' },
} as const

export const CONNECT_PAGE_META = {
  title: `Sync · ${DEEPDOSE_NAME}`,
  description:
    'Who is online in your biological window — people with compatible chemical phenotypes.',
} as const

export const CONNECT_PAGE = {
  eyebrow: 'Sync',
  titleBefore: 'On your',
  titleHighlight: 'phenotype',
  support: 'People on your chemistry. See their doses. Message when it feels right.',
  cta: { label: 'Open chat', href: '/chat' },
  secondary: { label: 'See my profile', href: '/profile' },
} as const
