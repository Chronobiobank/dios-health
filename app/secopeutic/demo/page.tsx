import type { Metadata } from 'next'

import { SecopeuticCohortDashboard } from '@/components/secopeutic/secopeutic-cohort-dashboard'
import { SecopeuticDemoShell } from '@/components/secopeutic/secopeutic-demo-shell'
import { SECOPUTIC_SITE_URL } from '@/lib/secopeutic/site'

export const metadata: Metadata = {
  metadataBase: new URL(SECOPUTIC_SITE_URL),
  title: 'Secopeutic pilot demo',
  description:
    'Clinician monitoring demo for high-dose vitamin D. City Labs, TipTraQ sleep blocks, and dose windows on one timeline.',
  openGraph: {
    url: SECOPUTIC_SITE_URL,
    siteName: 'Secopeutic',
    type: 'website',
  },
  robots: { index: false, follow: false },
}

export default function SecopeuticDemoPage() {
  return (
    <SecopeuticDemoShell context="Pilot demo">
      <SecopeuticCohortDashboard />
    </SecopeuticDemoShell>
  )
}
