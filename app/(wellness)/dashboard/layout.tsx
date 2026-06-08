import '@/app/(wellness)/dashboard/retinomic-dashboard.css'

import { PatientBottomNav } from '@/components/dashboard/patient-bottom-nav'
import { PatientDashboardLayoutShell } from '@/components/dashboard/patient-dashboard-layout-shell'
import { cn } from '@/lib/utils'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="clinical-layout patient-dashboard-route min-h-screen bg-background md:pl-[var(--patient-sidebar-width)]"
      data-dashboard="patient-v2"
    >
      <PatientBottomNav />
      <div
        className={cn(
          'dashboard-route-shell mx-auto w-full min-h-0 flex-1',
          'pb-[var(--patient-nav-offset)] md:pb-8'
        )}
      >
        <div className="patient-dashboard-content w-full">
          <PatientDashboardLayoutShell>{children}</PatientDashboardLayoutShell>
        </div>
      </div>
    </div>
  )
}
