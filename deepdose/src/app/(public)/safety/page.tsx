import type { Metadata } from 'next'
import Link from 'next/link'

import { LegalPolicyShell } from '@/components/deepdose/LegalPolicyShell'
import { DEEPDOSE_NAME } from '@/lib/brand/deepdose-brand'
import { SAFETY_PAGE } from '@/lib/deepdose-marketing/home-gate-content'

export const metadata: Metadata = {
  title: `${SAFETY_PAGE.title} · ${DEEPDOSE_NAME}`,
  description: SAFETY_PAGE.lede,
  alternates: { canonical: '/safety' },
}

export default function SafetyPage() {
  return (
    <LegalPolicyShell
      title="Safety"
      sections={SAFETY_PAGE.sections}
      footer={
        <>
          <Link href="/report">Report</Link>
          <span className="seco-legal__footer-sep" aria-hidden="true">
            ·
          </span>
          <Link href="/terms">Terms</Link>
        </>
      }
    />
  )
}
