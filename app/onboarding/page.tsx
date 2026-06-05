import type { Metadata } from 'next'

import { OnboardingFlow } from '@/components/retinomic/onboarding-flow'

export const metadata: Metadata = {
  title: 'Retinomic onboarding · DIOS',
  description: 'Biometric screening portal and Siloton GiraffeOCT node locator.',
}

export default function RetinomicOnboardingPage() {
  return <OnboardingFlow />
}
