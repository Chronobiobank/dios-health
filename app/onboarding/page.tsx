import type { Metadata } from 'next'

import { OnboardingFlow } from '@/components/retinomic/onboarding-flow'
import { ONBOARDING_COPY, RETINOMIC_LANDING_HERO } from '@/lib/pitch/retinomic-landing-copy'

export const metadata: Metadata = {
  title: `${ONBOARDING_COPY.headline} · DIOS`,
  description: RETINOMIC_LANDING_HERO.subheadline,
}

export default function RetinomicOnboardingPage() {
  return <OnboardingFlow />
}
