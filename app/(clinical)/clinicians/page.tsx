import type { Metadata } from 'next'

import { SecopeuticDemoShell } from '@/components/secopeutic/secopeutic-demo-shell'
import { SecopeuticLanding } from '@/components/secopeutic/secopeutic-landing'
import { SECOPEUTIC_LANDING_META } from '@/lib/secopeutic/landing-content'
import { DIOS_SITE_URL } from '@/lib/secopeutic/site'

export const metadata: Metadata = {
  metadataBase: new URL(DIOS_SITE_URL),
  title: SECOPEUTIC_LANDING_META.title,
  description: SECOPEUTIC_LANDING_META.description,
  openGraph: {
    url: `${DIOS_SITE_URL}/clinicians`,
    siteName: 'DIOS',
    title: SECOPEUTIC_LANDING_META.title,
    description: SECOPEUTIC_LANDING_META.description,
    type: 'website',
  },
}

export default function DiosCliniciansLandingPage() {
  return (
    <SecopeuticDemoShell variant="dark">
      <SecopeuticLanding />
    </SecopeuticDemoShell>
  )
}
