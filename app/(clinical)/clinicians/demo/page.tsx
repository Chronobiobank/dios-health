import type { Metadata } from 'next'

import { SecopeuticCohortDashboard } from '@/components/secopeutic/secopeutic-cohort-dashboard'
import { SecopeuticDemoShell } from '@/components/secopeutic/secopeutic-demo-shell'
import { DIOS_SITE_URL } from '@/lib/secopeutic/site'

export const metadata: Metadata = {
  metadataBase: new URL(DIOS_SITE_URL),
  title: 'Monitoring demo — DIOS',
  description:
    'Clinician monitoring demo for high-dose vitamin D. City Labs, TipTraQ sleep blocks, and dose windows on one timeline.',
  openGraph: {
    url: `${DIOS_SITE_URL}/clinicians/demo`,
    siteName: 'DIOS',
    type: 'website',
  },
  robots: { index: false, follow: false },
}

export default function DiosCliniciansDemoPage() {
  return (
    <SecopeuticDemoShell context="Monitoring demo" variant="dark">
      <SecopeuticCohortDashboard />
    </SecopeuticDemoShell>
  )
}
