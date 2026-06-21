import type { Metadata } from 'next'

import { DeepDoseSplashHome } from '@/components/secopeutic/DeepDoseSplashHome'

export const metadata: Metadata = {
  title: 'DeepDose.org · Timing is the other half',
  description:
    'Deepdose tailors meds to your body clock so they work better — for patients, clinicians, and enterprise.',
  alternates: { canonical: '/' },
}

export default function HomePage() {
  return <DeepDoseSplashHome />
}
