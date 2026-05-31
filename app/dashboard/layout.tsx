import { PatientBottomNav } from '@/components/dashboard/patient-bottom-nav'
import { CONTAINER } from '@/components/sections/layout'
import { cn } from '@/lib/utils'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-white text-[#0D0D0D]">
      <div
        className={cn(
          CONTAINER,
          'flex min-h-screen w-full max-w-[640px] flex-col gap-6 pb-[calc(5rem+env(safe-area-inset-bottom))] pt-2 md:pb-8'
        )}
      >
        {children}
        <PatientBottomNav />
      </div>
    </div>
  )
}
