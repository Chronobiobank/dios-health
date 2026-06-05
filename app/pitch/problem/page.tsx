import type { Metadata } from 'next'

import { ProblemPaperView } from '@/components/sections/pitch/problem-paper-view'

export const metadata: Metadata = {
  title: 'Why standardised dosing misses most patients — DIOS Health',
  description:
    'Grant Munro founded DIOS after failed vitrectomy operations taught him prevention must come first. Read his position paper on precision chronotherapy and why dose timing matters.',
}

export default function ProblemPaperPage() {
  return (
    <main>
      <ProblemPaperView />
    </main>
  )
}
