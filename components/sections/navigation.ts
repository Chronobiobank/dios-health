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

export const DIOS_MISSION_STATEMENT =
  'Personalising medicine timing to individual body clock variation—not European population norms. Free for every patient. Free for every GP.'

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

/** Landing page footer — grouped key routes */
export const LANDING_FOOTER_SECTIONS: readonly FooterNavSection[] = [
  {
    title: 'Explore',
    links: [
      { label: 'The hook', href: '/#pitch-hook' },
      { label: 'System outcomes', href: '/#pitch-outcomes' },
      { label: 'The problem', href: '/#pitch-problem' },
      { label: 'For NHS leaders', href: '/#pitch-nhs-leaders' },
      { label: 'Governance', href: '/#pitch-governance' },
      { label: 'How it works', href: '/#pitch-how' },
      { label: 'Chronobiobank', href: '/#pitch-model' },
      { label: 'Clinical briefing', href: '/#pitch-cmo-cta' },
    ],
  },
  {
    title: 'Product',
    links: [
      { label: 'Try Mel', href: '/mel' },
      { label: 'Patient signup', href: '/signup' },
      { label: 'Clinician demo', href: '/signup/clinician' },
      { label: 'Dashboard', href: '/dashboard' },
    ],
  },
  {
    title: 'Science',
    links: [
      { label: 'Evidence', href: '/evidence' },
      { label: 'Circadian spectrum', href: '/evidence#spectrum' },
      { label: 'TipTraq validation', href: '/evidence/tiptraq' },
    ],
  },
  {
    title: 'Account & legal',
    links: [
      { label: 'Sign in', href: '/signin' },
      { label: 'Privacy', href: '/privacy' },
      { label: 'Terms', href: '/terms' },
    ],
  },
] as const
