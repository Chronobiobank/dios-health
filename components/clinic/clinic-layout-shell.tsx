'use client'

import { usePathname } from 'next/navigation'

import { ClinicBottomNav } from '@/components/clinic/clinic-bottom-nav'

export function ClinicLayoutShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isConsult = pathname.endsWith('/consult')

  if (isConsult) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col overflow-y-auto bg-white text-[#0D0D0D]">
        <div className="mx-auto flex min-h-full w-full max-w-2xl flex-col px-5 py-4 sm:px-6 sm:py-6">
          {children}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white text-[#0D0D0D]">
      <div className="mx-auto flex min-h-screen max-w-4xl flex-col px-5 pb-24 sm:px-6 md:pb-8">
        {children}
        <ClinicBottomNav />
      </div>
    </div>
  )
}
