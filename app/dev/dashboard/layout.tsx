import { DevPreviewBar } from '@/components/patient-dashboard/dev-preview-bar'

import '../../dashboard/patient-dashboard.css'

export default function DevDashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="patient-dashboard-route min-h-screen" data-dashboard="patient-v2">
      {children}
      <DevPreviewBar />
    </div>
  )
}
