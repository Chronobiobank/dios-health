import { MarketingShell } from '@/components/sections/marketing-shell'

export default function SignInLayout({ children }: { children: React.ReactNode }) {
  return <MarketingShell prefetchRoutes={false}>{children}</MarketingShell>
}
