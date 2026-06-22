import type { Metadata } from 'next'

import { DeepDoseClinicianLanding } from '@/components/deepdose/DeepDoseClinicianLanding'
import { DEEPDOSE_NAME } from '@/lib/brand/deepdose-brand'

export const metadata: Metadata = {
  title: `For clinicians — ${DEEPDOSE_NAME}`,
  description:
    'Optimise prescribing times to each patient\'s body clock — triage drift, device gaps, and TipTraQ-validated DLMO in one panel.',
}

export default function ClinicianLandingPage() {
  return <DeepDoseClinicianLanding />
}
