import { redirect } from 'next/navigation'

import { PATIENT_ROUTES } from '@/lib/auth/routes'

export default function DashboardTwinRedirectPage() {
  redirect(PATIENT_ROUTES.timebot)
}
