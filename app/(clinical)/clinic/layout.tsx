import type { ReactNode } from 'react'

import { ClinicalShell } from '@/components/clinical/clinical-shell'
import { ClinicLayoutShell } from '@/components/clinic/clinic-layout-shell'

export default function ClinicLayout({ children }: { children: ReactNode }) {
  return (
    <ClinicalShell>
      <ClinicLayoutShell>{children}</ClinicLayoutShell>
    </ClinicalShell>
  )
}
