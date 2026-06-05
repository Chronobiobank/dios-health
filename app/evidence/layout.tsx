import { MarketingShell } from '@/components/sections/marketing-shell'

export default function EvidenceLayout({ children }: { children: React.ReactNode }) {
  return (
    <MarketingShell
      className="evidence-retinomic-route !text-slate-100"
      prefetchRoutes={false}
    >
      {children}
    </MarketingShell>
  )
}
