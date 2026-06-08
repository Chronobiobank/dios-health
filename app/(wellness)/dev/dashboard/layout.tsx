import { DevPreviewBar } from '@/components/patient-dashboard/dev-preview-bar'

export default function DevDashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="clinical-layout patient-dashboard-route min-h-screen bg-background" data-dashboard="patient-v2">
      {children}
      <DevPreviewBar />
    </div>
  )
}
