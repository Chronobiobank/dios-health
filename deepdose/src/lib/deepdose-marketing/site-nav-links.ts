/** Primary public site navigation — footer and off-canvas menu. */

export const DEEPDOSE_SITE_LINKS = [
  { label: 'Mission', href: '/chronobiobank' },
  { label: 'Technology', href: '/technology' },
  { label: 'Foundation', href: '/foundation' },
  { label: 'Home test', href: '/home-test' },
  { label: 'About', href: '/about' },
  { label: 'Terms', href: '/terms' },
  { label: 'Sign in', href: '/login' },
] as const

export const CHRONOBIOBANK_RESEARCH_ANCHOR = 'research'
export const CHRONOBIOBANK_SCIENCE_ANCHOR = 'science-trust'

export const EVIDENCE_HREF = '/foundation'
export const CHRONOBIOBANK_RESEARCH_HREF = EVIDENCE_HREF
export const CHRONOBIOBANK_SCIENCE_HREF = `/chronobiobank#${CHRONOBIOBANK_SCIENCE_ANCHOR}`

export const TECHNOLOGY_DLMO_PROXY_HREF = '/technology/dlmo-proxy'
