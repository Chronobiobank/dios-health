import type { Metadata } from 'next'

import { DeepDoseSplashHome } from '@/components/deepdose/DeepDoseSplashHome'
import { DEEPDOSE_NAME, DEEPDOSE_TAGLINE } from '@/lib/brand/deepdose-brand'

export const metadata: Metadata = {
  title: `${DEEPDOSE_NAME} · ${DEEPDOSE_TAGLINE}`,
  description:
    'Search your meds and supplements. See if your timing is right — then personalise doses to your body clock.',
  alternates: { canonical: '/' },
}

export default function HomePage() {
  return <DeepDoseSplashHome />
}
