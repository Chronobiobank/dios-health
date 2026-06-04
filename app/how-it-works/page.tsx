import { DashboardClient } from '@/components/patient-dashboard/dashboard-client'
import { MOCK_DASHBOARD_PROPS } from '@/lib/patient-dashboard/mock-snapshot'

export const dynamic = 'force-dynamic'

/** Public demo of the patient dashboard — linked from landing Dose Intelligence tile. */
export default function HowItWorksPage() {
  return <DashboardClient {...MOCK_DASHBOARD_PROPS} reserveBottomNav={false} />
}
