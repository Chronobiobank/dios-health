import { CLINIC_ROUTES, FULFILLMENT_ROUTES, PATIENT_ROUTES, SHOP_ROUTES } from '@/lib/auth/routes'

export type MobileNavLink = {
  label: string
  href: string
  cta?: boolean
}

export function isClinicAppPath(pathname: string): boolean {
  const normalized =
    pathname.endsWith('/') && pathname.length > 1 ? pathname.slice(0, -1) : pathname
  return normalized === '/clinic' || normalized.startsWith('/clinic/')
}

/** All patient dashboard routes — bottom nav shows a subset; overflow menu shows the rest. */
export const PATIENT_MOBILE_NAV_LINKS: MobileNavLink[] = [
  { label: 'Home', href: PATIENT_ROUTES.dashboard },
  { label: 'Coach', href: PATIENT_ROUTES.coach },
  { label: 'Insights', href: PATIENT_ROUTES.insights },
  { label: 'Orders', href: FULFILLMENT_ROUTES.patientOrders },
  { label: 'Streams', href: PATIENT_ROUTES.streams },
  { label: 'Blood results', href: PATIENT_ROUTES.streamsBloods },
  { label: 'Report', href: PATIENT_ROUTES.report },
  { label: 'First light', href: PATIENT_ROUTES.firstLight },
  { label: 'Premium', href: PATIENT_ROUTES.premium },
  { label: 'Data controls', href: PATIENT_ROUTES.dataControls },
  { label: 'Profile & settings', href: PATIENT_ROUTES.profile },
  { label: 'Supplements shop', href: SHOP_ROUTES.catalog },
]

/** All clinician workspace routes. */
export const CLINICIAN_MOBILE_NAV_LINKS: MobileNavLink[] = [
  { label: 'Cohort panel', href: CLINIC_ROUTES.panel },
  { label: 'Protocol orders', href: FULFILLMENT_ROUTES.clinicOrders },
  { label: 'Patient list', href: CLINIC_ROUTES.patients },
  { label: 'Settings', href: CLINIC_ROUTES.settings },
  { label: 'Clinicians home', href: '/clinicians' },
]
