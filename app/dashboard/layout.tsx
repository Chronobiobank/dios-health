import { PatientBottomNav } from '@/components/dashboard/patient-bottom-nav'
import { cn } from '@/lib/utils'

import './patient-dashboard.css'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="patient-dashboard-route min-h-screen lg:pl-[var(--patient-sidebar-width)]"
      data-dashboard="patient-v2"
    >
      <PatientBottomNav />
      <div
        className={cn(
          'dashboard-route-shell mx-auto w-full',
          'pb-[var(--patient-nav-offset)] lg:pb-8'
        )}
      >
        {children}
      </div>
    </div>
  )
}
