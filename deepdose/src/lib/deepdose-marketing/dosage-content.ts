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
  /** Guest page head — hidden when member AppTopBar owns “Sync”. */
  title: 'Deepdose in Action',
  /**
   * Guest hub — how + join only (matches unlock after signup).
   * Titles = 12 chars (1 line). Bodies = two lines × 14 chars — even wrap.
   * CTAs = 7 chars.
   */
  hub: [
    {
      id: 'how',
      title: 'How it works',
      body: ['Your phenotype', 'in four steps.'] as const,
      href: '/how',
      cta: 'See how',
    },
    {
      id: 'join',
      title: 'Free to join',
      body: ['Screen yourself', 'in a few secs.'] as const,
      href: '/founders/join',
      cta: 'Sign up',
    },
  ],
} as const
