import type { Metadata } from 'next'

import { DeepDoseSplashHome } from '@/components/deepdose/DeepDoseSplashHome'
import { DEEPDOSE_NAME } from '@/lib/brand/deepdose-brand'
import { DEEPDOSE_MATCH_META } from '@/lib/deepdose-marketing/landing-content'

export const metadata: Metadata = {
  title: DEEPDOSE_MATCH_META.title,
  description: DEEPDOSE_MATCH_META.description,
  alternates: { canonical: '/match' },
  openGraph: {
    title: `${DEEPDOSE_MATCH_META.title} · ${DEEPDOSE_NAME}`,
    description: DEEPDOSE_MATCH_META.description,
  },
}

/** Orbit splash — Max Your Chemistry / Claim Free Access. */
export default function MatchPage() {
  return <DeepDoseSplashHome />
}
