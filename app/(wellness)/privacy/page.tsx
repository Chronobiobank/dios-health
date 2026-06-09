import type { Metadata } from 'next'

import { MarketingPublicShell } from '@/components/sections/marketing/marketing-public-shell'
import { CLOQ_HEALTH_LEGAL_NAME } from '@/lib/brand/cloq-health'

export const metadata: Metadata = {
  title: 'Privacy Policy — CLOQ Health',
  description: `How ${CLOQ_HEALTH_LEGAL_NAME} collects, uses, and protects personal and health data.`,
}

export default function PrivacyPage() {
  return (
    <MarketingPublicShell>
      <main className="kz-detail mx-auto max-w-[76rem] px-5 pb-16 pt-[calc(var(--kz-nav-height,4.5rem)+2rem)] sm:px-6">
        <p className="kz-ey">Legal</p>
        <h1 className="kz-h1 mt-4 max-w-3xl text-[clamp(2rem,4vw,3rem)]">Privacy policy</h1>
        <p className="kz-sup mt-4 max-w-3xl">
          This page will set out how {CLOQ_HEALTH_LEGAL_NAME} collects, uses, stores, and protects personal and
          health-related information for the BodycloQ circadian score programme. Full policy text is being prepared.
        </p>
      </main>
    </MarketingPublicShell>
  )
}
