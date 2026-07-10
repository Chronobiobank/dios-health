import { DEEPDOSE_NAME } from '@/lib/brand/deepdose-brand'

export const DOSAGE_PAGE_META = {
  title: `Dosage · ${DEEPDOSE_NAME}`,
  description:
    'Six medical doses timed to raise Sleep Regularity Index. Medicines cluster under Biomedical.',
} as const

export const DOSAGE_PAGE = {
  eyebrow: 'Dosage protocol',
  backToProfile: '← Back to profile',
  cta: 'Save my plan',
} as const

export const SHARE_PAGE_META = {
  title: `Share · ${DEEPDOSE_NAME}`,
  description: 'Share anonymised timing outcomes for research. You choose what leaves your phone.',
} as const

export const SHARE_PAGE = {
  eyebrow: 'Share',
  titleBefore: 'Help research,',
  titleHighlight: 'keep control',
  support:
    'Opt in to share anonymised sleep and timing outcomes. No names. No raw sensor dumps. You can stop anytime.',
  pointsEyebrow: 'What you share',
  points: [
    'Contributor hash only, never your name',
    'Outcomes that help atypical folk get better timing evidence',
    'Off by default until you turn it on',
  ],
  cta: { label: 'Turn on research sharing', href: '/login' },
} as const

export const CONNECT_PAGE_META = {
  title: `Connect · ${DEEPDOSE_NAME}`,
  description: 'Find people on a similar rhythm for social chats and shared timing wins.',
} as const

export const CONNECT_PAGE = {
  eyebrow: 'Connect',
  titleBefore: 'Find your',
  titleHighlight: 'chemistry',
  support: 'Matched on body clock, medicines, and journey. Not labels.',
  cta: { label: 'Open chat', href: '/chat' },
  secondary: { label: 'See my profile', href: '/profile' },
} as const
