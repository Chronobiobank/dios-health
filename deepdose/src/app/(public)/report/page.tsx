import type { Metadata } from 'next'
import Link from 'next/link'

import { LegalPolicyShell } from '@/components/deepdose/LegalPolicyShell'
import { DEEPDOSE_NAME } from '@/lib/brand/deepdose-brand'
import { REPORT_PAGE } from '@/lib/deepdose-marketing/home-gate-content'

export const metadata: Metadata = {
  title: `${REPORT_PAGE.title} · ${DEEPDOSE_NAME}`,
  description: REPORT_PAGE.lede,
  alternates: { canonical: '/report' },
}

export default function ReportPage() {
  return (
    <LegalPolicyShell
      title="Report"
      body={REPORT_PAGE.body}
      footer={
        <>
          <Link href="/safety">Safety</Link>
          <span className="seco-legal__footer-sep" aria-hidden="true">
            ·
          </span>
          <Link href="/take-it-down">Take It Down</Link>
          <span className="seco-legal__footer-sep" aria-hidden="true">
            ·
          </span>
          <Link href="/terms">Terms</Link>
        </>
      }
    >
      <p className="seco-legal__contact seco-reveal seco-reveal--2">
        <a href={`mailto:${REPORT_PAGE.email}`}>{REPORT_PAGE.email}</a>
      </p>
    </LegalPolicyShell>
  )
}
