import type { ReactNode } from 'react'

import { ClinicalShell } from '@/components/clinical/clinical-shell'

import '@/app/styles/clinical-globals.css'

type ClinicalLayoutProps = {
  children: ReactNode
}

/** Clinician triage and clinic routes — no wellness globals, no marketing footer. */
export default function ClinicalLayout({ children }: ClinicalLayoutProps) {
  return <ClinicalShell>{children}</ClinicalShell>
}
