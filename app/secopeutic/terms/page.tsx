import type { Metadata } from 'next'

import { SecopeuticDemoShell } from '@/components/secopeutic/secopeutic-demo-shell'
import { SECOPEUTIC_LANDING_DISCLAIMER } from '@/lib/secopeutic/landing-content'

export const metadata: Metadata = {
  title: 'Terms — Secopeutic',
  description: 'Terms of use for the Secopeutic clinician monitoring platform.',
}

export default function SecopeuticTermsPage() {
  return (
    <SecopeuticDemoShell context="Terms of use" variant="dark">
      <main className="seco-legal">
        <div className="seco-landing__section-inner">
          <p className="seco-legal__eyebrow">Legal</p>
          <h1 className="seco-legal__title">Terms of use</h1>
          <p className="seco-legal__lede">
            Secopeutic is operated by Secomed Limited. These terms govern clinician access to the platform.
          </p>
          <section className="seco-legal__section">
            <h2 className="seco-legal__head">Clinical responsibility</h2>
            <p className="seco-legal__body">{SECOPEUTIC_LANDING_DISCLAIMER}</p>
          </section>
        </div>
      </main>
    </SecopeuticDemoShell>
  )
}
