import type { Metadata } from 'next'

import { MarketingPublicShell } from '@/components/sections/marketing/marketing-public-shell'
import { CLOQ_HEALTH_LEGAL_NAME } from '@/lib/brand/cloq-health'

export const metadata: Metadata = {
  title: 'Terms of Service — CLOQ Health',
  description: `Terms governing use of ${CLOQ_HEALTH_LEGAL_NAME} services and the BodycloQ score.`,
}

export default function TermsPage() {
  return (
    <MarketingPublicShell>
      <main className="kz-detail mx-auto max-w-[76rem] px-5 pb-16 pt-[calc(var(--kz-nav-height,4.5rem)+2rem)] sm:px-6">
        <p className="kz-ey">Legal</p>
        <h1 className="kz-h1 mt-4 max-w-3xl text-[clamp(2rem,4vw,3rem)]">Terms of service</h1>
        <p className="kz-sup mt-4 max-w-3xl">
          This page will set out the terms governing access to and use of {CLOQ_HEALTH_LEGAL_NAME} services, including
          the BodycloQ circadian score and Q cue delivery. Full terms are being prepared.
        </p>
      </main>
    </MarketingPublicShell>
  )
}
