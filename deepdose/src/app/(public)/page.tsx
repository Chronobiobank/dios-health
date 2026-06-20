import type { Metadata } from 'next'

import { DeepDoseSplashHome } from '@/components/secopeutic/DeepDoseSplashHome'

export const metadata: Metadata = {
  title: 'DeepDose.org · Timing is the other half',
  description:
    'Standard drug dosing means 10m don\'t heal. Deepdose changes that — precision timing for patients, clinicians, and enterprise.',
  alternates: { canonical: '/' },
}

export default function HomePage() {
  return <DeepDoseSplashHome />
}
