import { redirect } from 'next/navigation'

import { PATIENT_ROUTES } from '@/lib/auth/routes'

export default function MelLegacyRedirectPage() {
  redirect(PATIENT_ROUTES.coach)
}
