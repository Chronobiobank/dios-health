/** Always visible in the marketing site header */
export const NAV_DASHBOARD_LINK = {
  label: 'Go to dashboard',
  href: '/dashboard',
  mobileLabel: 'Dashboard',
} as const

export const NAV_COACH_LINK = {
  label: 'Ask DIOS',
  href: '/dashboard/coach',
} as const

export const AUTH_LINKS = [
  { label: 'Sign in', href: '/auth/signin' },
  { label: 'Sign up', href: '/onboarding' },
] as const

/** Off-canvas / hamburger menu — keep to primary routes only */
export const NAV_MENU_LINKS = [
  { label: 'How it works', href: '/how-it-works' },
  { label: 'Clinical evidence', href: '/evidence' },
  { label: 'Contact DIOS', href: '/contact' },
] as const

export const DIOS_MISSION_STATEMENT = 'Dose Intelligence'

export const FOOTER_LINKS = [
  { label: 'How it works', href: '/how-it-works' },
  { label: 'Clinical evidence', href: '/evidence' },
  { label: 'For clinicians', href: '/signup/clinician' },
  { label: 'Privacy', href: '/privacy' },
  { label: 'Terms', href: '/terms' },
] as const

export const FOOTER_EXPLORE_LINKS = FOOTER_LINKS

export const FOOTER_LEGAL_LINKS = [
  { label: 'Privacy', href: '/privacy' },
  { label: 'Terms', href: '/terms' },
] as const

export type FooterNavLink = { label: string; href: string }

export type FooterNavSection = {
  title: string
  links: readonly FooterNavLink[]
}

/** Landing page footer — primary routes only */
export const LANDING_FOOTER_SECTIONS: readonly FooterNavSection[] = [
  {
    title: 'Product',
    links: [
      { label: 'How it works', href: '/how-it-works' },
      { label: 'Clinician demo', href: '/signup/clinician' },
      { label: 'Contact DIOS', href: '/contact' },
    ],
  },
  {
    title: 'Science',
    links: [
      { label: 'Clinical evidence', href: '/evidence' },
      { label: 'Circadian model', href: '/circadian-digital-twin' },
      { label: 'TipTraQ', href: '/tiptraq' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { label: 'Privacy', href: '/privacy' },
      { label: 'Terms', href: '/terms' },
    ],
  },
] as const
