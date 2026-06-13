import type { Metadata } from 'next'

import { SecopeuticDemoShell } from '@/components/secopeutic/secopeutic-demo-shell'
import { SecopeuticEvidenceLibrary } from '@/components/secopeutic/secopeutic-evidence-library'
import { SECOPEUTIC_EVIDENCE_PAGE } from '@/lib/secopeutic/evidence-library'
import { SECOPEUTIC_LANDING_DISCLAIMER } from '@/lib/secopeutic/landing-content'
import { DIOS_SITE_URL } from '@/lib/secopeutic/site'

export const metadata: Metadata = {
  metadataBase: new URL(DIOS_SITE_URL),
  title: 'Evidence library — DIOS',
  description: SECOPEUTIC_EVIDENCE_PAGE.support,
}

export default function DiosCliniciansEvidencePage() {
  return (
    <SecopeuticDemoShell context="Evidence library" variant="dark">
      <main className="seco-evidence-page">
        <div className="seco-landing__section-inner">
          <SecopeuticEvidenceLibrary />
          <p className="seco-landing__disclaimer">{SECOPEUTIC_LANDING_DISCLAIMER}</p>
        </div>
      </main>
    </SecopeuticDemoShell>
  )
}
