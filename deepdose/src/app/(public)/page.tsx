import type { Metadata } from 'next'

import { DeepDoseSplashHome } from '@/components/deepdose/DeepDoseSplashHome'
import { DEEPDOSE_LANDING_META } from '@/lib/deepdose-marketing/landing-content'

export const metadata: Metadata = {
  title: DEEPDOSE_LANDING_META.title,
  description: DEEPDOSE_LANDING_META.description,
  alternates: { canonical: '/' },
}

export default function HomePage() {
  return <DeepDoseSplashHome />
}
