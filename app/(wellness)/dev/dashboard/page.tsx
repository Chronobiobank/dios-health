import { DashboardClient } from '@/components/patient-dashboard/dashboard-client'
import { MOCK_DASHBOARD_PROPS } from '@/lib/patient-dashboard/mock-snapshot'

export const metadata = {
  title: 'Dev dashboard — Sean James snapshot',
}

export default function DevDashboardPage() {
  return <DashboardClient {...MOCK_DASHBOARD_PROPS} reserveBottomNav={false} />
}
