import { redirect } from 'next/navigation'

import { PATIENT_ROUTES } from '@/lib/auth/routes'

export default function DashboardMelRedirectPage() {
  redirect(PATIENT_ROUTES.coach)
}
