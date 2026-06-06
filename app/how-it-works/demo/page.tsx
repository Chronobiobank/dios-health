import type { Metadata } from 'next'

import { DashboardClient } from '@/components/patient-dashboard/dashboard-client'
import { MOCK_DASHBOARD_PROPS } from '@/lib/patient-dashboard/mock-snapshot'

export const metadata: Metadata = {
  title: 'Live demo — How it works · DIOS',
  description:
    'Sean James daily snapshot — Photonic Age vs Calendar Age, Chronoimmune indication spectrum, and personalised next steps.',
}

export default function HowItWorksDemoPage() {
  return (
    <div className="calm-landing dios-nav-tone-canvas dios-page-top-bleed relative min-h-svh">
      <DashboardClient {...MOCK_DASHBOARD_PROPS} reserveBottomNav={false} />
    </div>
  )
}
