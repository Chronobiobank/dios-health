import type { Metadata } from 'next'

import { ClinicianTriageDashboard } from '@/components/clinicians/ClinicianTriageDashboard'

import '@/app/styles/clinician-triage-shell.css'

export const metadata: Metadata = {
  title: 'Clinician triage demo — DIOS',
  description: 'Who needs attention this week. Red, amber, green by PTH trajectory and safety gates.',
  robots: { index: false, follow: false },
}

export default function CliniciansTriagePage() {
  return <ClinicianTriageDashboard />
}
