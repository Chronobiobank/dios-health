import type { Metadata } from 'next'

import { MarketingLanding } from '@/components/sections/marketing/marketing-landing'
import { MarketingShell } from '@/components/sections/marketing-shell'
import { MARKETING_LANDING_META } from '@/lib/pitch/marketing-landing-content'

import '@/app/styles/marketing-landing.css'

export const metadata: Metadata = {
  title: MARKETING_LANDING_META.title,
  description: MARKETING_LANDING_META.description,
  openGraph: {
    title: MARKETING_LANDING_META.openGraphTitle,
    description: MARKETING_LANDING_META.openGraphDescription,
  },
  twitter: {
    title: MARKETING_LANDING_META.openGraphTitle,
    description: MARKETING_LANDING_META.openGraphDescription,
  },
}

export default function MarketingHomePage() {
  return (
    <MarketingShell prefetchRoutes className="marketing-v2-shell">
      <MarketingLanding />
    </MarketingShell>
  )
}
