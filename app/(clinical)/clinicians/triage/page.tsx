import type { Metadata } from 'next'
import { Suspense } from 'react'

import { ClinicianTriageDemo } from '@/components/clinicians/clinician-triage-demo'
import {
  CLINICIANS_TRIAGE_DEMO,
  type CliniciansTriageTabId,
} from '@/lib/pitch/clinicians-triage-demo-content'

export const metadata: Metadata = {
  title: 'Clinician triage demo — DIOS',
  description:
    'Cohort queue plus pRGC drill-down — twelve patients sorted red, amber, and green, then four-column Coimbra readouts per patient.',
  robots: { index: false, follow: false },
}

type CliniciansTriagePageProps = {
  searchParams: Promise<{ tab?: string }>
}

function parseInitialTab(tab: string | undefined): CliniciansTriageTabId {
  return tab === 'prgc' ? 'prgc' : 'queue'
}

export default async function CliniciansTriagePage({ searchParams }: CliniciansTriagePageProps) {
  const params = await searchParams
  const initialTab = parseInitialTab(params.tab)

  return (
    <Suspense fallback={<p className="clinicians-triage-demo__loading">{CLINICIANS_TRIAGE_DEMO.headline}</p>}>
      <ClinicianTriageDemo initialTab={initialTab} />
    </Suspense>
  )
}
