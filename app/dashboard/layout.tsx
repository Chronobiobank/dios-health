import { PatientBottomNav } from '@/components/dashboard/patient-bottom-nav'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-white text-[#0D0D0D]">
      <div className="mx-auto flex min-h-screen max-w-[640px] flex-col px-5 pb-24 sm:px-6 md:pb-8">
        {children}
        <PatientBottomNav />
      </div>
    </div>
  )
}
