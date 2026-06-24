import type { Metadata } from 'next'

import { DeepDoseSplashHome } from '@/components/deepdose/DeepDoseSplashHome'
import { DEEPDOSE_NAME, DEEPDOSE_TAGLINE } from '@/lib/brand/deepdose-brand'

export const metadata: Metadata = {
  title: `${DEEPDOSE_NAME} · ${DEEPDOSE_TAGLINE}`,
  description:
    'Passive circadian phase tracking from your phone and wearables. Personalise medicine timing to your body clock — with clinical validation when it matters.',
  alternates: { canonical: '/' },
}

export default function HomePage() {
  return <DeepDoseSplashHome />
}
