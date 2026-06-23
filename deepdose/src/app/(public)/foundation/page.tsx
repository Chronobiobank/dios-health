import type { Metadata } from 'next'

import { EvidencePage } from '@/components/deepdose/marketing/EvidencePage'
import { EVIDENCE_PAGE_META } from '@/lib/deepdose-marketing/evidence-content'

export const metadata: Metadata = {
  title: EVIDENCE_PAGE_META.title,
  description: EVIDENCE_PAGE_META.description,
}

export default function FoundationRoute() {
  return <EvidencePage />
}
