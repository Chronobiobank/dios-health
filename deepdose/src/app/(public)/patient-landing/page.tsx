import type { Metadata } from 'next'

import { DeepDoseLanding } from '@/components/secopeutic/DeepDoseLanding'
import { DEEPDOSE_LANDING_META } from '@/lib/secopeutic/landing-content'

export const metadata: Metadata = {
  title: DEEPDOSE_LANDING_META.title,
  description: DEEPDOSE_LANDING_META.description,
}

export default function PatientLandingPage() {
  return <DeepDoseLanding />
}
