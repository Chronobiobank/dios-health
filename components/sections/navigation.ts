export const NAV_LINKS = [
  { label: 'How it works', href: '/#how-it-works' },
  { label: 'The science', href: '/evidence/tiptraq' },
] as const

/** Always visible in the marketing site header */
export const NAV_DASHBOARD_LINK = {
  label: 'Go to dashboard',
  href: '/dashboard',
  mobileLabel: 'Dashboard',
} as const

export const AUTH_LINKS = [
  { label: 'Sign in', href: '/signin' },
  { label: 'Sign up', href: '/signup' },
] as const

export const NAV_MENU_LINKS = [
  ...NAV_LINKS,
  { label: 'Request demo', href: '/#demo' },
] as const

export const FOOTER_LINKS = [
  { label: 'How it works', href: '/#how-it-works' },
  { label: 'The science', href: '/evidence/tiptraq' },
  { label: 'For clinicians', href: '/for-clinicians' },
  { label: 'Privacy', href: '/privacy' },
  { label: 'Terms', href: '/terms' },
] as const

export const FOOTER_EXPLORE_LINKS = FOOTER_LINKS

export const FOOTER_LEGAL_LINKS = [
  { label: 'Privacy', href: '/privacy' },
  { label: 'Terms', href: '/terms' },
] as const
