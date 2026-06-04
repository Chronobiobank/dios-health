import type { ReactNode } from 'react'

import '../dashboard/patient-dashboard.css'

export default function CircadianModelLayout({ children }: { children: ReactNode }) {
  return <div className="patient-dashboard-shell min-h-screen">{children}</div>
}
