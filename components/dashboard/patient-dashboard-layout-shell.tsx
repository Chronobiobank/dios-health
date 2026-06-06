import type { ReactNode } from 'react'

import { requirePatientSession } from '@/lib/auth/require-patient'

export async function PatientDashboardLayoutShell({ children }: { children: ReactNode }) {
  await requirePatientSession()
  return <div className="patient-dashboard-layout__content">{children}</div>
}
