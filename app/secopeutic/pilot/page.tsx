import type { Metadata } from 'next'

import { SecopeuticDemoShell } from '@/components/secopeutic/secopeutic-demo-shell'
import { SecopeuticPilotForm } from '@/components/secopeutic/secopeutic-pilot-form'
import { SECOPEUTIC_LANDING_DISCLAIMER, SECOPEUTIC_LANDING_PILOT } from '@/lib/secopeutic/landing-content'
import { SECOPUTIC_SITE_URL } from '@/lib/secopeutic/site'

export const metadata: Metadata = {
  metadataBase: new URL(SECOPUTIC_SITE_URL),
  title: 'Claim free pilot — Secopeutic',
  description: SECOPEUTIC_LANDING_PILOT.support,
}

export default function SecopeuticPilotPage() {
  return (
    <SecopeuticDemoShell context="Free pilot" variant="dark">
      <main className="seco-pilot">
        <div className="seco-landing__section-inner">
          <p className="seco-pilot__eyebrow">Pilot programme</p>
          <h1 className="seco-pilot__title">{SECOPEUTIC_LANDING_PILOT.headline}</h1>
          <p className="seco-pilot__support">{SECOPEUTIC_LANDING_PILOT.support}</p>
          <SecopeuticPilotForm />
          <p className="seco-landing__disclaimer">{SECOPEUTIC_LANDING_DISCLAIMER}</p>
        </div>
      </main>
    </SecopeuticDemoShell>
  )
}
