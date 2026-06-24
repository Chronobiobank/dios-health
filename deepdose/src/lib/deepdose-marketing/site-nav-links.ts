/** Public site navigation — header vs footer link sets. */

export const DEEPDOSE_SITE_LINKS = [
  { label: 'Mission', href: '/chronobiobank' },
  { label: 'Technology', href: '/technology' },
  { label: 'Science', href: '/science' },
  { label: 'Foundation', href: '/foundation' },
  { label: 'Home test', href: '/home-test' },
  { label: 'Sign in', href: '/login' },
] as const

export const DEEPDOSE_FOOTER_EXTRA_LINKS = [
  { label: 'Research partners', href: '/partners' },
  { label: 'About', href: '/about' },
  { label: 'Terms', href: '/terms' },
] as const

export const DEEPDOSE_FOOTER_LINKS = [...DEEPDOSE_SITE_LINKS, ...DEEPDOSE_FOOTER_EXTRA_LINKS] as const

export const CHRONOBIOBANK_RESEARCH_ANCHOR = 'research'
export const CHRONOBIOBANK_SCIENCE_ANCHOR = 'science-trust'

export const EVIDENCE_HREF = '/foundation'
export const CHRONOBIOBANK_RESEARCH_HREF = EVIDENCE_HREF
export const CHRONOBIOBANK_SCIENCE_HREF = '/science'

export const TECHNOLOGY_DLMO_PROXY_HREF = '/technology/dlmo-proxy'
