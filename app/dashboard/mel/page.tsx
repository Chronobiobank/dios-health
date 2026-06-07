import { redirect } from 'next/navigation'

import { PATIENT_ROUTES } from '@/lib/auth/routes'

/** Legacy /dashboard/mel URL — redirects to DINA coach. */
export default function LegacyDashboardCoachRedirectPage() {
  redirect(PATIENT_ROUTES.coach)
}
