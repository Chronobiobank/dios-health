import type { Metadata } from 'next'

import { HomeLanding } from '@/components/sections/home/home-landing'
import { MarketingShell } from '@/components/sections/marketing-shell'
import { HOME_LANDING_META } from '@/lib/pitch/home-landing-content'

import '@/app/styles/home-landing.css'

export const metadata: Metadata = {
  title: HOME_LANDING_META.title,
  description: HOME_LANDING_META.description,
  openGraph: {
    title: HOME_LANDING_META.openGraphTitle,
    description: HOME_LANDING_META.openGraphDescription,
  },
  twitter: {
    title: HOME_LANDING_META.openGraphTitle,
    description: HOME_LANDING_META.openGraphDescription,
  },
}

export default function Home() {
  return (
    <MarketingShell prefetchRoutes>
      <HomeLanding />
    </MarketingShell>
  )
}
