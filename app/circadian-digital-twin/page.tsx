import type { Metadata } from 'next'

import { CircadianModelView } from '@/components/evidence/circadian-model-view'

export const metadata: Metadata = {
  title: 'Circadian model — Understanding Chronosomatic Age | DIOS',
  description:
    'How DIOS compares chronological age and Chronosomatic Age on your dashboard — and what Dark Years mean for recovery.',
}

export default function CircadianModelPage() {
  return <CircadianModelView />
}
