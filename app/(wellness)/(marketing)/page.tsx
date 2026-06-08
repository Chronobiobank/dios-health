import type { Metadata } from 'next'

import { MarketingLanding } from '@/components/sections/marketing/marketing-landing'
import { MarketingShell } from '@/components/sections/marketing-shell'
import { CORPORATE_LANDING_META } from '@/lib/pitch/corporate-landing-content'

import '@/app/styles/marketing-landing.css'

export const metadata: Metadata = {
  title: CORPORATE_LANDING_META.title,
  description: CORPORATE_LANDING_META.description,
  openGraph: {
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
    <MarketingShell prefetchRoutes className="marketing-v2-shell">
      <MarketingLanding />
    </MarketingShell>
  )
}
