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
  description:
    'Post a presence photo into your tribe feed so people in your window can Sync.',
} as const

export const SHARE_PAGE = {
  eyebrow: 'Dose',
  titleBefore: 'Presence first,',
  titleHighlight: 'then Sync',
  support:
    'Post a photo into your tribe feed. People on your chemistry see you — Sync follows. Adult unlock stays secondary.',
  pointsEyebrow: 'How doses work',
  points: [
    'Presence photo — no captions',
    'Your tribe sees you in their window',
    'Sync is recognition — not a free like',
  ],
  cta: { label: 'Post your dose', href: '/dose' },
} as const

export const CONNECT_PAGE_META = {
  title: `Sync · ${DEEPDOSE_NAME}`,
  description:
    'Who is online in your biological window — people in your tribe.',
} as const

export const MATCHES_PAGE_META = {
  title: `Matches · ${DEEPDOSE_NAME}`,
  description: 'People awake in your biological window right now.',
} as const

export const CONNECT_PAGE = {
  eyebrow: 'Sync',
  titleBefore: 'On your',
  titleHighlight: 'tribe',
  support: 'People on your chemistry. See their doses. Message when it feels right.',
  cta: { label: 'Open chat', href: '/chat' },
  secondary: { label: 'See my profile', href: '/profile' },
  /**
   * Hub actions — bodies = 33 chars so the three tiles read even.
   */
  hub: [
    {
      id: 'how',
      title: 'See how Deepdose works',
      body: 'Phenotype to tribe in four steps.',
      href: '/how',
    },
    {
      id: 'awake',
      title: 'Find people awake now',
      body: 'See who is online in your window.',
      href: '/matches',
    },
    {
      id: 'join',
      title: 'Claim free membership',
      body: 'Two meds, then open your profile.',
      href: '/founders/join',
    },
  ],
} as const
