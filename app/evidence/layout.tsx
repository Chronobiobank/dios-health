import { MarketingShell } from '@/components/sections/marketing-shell'

export default function EvidenceLayout({ children }: { children: React.ReactNode }) {
  return <MarketingShell prefetchRoutes={false}>{children}</MarketingShell>
}
