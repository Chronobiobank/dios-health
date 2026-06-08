import type { Metadata } from 'next'

import { ProblemPaperView } from '@/components/sections/pitch/problem-paper-view'

export const metadata: Metadata = {
  title: 'Why standardised dosing misses most patients — DIOS Health',
  description:
    'Grant Munro founded DIOS from prevention research at NIHI, Auckland. Read his position paper on precision chronotherapy, City Labs, PranaQ TipTraQ, and why dose timing matters.',
}

export default function ProblemPaperPage() {
  return (
    <main>
      <ProblemPaperView />
    </main>
  )
}
