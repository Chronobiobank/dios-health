import type { Metadata } from 'next'
import Link from 'next/link'

import { LegalPolicyShell } from '@/components/deepdose/LegalPolicyShell'
import { DEEPDOSE_NAME } from '@/lib/brand/deepdose-brand'
import { TAKE_IT_DOWN_PAGE } from '@/lib/deepdose-marketing/home-gate-content'

export const metadata: Metadata = {
  title: `${TAKE_IT_DOWN_PAGE.title} · ${DEEPDOSE_NAME}`,
  description: TAKE_IT_DOWN_PAGE.lede,
  alternates: { canonical: '/take-it-down' },
}

export default function TakeItDownPage() {
  return (
    <LegalPolicyShell
      title="Take It Down"
      sections={TAKE_IT_DOWN_PAGE.sections}
      footer={<Link href="/report">Report</Link>}
    />
  )
}
