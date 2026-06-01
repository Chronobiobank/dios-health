import { PatientBottomNav } from '@/components/dashboard/patient-bottom-nav'
import { CONTAINER } from '@/components/sections/layout'
import { cn } from '@/lib/utils'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-white text-[#0D0D0D] lg:pl-[var(--patient-sidebar-width)]">
      <PatientBottomNav />
      <div
        className={cn(
          CONTAINER,
          'flex min-h-screen w-full max-w-[640px] flex-col gap-6 pb-[var(--patient-nav-offset)] pt-2 sm:pt-4 md:max-w-[42rem] lg:max-w-[48rem] lg:pb-8 lg:pt-6'
        )}
      >
        {children}
      </div>
    </div>
  )
}
