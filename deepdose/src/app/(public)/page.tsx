import type { Metadata } from 'next'

import { DeepDoseSplashHome } from '@/components/secopeutic/DeepDoseSplashHome'

export const metadata: Metadata = {
  title: 'DeepDose.org · Timing is the other half',
  description:
    'DeepDose tracks your daily biological clock to tell you exactly when to take care — not just how much.',
  alternates: { canonical: '/' },
}

export default function HomePage() {
  return <DeepDoseSplashHome />
}
