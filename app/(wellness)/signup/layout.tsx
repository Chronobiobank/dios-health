import { MarketingShell } from '@/components/sections/marketing-shell'

export default function SignUpLayout({ children }: { children: React.ReactNode }) {
  return <MarketingShell prefetchRoutes={false}>{children}</MarketingShell>
}
