import { COACH_ASK_LABEL } from '@/lib/coach/brand'
import { CLINICIAN_ENTRY, PATIENT_PREVIEW_ENTRY } from '@/lib/pitch/audience-entry-content'

export function isPatientDashboardPath(pathname: string): boolean {
  const normalized =
    pathname.endsWith('/') && pathname.length > 1 ? pathname.slice(0, -1) : pathname
  return normalized === '/dashboard' || normalized.startsWith('/dashboard/')
}

/** Always visible in the marketing site header */
export const NAV_DASHBOARD_LINK = {
  label: 'Go to dashboard',
  href: '/dashboard',
  mobileLabel: 'Dashboard',
} as const

export const NAV_COACH_LINK = {
  label: COACH_ASK_LABEL,
  href: '/dashboard/coach',
} as const

export const AUTH_LINKS = [
  { label: 'Sign in', href: '/auth/signin' },
  { label: PATIENT_PREVIEW_ENTRY.navLabel, href: PATIENT_PREVIEW_ENTRY.href },
  { label: CLINICIAN_ENTRY.navLabel, href: CLINICIAN_ENTRY.href },
] as const

/** Off-canvas / hamburger menu — keep to primary routes only */
export const NAV_MENU_LINKS = [
  { label: 'How it works', href: '/how-it-works' },
  { label: 'For clinicians', href: '/clinicians' },
  { label: 'DINA', href: '/dina' },
  { label: 'Clinical evidence', href: '/evidence' },
  { label: 'Contact DIOS', href: '/contact' },
] as const

export const DIOS_MISSION_STATEMENT = 'The Home of Chronoimmunology'

export const FOOTER_LINKS = [
  { label: 'How it works', href: '/how-it-works' },
  { label: 'Clinical evidence', href: '/evidence' },
  { label: 'For clinicians', href: '/clinicians' },
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

/** Site footer — product, science, and legal routes for marketing pages */
export const LANDING_FOOTER_SECTIONS: readonly FooterNavSection[] = [
  {
    title: 'Product',
    links: [
      { label: 'How it works', href: '/how-it-works' },
      { label: 'DINA', href: '/dina' },
      { label: PATIENT_PREVIEW_ENTRY.navLabel, href: PATIENT_PREVIEW_ENTRY.href },
      { label: CLINICIAN_ENTRY.navLabel, href: CLINICIAN_ENTRY.href },
      { label: 'For clinicians', href: '/clinicians' },
      { label: 'Sign in', href: '/auth/signin' },
      { label: 'Contact', href: '/contact' },
    ],
  },
  {
    title: 'Science',
    links: [
      { label: 'Clinical evidence', href: '/evidence' },
      { label: 'Science', href: '/science' },
      { label: 'Chronobiobank', href: '/chronobiobank' },
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
