import type { Metadata } from 'next'

import { DiosTechnology } from '@/components/sections/TipTraqScience'

export const metadata: Metadata = {
  title: 'Technology — DIOS',
  description:
    'How DIOS reads your body clock — daily medicine logs, monthly phone scans, 90-day bloods, and six-month TipTraQ sleep.',
}

export default function TechnologyPage() {
  return (
    <main>
      <DiosTechnology />
    </main>
  )
}
