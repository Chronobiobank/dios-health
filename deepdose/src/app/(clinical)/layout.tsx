import { ClinicalSiteNav } from '@/components/clinical/ClinicalSiteNav'
import { DeepDoseShell } from '@/components/deepdose/DeepDoseShell'
import '@/styles/dios-health-marketing.css'

export default function ClinicalLayout({ children }: { children: React.ReactNode }) {
  return (
    <DeepDoseShell variant="dark" nav={<ClinicalSiteNav />}>
      <div className="seco-page seco-app-page">
        <div className="seco-landing__section-inner">{children}</div>
      </div>
    </DeepDoseShell>
  )
}
