import { DevPreviewBar } from '@/components/patient-dashboard/dev-preview-bar'

import '../../dashboard/patient-dashboard.css'

export default function DevDashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen">
      {children}
      <DevPreviewBar />
    </div>
  )
}
