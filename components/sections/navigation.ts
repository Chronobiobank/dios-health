export const NAV_LINKS = [
  { label: 'How it works', href: '/#how-it-works' },
  { label: 'Evidence', href: '/evidence' },
  { label: 'Pricing', href: '/#pricing' },
] as const

export const AUTH_LINKS = [
  { label: 'Sign in', href: '/sign-in' },
  { label: 'Sign up', href: '/sign-up' },
] as const

export const NAV_MENU_LINKS = [
  ...NAV_LINKS,
  { label: 'Request demo', href: '/#demo' },
] as const

export const FOOTER_EXPLORE_LINKS = [
  ...NAV_LINKS,
  { label: 'Researchers', href: '/#researchers' },
  { label: 'Request demo', href: '/#demo' },
] as const

export const FOOTER_LEGAL_LINKS = [
  { label: 'Privacy', href: '/privacy' },
  { label: 'Terms', href: '/terms' },
] as const
