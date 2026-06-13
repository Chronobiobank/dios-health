import type { ReactNode } from 'react'

import { ClinicalShell } from '@/components/clinical/clinical-shell'

export default function CliniciansTriageLayout({ children }: { children: ReactNode }) {
  return <ClinicalShell context="Cohort triage">{children}</ClinicalShell>
}
