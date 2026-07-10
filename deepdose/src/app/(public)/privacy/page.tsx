import type { Metadata } from 'next'
import Link from 'next/link'

import { LegalPolicyShell } from '@/components/deepdose/LegalPolicyShell'
import { DEEPDOSE_NAME } from '@/lib/brand/deepdose-brand'
import { PRIVACY_PAGE } from '@/lib/deepdose-marketing/privacy-content'

export const metadata: Metadata = {
  title: `${PRIVACY_PAGE.title} · ${DEEPDOSE_NAME}`,
  description: PRIVACY_PAGE.lede,
  alternates: { canonical: '/privacy' },
}

export default function PrivacyPage() {
  return (
    <LegalPolicyShell
      title="Privacy"
      meta={PRIVACY_PAGE.updated}
      sections={PRIVACY_PAGE.sections}
      footer={
        <>
          <a href={`mailto:${PRIVACY_PAGE.contactEmail}`}>{PRIVACY_PAGE.contactEmail}</a>
          <span className="seco-legal__footer-sep" aria-hidden="true">
            ·
          </span>
          <Link href="/terms">Terms</Link>
          <span className="seco-legal__footer-sep" aria-hidden="true">
            ·
          </span>
          <Link href="/safety">Safety</Link>
        </>
      }
    />
  )
}
