import { notFound } from 'next/navigation'

import { RetinomicDashboardClient } from '@/components/retinomic/retinomic-dashboard-client'
import { MOCK_RETINOMIC_DASHBOARD } from '@/lib/retinomic/mock-dashboard-props'

export const dynamic = 'force-dynamic'

/** Local-only dashboard for live design work — no sign-in, mock data, hot reload. */
export default function DevDashboardPreviewPage() {
  if (process.env.NODE_ENV === 'production') {
    notFound()
  }

  return <RetinomicDashboardClient {...MOCK_RETINOMIC_DASHBOARD} />
}
