export const NAV_LINKS = [
  { label: 'How it works', href: '/#pitch-how' },
  { label: 'Technology', href: '/technology' },
] as const

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
  { label: 'Sign in', href: '/signin' },
  { label: 'Sign up', href: '/signup' },
] as const

export const NAV_MENU_LINKS = [
  ...NAV_LINKS,
  { label: 'Contact DIOS', href: '/contact' },
] as const

export const DIOS_MISSION_STATEMENT = 'Precision Chronotherapy'

export const FOOTER_LINKS = [
  { label: 'How it works', href: '/#pitch-how' },
  { label: 'The science', href: '/evidence' },
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

/** Landing page footer — 12 links, 3 columns × 4 */
export const LANDING_FOOTER_SECTIONS: readonly FooterNavSection[] = [
  {
    title: 'Product',
    links: [
      { label: 'How it works', href: '/technology' },
      { label: 'Clinician demo', href: '/signup/clinician' },
      { label: 'Patient signup', href: '/signup' },
      { label: 'Dashboard', href: '/dashboard' },
    ],
  },
  {
    title: 'Science',
    links: [
      { label: 'Clinical evidence', href: '/evidence' },
      { label: 'Technology', href: '/technology' },
      { label: 'TipTraQ', href: '/tiptraq' },
      { label: 'Founder paper', href: '/pitch/problem' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'Contact DIOS', href: '/contact' },
      { label: 'Credibility', href: '/pitch/credibility' },
      { label: 'Privacy', href: '/privacy' },
      { label: 'Terms', href: '/terms' },
    ],
  },
] as const
