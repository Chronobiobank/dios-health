import type { Metadata } from 'next'

import { HowItWorksDemoHero } from '@/components/retinomic/how-it-works-demo-hero'
import { RetinomicDashboardClient } from '@/components/retinomic/retinomic-dashboard-client'
import { MOCK_RETINOMIC_DASHBOARD } from '@/lib/retinomic/mock-dashboard-props'
import { HOW_IT_WORKS_DEMO_COPY } from '@/lib/pitch/retinomic-landing-copy'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: `${HOW_IT_WORKS_DEMO_COPY.headline} · DIOS`,
  description: HOW_IT_WORKS_DEMO_COPY.subheadline,
}

/** Public live demo — same day-one dashboard patients see after baseline scan */
export default function HowItWorksPage() {
  return (
    <>
      <HowItWorksDemoHero />
      <RetinomicDashboardClient {...MOCK_RETINOMIC_DASHBOARD} publicDemo />
    </>
  )
}
