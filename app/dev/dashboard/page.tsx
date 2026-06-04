import { notFound } from 'next/navigation'

import { DashboardClient } from '@/components/patient-dashboard/dashboard-client'
import { MOCK_DASHBOARD_PROPS } from '@/lib/patient-dashboard/mock-snapshot'

export const dynamic = 'force-dynamic'

/** Local-only dashboard for live design work — no sign-in, mock data, hot reload. */
export default function DevDashboardPreviewPage() {
  if (process.env.NODE_ENV === 'production') {
    notFound()
  }

  return <DashboardClient {...MOCK_DASHBOARD_PROPS} />
}
