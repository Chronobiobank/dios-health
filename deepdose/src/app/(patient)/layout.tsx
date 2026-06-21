import { PatientSiteNav } from '@/components/deepdose/PatientSiteNav'
import { DeepDoseShell } from '@/components/deepdose/DeepDoseShell'
import '@/styles/dios-health-marketing.css'

export default function PatientLayout({ children }: { children: React.ReactNode }) {
  return (
    <DeepDoseShell variant="dark" nav={<PatientSiteNav />}>
      <div className="seco-page seco-app-page">
        <div className="seco-landing__section-inner">{children}</div>
      </div>
    </DeepDoseShell>
  )
}
