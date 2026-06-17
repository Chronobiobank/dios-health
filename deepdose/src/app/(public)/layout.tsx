import { PublicMarketingShell } from '@/components/secopeutic/PublicMarketingShell'
import '@/styles/dios-health-marketing.css'

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return <PublicMarketingShell>{children}</PublicMarketingShell>
}
