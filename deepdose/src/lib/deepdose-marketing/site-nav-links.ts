/** Public site navigation — header (full) vs footer (essentials only). */

import { PROBLEM_PAGE_HREF } from '@/lib/deepdose-marketing/problem-content'

export const DEEPDOSE_SITE_LINKS = [
  { label: 'The Fix', href: PROBLEM_PAGE_HREF },
  { label: 'Mission', href: '/chronobiobank' },
  { label: 'Technology', href: '/technology' },
  { label: 'Science', href: '/science' },
  { label: 'Testkit', href: '/home-test' },
  { label: 'Doses', href: '/patient-landing' },
  { label: 'Community', href: '/partners' },
  { label: 'Membership', href: '/pricing' },
  { label: 'Sign in', href: '/login' },
] as const

/** Footer — primary paths only; detail pages stay in header nav. */
export const DEEPDOSE_FOOTER_LINKS = [
  { label: 'Your plan', href: '/patient-landing' },
  { label: 'Science', href: '/science' },
  { label: 'Pricing', href: '/pricing' },
  { label: 'Sign in', href: '/login' },
  { label: 'Terms', href: '/terms' },
] as const

export const CHRONOBIOBANK_RESEARCH_ANCHOR = 'research'
export const CHRONOBIOBANK_SCIENCE_ANCHOR = 'science-trust'

export const EVIDENCE_HREF = '/science#evidence'
export const CHRONOBIOBANK_RESEARCH_HREF = EVIDENCE_HREF
export const CHRONOBIOBANK_SCIENCE_HREF = '/science'

export const TECHNOLOGY_DLMO_PROXY_HREF = '/technology/dlmo-proxy'
