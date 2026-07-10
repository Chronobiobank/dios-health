/** Site navigation — lean Sniffies chrome. Product routes use bottom nav only. */

/** Splash + marketing header (minimal). Product tabs live in APP_BOTTOM_NAV. */
export const DEEPDOSE_SITE_LINKS = [
  { label: 'Mission', href: '/mission' },
  { label: 'Science', href: '/science' },
  { label: 'Sign in', href: '/login' },
] as const

/** @deprecated Prefer DEEPDOSE_SITE_LINKS — kept for older imports. */
export const DEEPDOSE_SPLASH_LINKS = DEEPDOSE_SITE_LINKS

/** Footer essentials when mounted. */
export const DEEPDOSE_FOOTER_LINKS = [
  { label: 'Connect', href: '/connect' },
  { label: 'Profile', href: '/profile' },
  { label: 'Dosage', href: '/dosage' },
  { label: 'Chat', href: '/chat' },
  { label: 'Sign in', href: '/login' },
  { label: 'Terms', href: '/terms' },
] as const

/** Product routes: bottom nav only, no marketing header. */
export const DEEPDOSE_PRODUCT_PATHS = [
  '/connect',
  '/chat',
  '/profile',
  '/dosage',
  '/login',
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
