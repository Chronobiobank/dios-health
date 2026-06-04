import type { Metadata } from 'next'

import { PitchDeck } from '@/components/sections/pitch/pitch-deck'
import { PitchLandingPrefetch } from '@/components/sections/pitch/pitch-landing-prefetch'

export const metadata: Metadata = {
  title: 'DIOS – What is your Chronosomatic Age?',
  description:
    'The UK Biobank study of 80,000 people proved that your light-dark cycle determines how fast you age. DIOS measures your Chronosomatic Age — and shows you how to recover your Dark Years.',
  openGraph: {
    title: 'DIOS – What is your Chronosomatic Age?',
    description:
      '80,000 people. One finding. Your light-dark cycle determines how fast you age metabolically. DIOS is the first clinical tool built to measure and fix it.',
  },
  twitter: {
    title: 'DIOS – What is your Chronosomatic Age?',
    description:
      '80,000 people. One finding. Your light-dark cycle determines how fast you age. DIOS measures your Chronosomatic Age and shows you how to recover your Dark Years.',
  },
}

export default function Home() {
  return (
    <div className="calm-landing relative min-h-svh text-[#0D0D0D]">
      <PitchLandingPrefetch />
      <div className="calm-landing__deck relative z-10 flex min-h-0 flex-1 flex-col">
        <PitchDeck />
      </div>
    </div>
  )
}
