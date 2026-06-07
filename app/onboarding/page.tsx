import type { Metadata } from 'next'

import { DinaOnboardingFlow } from '@/components/onboarding/dina-onboarding-flow'
import { COACH_DISPLAY_NAME } from '@/lib/coach/brand'

export const metadata: Metadata = {
  title: `${COACH_DISPLAY_NAME} onboarding — DIOS`,
  description: `Meet ${COACH_DISPLAY_NAME}, your Dose Intelligence Agent — scan your clock and map your first medication window.`,
}

export default function DinaOnboardingPage() {
  return <DinaOnboardingFlow />
}
