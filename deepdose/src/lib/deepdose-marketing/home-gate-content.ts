import { DEEPDOSE_NAME } from '@/lib/brand/deepdose-brand'

/** Home splash chrome · med baseline + Terms. Auth on /login. */
export const DEEPDOSE_HOME_GATE = {
  signInLabel: 'Sign in',
  reportLabel: 'Report',
  agreeLine: 'You must be 18+ y/o to enter and agree to our',
  links: {
    about: { label: 'About us', href: '/how' },
    terms: { label: 'Terms', href: '/terms' },
    report: { label: 'Report', href: '/report' },
  },
} as const

export const SAFETY_PAGE = {
  title: 'Safety Policy',
  lede: 'Adults only. No harassment, exploitation, or illegal content.',
  sections: [
    {
      heading: 'Age',
      body: 'You must be 18 or older to create an account or use Friends and Chat. If we learn someone is under 18, we remove the account.',
    },
    {
      heading: 'Respect',
      body: 'No threats, stalking, hate, non-consensual sexual content, or sharing someone else’s private health or identity data without permission.',
    },
    {
      heading: 'Health boundary',
      body: `${DEEPDOSE_NAME} helps people discover their chemical phenotype, score their chemistry, share doses, and sync with peers. It is not emergency care or a clinic. If you are in crisis, contact local emergency services or a trusted clinician.`,
    },
    {
      heading: 'Reporting',
      body: 'Use Report to flag profiles, messages, or content. We review reports and may warn, restrict, or remove accounts.',
    },
  ],
} as const

export const TAKE_IT_DOWN_PAGE = {
  title: 'Take It Down Act Policy',
  lede: 'We remove nonconsensual intimate imagery when notified.',
  sections: [
    {
      heading: 'What we remove',
      body: 'Intimate images or videos shared without consent, deepfakes of intimate content, and links that primarily distribute that material.',
    },
    {
      heading: 'How to request removal',
      body: 'Submit a request on the Report page with URLs, usernames, and enough detail for us to find the content. We act on valid requests as quickly as practicable.',
    },
    {
      heading: 'False reports',
      body: 'Knowingly false removal requests may result in account action.',
    },
  ],
} as const

export const REPORT_PAGE = {
  title: 'Report content',
  lede: 'Flag a profile, message, or post for review.',
  email: 'safety@deepdose.org',
  body: 'Email the link, a short note, and whether this is a safety report or a removal request. Do not send passwords or medical records.',
} as const

/** Compact Terms copy — chemistry soul-matching network, not clinical CDS. */
export const TERMS_PAGE = {
  title: 'Terms of use',
  lede: 'By using Deepdose you agree. You must be 18+.',
  body: `By using ${DEEPDOSE_NAME} you agree to these terms. You must be 18+. We are not a clinic or emergency care.`,
} as const

export const STATEMENT_2257_PAGE = {
  title: '18 U.S.C. § 2257 Statement',
  lede: 'Deepdose does not produce sexually explicit content.',
  sections: [
    {
      heading: 'Records',
      body: 'To the extent any content on this service could be construed as covered by 18 U.S.C. § 2257 or related regulations, age and identity records for that material are maintained by the individual who uploaded or created it, not by Deepdose as a producer.',
    },
    {
      heading: 'Custodian of records',
      body: 'For questions about this statement or lawful records requests, contact legal@deepdose.org. For content removal, use the Report page.',
    },
  ],
} as const
