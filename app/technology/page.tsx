import type { Metadata } from 'next'

import { DiosTechnology } from '@/components/sections/TipTraqScience'

export const metadata: Metadata = {
  title: 'Technology — DIOS',
  description:
    'How DIOS builds dose intelligence from four cadences — daily DINA, monthly MLux, 90-day bloods, six-month TipTraQ calibration.',
}

export default function TechnologyPage() {
  return (
    <main>
      <DiosTechnology />
    </main>
  )
}
