import type { Metadata } from 'next'
import Link from 'next/link'

import { LegalPolicyShell } from '@/components/deepdose/LegalPolicyShell'
import { DEEPDOSE_NAME } from '@/lib/brand/deepdose-brand'
import { STATEMENT_2257_PAGE } from '@/lib/deepdose-marketing/home-gate-content'

export const metadata: Metadata = {
  title: `${STATEMENT_2257_PAGE.title} · ${DEEPDOSE_NAME}`,
  description: STATEMENT_2257_PAGE.lede,
  alternates: { canonical: '/2257' },
}

export default function Statement2257Page() {
  return (
    <LegalPolicyShell
      title="§ 2257"
      sections={STATEMENT_2257_PAGE.sections}
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
