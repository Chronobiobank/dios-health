import type { Metadata } from 'next'

import { ChronobiobankLanding } from '@/components/sections/chronobiobank/chronobiobank-landing'
import { MarketingShell } from '@/components/sections/marketing-shell'
import { CHRONOBIOBANK_LANDING_META } from '@/lib/pitch/chronobiobank-landing-content'

import '@/app/styles/home-landing.css'

export const metadata: Metadata = {
  title: CHRONOBIOBANK_LANDING_META.title,
  description: CHRONOBIOBANK_LANDING_META.description,
}

export default function ChronobiobankPage() {
  return (
    <MarketingShell>
      <ChronobiobankLanding />
    </MarketingShell>
  )
}
