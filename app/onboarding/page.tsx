import type { Metadata } from 'next'

import { MelOnboardingFlow } from '@/components/mel/mel-onboarding-flow'

export const metadata: Metadata = {
  title: 'DiDi onboarding — DIOS',
  description: '60-second clock scan. BTI estimate. Your first medication window.',
  robots: { index: false, follow: false },
}

export default function MelOnboardingPage() {
  return <MelOnboardingFlow />
}
