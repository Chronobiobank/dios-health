import type { Metadata } from 'next'
import { redirect } from 'next/navigation'

import { EVIDENCE_PAGE_META } from '@/lib/deepdose-marketing/evidence-content'

export const metadata: Metadata = {
  title: EVIDENCE_PAGE_META.title,
  description: EVIDENCE_PAGE_META.description,
  robots: { index: false, follow: true },
}

/** Legacy route — research lives on /science#evidence */
export default function FoundationRoute() {
  redirect('/science')
}
