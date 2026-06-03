import type { Metadata } from 'next'

import { DiosTechnology } from '@/components/sections/TipTraqScience'

export const metadata: Metadata = {
  title: 'Technology — DIOS',
  description:
    'How DIOS derives MLux phase time from smartphone, blood panel, and TipTraQ data — the three-layer measurement stack for precision chronotherapy.',
}

export default function TechnologyPage() {
  return (
    <main>
      <DiosTechnology />
    </main>
  )
}
