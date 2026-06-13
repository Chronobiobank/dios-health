import type { Metadata } from 'next'

import { SecopeuticClinicsDirectory } from '@/components/secopeutic/secopeutic-clinics-directory'
import { SecopeuticDemoShell } from '@/components/secopeutic/secopeutic-demo-shell'
import { SECOPEUTIC_CLINICS_PAGE } from '@/lib/secopeutic/clinics-content'
import { SECOPEUTIC_LANDING_DISCLAIMER } from '@/lib/secopeutic/landing-content'
import { SECOPUTIC_SITE_URL } from '@/lib/secopeutic/site'

export const metadata: Metadata = {
  metadataBase: new URL(SECOPUTIC_SITE_URL),
  title: 'Certified clinics — Secopeutic',
  description: SECOPEUTIC_CLINICS_PAGE.support,
}

export default function SecopeuticClinicsPage() {
  return (
    <SecopeuticDemoShell context="Clinic directory" variant="dark">
      <main className="seco-clinics-page">
        <div className="seco-landing__section-inner">
          <SecopeuticClinicsDirectory />
          <p className="seco-landing__disclaimer">{SECOPEUTIC_LANDING_DISCLAIMER}</p>
        </div>
      </main>
    </SecopeuticDemoShell>
  )
}
