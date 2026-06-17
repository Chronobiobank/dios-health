import { PatientSiteNav } from '@/components/secopeutic/PatientSiteNav'
import { SecopeuticDemoShell } from '@/components/secopeutic/SecopeuticDemoShell'
import '@/styles/dios-health-marketing.css'

export default function PatientLayout({ children }: { children: React.ReactNode }) {
  return (
    <SecopeuticDemoShell variant="dark" nav={<PatientSiteNav />}>
      <div className="seco-page seco-app-page">
        <div className="seco-landing__section-inner">{children}</div>
      </div>
    </SecopeuticDemoShell>
  )
}
