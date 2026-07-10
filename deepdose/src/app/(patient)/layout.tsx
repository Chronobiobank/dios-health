import { PatientSiteBottomChrome } from '@/components/deepdose/PatientSiteBottomChrome'
import { DeepDoseShell } from '@/components/deepdose/DeepDoseShell'
import { PlanProfileSync } from '@/components/patient/PlanProfileSync'
import '@/styles/dios-health-marketing.css'
import '@/styles/patient-dash-v2.css'

export default function PatientLayout({ children }: { children: React.ReactNode }) {
  return (
    <DeepDoseShell variant="dark" nav={null}>
      <PlanProfileSync />
      <div className="seco-page seco-app-page">
        <div className="seco-landing__section-inner">{children}</div>
      </div>
      <PatientSiteBottomChrome />
    </DeepDoseShell>
  )
}
