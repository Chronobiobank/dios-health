import { cn } from '@/lib/utils'

import '../dashboard/patient-dashboard.css'

/** Same chrome as /dashboard — no marketing header, global pastel backdrop. */
export default function HowItWorksLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="patient-dashboard-route how-it-works-route min-h-screen"
      data-dashboard="patient-v2"
    >
      <div className={cn('dashboard-route-shell mx-auto w-full pb-8')}>{children}</div>
    </div>
  )
}
