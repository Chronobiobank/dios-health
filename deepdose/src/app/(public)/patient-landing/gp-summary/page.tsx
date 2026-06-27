import type { Metadata } from 'next'
import { Suspense } from 'react'

import { GpSummaryDocument } from '@/components/deepdose/GpSummaryDocument'
import { DEEPDOSE_NAME } from '@/lib/brand/deepdose-brand'
import { LANDING_GP_HANDOFF_COPY } from '@/lib/deepdose-marketing/landing-content'

export const metadata: Metadata = {
  title: `${LANDING_GP_HANDOFF_COPY.summaryTitle} · ${DEEPDOSE_NAME}`,
  description: LANDING_GP_HANDOFF_COPY.summaryMeta,
  robots: { index: false, follow: false },
}

export default function GpSummaryPage() {
  return (
    <section className="seco-page seco-marketing-page gp-summary-page">
      <div className="seco-landing__section-inner">
        <Suspense fallback={null}>
          <GpSummaryDocument />
        </Suspense>
      </div>
    </section>
  )
}
