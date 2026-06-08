import type { Metadata } from 'next'

import { DinaOnboardingFlow } from '@/components/onboarding/dina-onboarding-flow'
import { COACH_DISPLAY_NAME } from '@/lib/coach/brand'

export const metadata: Metadata = {
  title: `Patient preview — ${COACH_DISPLAY_NAME} scan — DIOS`,
  description: `Try the patient scan — 60 seconds, saved on this device only. No account. Clinicians enrol cohorts separately.`,
}

export default function DinaOnboardingPage() {
  return <DinaOnboardingFlow />
}
