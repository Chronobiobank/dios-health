/** Site navigation — light OpenAI chrome. Product routes use bottom nav only. */

/** Marketing header. Product tabs live in APP_BOTTOM_NAV. */
export const DEEPDOSE_SITE_LINKS = [
  { label: 'How it works', href: '/how' },
  { label: 'Homekit', href: '/testkit' },
  { label: 'Pricing', href: '/membership' },
  { label: 'Science', href: '/science' },
] as const

export const DEEPDOSE_SITE_CTA = {
  label: 'Sign up',
  href: '/founders/join',
} as const

/** @deprecated Prefer DEEPDOSE_SITE_LINKS — kept for older imports. */
export const DEEPDOSE_SPLASH_LINKS = DEEPDOSE_SITE_LINKS

/** Footer essentials when mounted. */
export const DEEPDOSE_FOOTER_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'Homekit', href: '/testkit' },
  { label: 'Pricing', href: '/membership' },
  { label: 'Share', href: '/grid' },
  { label: 'Dose', href: '/dose' },
  { label: 'Sync', href: '/connect' },
  { label: 'Profile', href: '/profile' },
  { label: 'Terms', href: '/terms' },
] as const

/** Product routes: bottom nav only, no marketing header. */
export const DEEPDOSE_PRODUCT_PATHS = [
  '/grid',
  '/dose',
  '/bank',
  '/profile',
  '/account',
  '/dosage',
  '/connect',
  '/matches',
  '/chat',
  '/real',
] as const

export function isDeepdoseProductPath(pathname: string): boolean {
  return DEEPDOSE_PRODUCT_PATHS.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`)
  )
}

export const CHRONOBIOBANK_RESEARCH_ANCHOR = 'research'
export const CHRONOBIOBANK_SCIENCE_ANCHOR = 'science-trust'

export const EVIDENCE_HREF = '/science#evidence'
export const CHRONOBIOBANK_RESEARCH_HREF = EVIDENCE_HREF
export const CHRONOBIOBANK_SCIENCE_HREF = '/science'

export const TECHNOLOGY_DLMO_PROXY_HREF = '/technology/dlmo-proxy'
