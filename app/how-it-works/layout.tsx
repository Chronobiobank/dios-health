import '@/app/dashboard/retinomic-dashboard.css'

import { MarketingShell } from '@/components/sections/marketing-shell'

/** Live demo — marketing shell + retinomic panel styles */
export default function HowItWorksLayout({ children }: { children: React.ReactNode }) {
  return (
    <MarketingShell prefetchRoutes={false} className="how-it-works-route">
      <div className="how-it-works-route__inner mx-auto w-full pb-8">{children}</div>
    </MarketingShell>
  )
}
