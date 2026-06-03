import { PatientBottomNav } from '@/components/dashboard/patient-bottom-nav'
import { cn } from '@/lib/utils'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#0D0D0D] lg:pl-[var(--patient-sidebar-width)]">
      <PatientBottomNav />
      <div
        className={cn(
          'mx-auto w-full max-w-[1200px] px-4 sm:px-6',
          'flex min-h-screen flex-col pb-[var(--patient-nav-offset)] pt-2 sm:pt-4 lg:pb-8 lg:pt-6'
        )}
      >
        {children}
      </div>
    </div>
  )
}
