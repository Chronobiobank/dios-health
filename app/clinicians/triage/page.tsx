import type { Metadata } from 'next'

import { PrgcMonitoringDemo } from '@/components/clinic/prgc-monitoring-demo'

export const metadata: Metadata = {
  title: 'pRGC monitoring — Coimbra cohort — DIOS',
  description:
    'Four columns per patient: sleep efficiency, REM latency, PTH, D3 timing. The Coimbra monitoring dashboard — nightly TipTraQ, quarterly bloods.',
  robots: { index: false, follow: false },
}

export default function CliniciansTriagePage() {
  return <PrgcMonitoringDemo />
}
