import type { Metadata } from 'next'

import { DeepDoseEnterpriseLanding } from '@/components/secopeutic/DeepDoseEnterpriseLanding'
import { DEEPDOSE_NAME } from '@/lib/brand/deepdose-brand'

export const metadata: Metadata = {
  title: `For enterprise — ${DEEPDOSE_NAME}`,
  description:
    'Chronobiobank population intelligence — licensed, pseudonymised cohort analytics for ICBs, pharma, and research.',
}

export default function EnterpriseLandingPage() {
  return <DeepDoseEnterpriseLanding />
}
