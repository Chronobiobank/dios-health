import { ClinicalSiteNav } from '@/components/clinical/ClinicalSiteNav'
import { DeepDoseShell } from '@/components/deepdose/DeepDoseShell'
import '@/styles/dios-health-marketing.css'

export default function ClinicalLayout({ children }: { children: React.ReactNode }) {
  return (
    <DeepDoseShell variant="light" nav={<ClinicalSiteNav />}>
      <div className="seco-page seco-app-page dd-oai-shell">
        <div className="seco-landing__section-inner dd-oai-container dd-oai-container--wide">
          {children}
        </div>
      </div>
    </DeepDoseShell>
  )
}
