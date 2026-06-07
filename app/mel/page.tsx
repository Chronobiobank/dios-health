import { redirect } from 'next/navigation'

import { PATIENT_ROUTES } from '@/lib/auth/routes'

/** Legacy /mel URL — redirects to DINA coach. */
export default function LegacyCoachRedirectPage() {
  redirect(PATIENT_ROUTES.coach)
}
