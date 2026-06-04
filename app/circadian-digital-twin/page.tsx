import type { Metadata } from 'next'

import { CircadianModelView } from '@/components/evidence/circadian-model-view'

export const metadata: Metadata = {
  title: 'Circadian model — Understanding circadian age | DIOS',
  description:
    'How DIOS compares calendar age and circadian age on your dashboard — and what the gap means for recovery.',
}

export default function CircadianModelPage() {
  return <CircadianModelView />
}
