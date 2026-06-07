import type { Metadata } from 'next'

import { PrgcMonitoringDemo } from '@/components/clinic/prgc-monitoring-demo'

export const metadata: Metadata = {
  title: 'pRGC monitoring — Coimbra cohort — DIOS',
  description:
    'Four columns per patient: sleep efficiency, REM latency, PTH, D3 timing. Four cadences — daily DINA, monthly MLux, 90-day bloods, six-month TipTraQ.',
  robots: { index: false, follow: false },
}

export default function CliniciansTriagePage() {
  return <PrgcMonitoringDemo />
}
