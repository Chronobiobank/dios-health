/** Primary public site navigation — footer and off-canvas menu. */

export const DEEPDOSE_SITE_LINKS = [
  { label: 'Chronobiobank', href: '/chronobiobank' },
  { label: 'Home test', href: '/home-test' },
  { label: 'About', href: '/about' },
  { label: 'Terms', href: '/terms' },
  { label: 'Sign in', href: '/login' },
] as const

export const CHRONOBIOBANK_RESEARCH_ANCHOR = 'research'
export const CHRONOBIOBANK_SCIENCE_ANCHOR = 'science-trust'

export const CHRONOBIOBANK_RESEARCH_HREF = `/chronobiobank#${CHRONOBIOBANK_RESEARCH_ANCHOR}`
export const CHRONOBIOBANK_SCIENCE_HREF = `/chronobiobank#${CHRONOBIOBANK_SCIENCE_ANCHOR}`
