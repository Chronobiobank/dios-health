/** Public site navigation — header vs footer link sets. */

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

export const DEEPDOSE_FOOTER_EXTRA_LINKS = [
  { label: 'About', href: '/about' },
  { label: 'Terms', href: '/terms' },
] as const

export const DEEPDOSE_FOOTER_LINKS = [...DEEPDOSE_SITE_LINKS, ...DEEPDOSE_FOOTER_EXTRA_LINKS] as const

export const CHRONOBIOBANK_RESEARCH_ANCHOR = 'research'
export const CHRONOBIOBANK_SCIENCE_ANCHOR = 'science-trust'

export const EVIDENCE_HREF = '/science#evidence'
export const CHRONOBIOBANK_RESEARCH_HREF = EVIDENCE_HREF
export const CHRONOBIOBANK_SCIENCE_HREF = '/science'

export const TECHNOLOGY_DLMO_PROXY_HREF = '/technology/dlmo-proxy'
