import type { Metadata } from 'next'

import { ProblemPaperView } from '@/components/sections/pitch/problem-paper-view'

export const metadata: Metadata = {
  title: 'Why the time you take your medicine matters — DIOS Health',
  description:
    'The UK Biobank proved your light-dark cycle determines how fast you age. The same biology governs how well your medication works. DIOS measures both and gives your GP the information to act on it.',
}

export default function ProblemPaperPage() {
  return (
    <main>
      <ProblemPaperView />
    </main>
  )
}
