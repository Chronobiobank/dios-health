import type { Metadata } from 'next'

import { ProblemPaperView } from '@/components/sections/pitch/problem-paper-view'
import { GRANT_MUNRO_PROBLEM_PAPER } from '@/lib/pitch/grant-munro-problem-paper'

const paper = GRANT_MUNRO_PROBLEM_PAPER

export const metadata: Metadata = {
  title: `${paper.title} — Grant Munro | DIOS`,
  description: paper.abstract.slice(0, 155),
}

export default function ProblemPaperPage() {
  return (
    <main>
      <ProblemPaperView />
    </main>
  )
}
