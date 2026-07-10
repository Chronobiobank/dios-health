import type { Metadata } from 'next'
import Link from 'next/link'

import { LegalPolicyShell } from '@/components/deepdose/LegalPolicyShell'
import { DEEPDOSE_NAME } from '@/lib/brand/deepdose-brand'
import { TERMS_PAGE } from '@/lib/deepdose-marketing/home-gate-content'

export const metadata: Metadata = {
  title: `Terms · ${DEEPDOSE_NAME}`,
  description: TERMS_PAGE.body,
  alternates: { canonical: '/terms' },
}

export default function TermsPage() {
  return (
    <LegalPolicyShell
      title="Terms"
      body={TERMS_PAGE.body}
      footer={
        <>
          <Link href="/privacy">Privacy</Link>
          <span className="seco-legal__footer-sep" aria-hidden="true">
            ·
          </span>
          <Link href="/safety">Safety</Link>
          <span className="seco-legal__footer-sep" aria-hidden="true">
            ·
          </span>
          <Link href="/take-it-down">Take It Down</Link>
          <span className="seco-legal__footer-sep" aria-hidden="true">
            ·
          </span>
          <Link href="/2257">§ 2257</Link>
        </>
      }
    />
  )
}
