import type { Metadata } from 'next'

import { ScienceLanding } from '@/components/sections/science/science-landing'
import { MarketingShell } from '@/components/sections/marketing-shell'

import '@/app/styles/home-landing.css'

export const metadata: Metadata = {
  title: 'The science is published — DIOS',
  description: 'Peer-reviewed evidence for timed medication and biological clock alignment.',
}

export default function SciencePage() {
  return (
    <MarketingShell>
      <ScienceLanding />
    </MarketingShell>
  )
}
