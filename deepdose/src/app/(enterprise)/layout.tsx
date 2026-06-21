import { EnterpriseSiteNav } from '@/components/enterprise/EnterpriseSiteNav'
import { DeepDoseShell } from '@/components/deepdose/DeepDoseShell'
import '@/styles/dios-health-marketing.css'

export default function EnterpriseLayout({ children }: { children: React.ReactNode }) {
  return (
    <DeepDoseShell variant="dark" nav={<EnterpriseSiteNav />}>
      <div className="seco-page seco-app-page">
        <div className="seco-landing__section-inner">{children}</div>
      </div>
    </DeepDoseShell>
  )
}
