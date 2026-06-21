import type { Metadata } from 'next'

import { DeepDoseClinicianLanding } from '@/components/deepdose/DeepDoseClinicianLanding'
import { DEEPDOSE_NAME } from '@/lib/brand/deepdose-brand'

export const metadata: Metadata = {
  title: `For clinicians — ${DEEPDOSE_NAME}`,
  description:
    'Triage patients by circadian drift, TipTraQ nights, and evidence-based timing recommendations.',
}

export default function ClinicianLandingPage() {
  return <DeepDoseClinicianLanding />
}
