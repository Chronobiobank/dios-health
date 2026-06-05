import type { Metadata } from 'next'

import { PitchDeck } from '@/components/sections/pitch/pitch-deck'
import { PitchLandingPrefetch } from '@/components/sections/pitch/pitch-landing-prefetch'
import { RETINOMIC_LANDING_META } from '@/lib/pitch/retinomic-landing-copy'

export const metadata: Metadata = {
  title: RETINOMIC_LANDING_META.title,
  description: RETINOMIC_LANDING_META.description,
  openGraph: {
    title: RETINOMIC_LANDING_META.openGraphTitle,
    description: RETINOMIC_LANDING_META.openGraphDescription,
  },
  twitter: {
    title: RETINOMIC_LANDING_META.openGraphTitle,
    description: RETINOMIC_LANDING_META.openGraphDescription,
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
