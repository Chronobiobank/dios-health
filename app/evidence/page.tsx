import type { Metadata } from 'next'

import { EvidenceLanding } from '@/components/sections/evidence/evidence-landing'
import { MarketingShell } from '@/components/sections/marketing-shell'
import { EVIDENCE_LANDING_META } from '@/lib/pitch/evidence-landing-content'

import '@/app/styles/home-landing.css'

export const metadata: Metadata = {
  title: EVIDENCE_LANDING_META.title,
  description: EVIDENCE_LANDING_META.description,
}

export default function EvidencePage() {
  return (
    <MarketingShell>
      <EvidenceLanding />
    </MarketingShell>
  )
}
