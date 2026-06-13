import type { Metadata } from 'next'

import { SecopeuticDemoShell } from '@/components/secopeutic/secopeutic-demo-shell'
import { SecopeuticLanding } from '@/components/secopeutic/secopeutic-landing'
import { SECOPEUTIC_LANDING_META } from '@/lib/secopeutic/landing-content'
import { SECOPUTIC_SITE_URL } from '@/lib/secopeutic/site'

export const metadata: Metadata = {
  metadataBase: new URL(SECOPUTIC_SITE_URL),
  title: SECOPEUTIC_LANDING_META.title,
  description: SECOPEUTIC_LANDING_META.description,
  openGraph: {
    url: SECOPUTIC_SITE_URL,
    siteName: 'Secopeutic',
    title: SECOPEUTIC_LANDING_META.title,
    description: SECOPEUTIC_LANDING_META.description,
    type: 'website',
  },
}

export default function SecopeuticLandingPage() {
  return (
    <SecopeuticDemoShell context="High-dose vitamin D for clinicians">
      <SecopeuticLanding />
    </SecopeuticDemoShell>
  )
}
