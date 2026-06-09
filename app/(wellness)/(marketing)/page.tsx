import type { Metadata } from 'next'

import { CloqLanding } from '@/components/sections/marketing/cloq-landing'
import { MarketingShell } from '@/components/sections/marketing-shell'
import { CLOQ_HEALTH_SITE_URL } from '@/lib/brand/cloq-health'
import { CORPORATE_LANDING_META } from '@/lib/pitch/corporate-landing-content'

import '@/app/styles/cloq-landing.css'

export const metadata: Metadata = {
  metadataBase: new URL(CLOQ_HEALTH_SITE_URL),
  title: CORPORATE_LANDING_META.title,
  description: CORPORATE_LANDING_META.description,
  openGraph: {
    url: CLOQ_HEALTH_SITE_URL,
    title: CORPORATE_LANDING_META.openGraphTitle,
    description: CORPORATE_LANDING_META.openGraphDescription,
  },
  twitter: {
    title: CORPORATE_LANDING_META.openGraphTitle,
    description: CORPORATE_LANDING_META.openGraphDescription,
  },
}

export default function MarketingHomePage() {
  return (
    <MarketingShell prefetchRoutes>
      <CloqLanding />
    </MarketingShell>
  )
}
