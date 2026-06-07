import type { Metadata } from 'next'

import { GpCohortTriageDashboard } from '@/components/clinicians/gp-cohort-triage-dashboard'

import '@/app/styles/clinician-triage-shell.css'

export const metadata: Metadata = {
  title: 'Cohort triage — Monday morning review — DIOS',
  description:
    'Twelve patients sorted red, amber, green. GP workload at a glance — timing conflicts, DINA handoff, export and lab orders from one screen.',
  robots: { index: false, follow: false },
}

export default function CliniciansTriagePage() {
  return <GpCohortTriageDashboard />
}
