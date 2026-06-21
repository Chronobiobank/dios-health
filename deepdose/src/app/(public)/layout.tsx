import { SplashRouteShell } from '@/components/deepdose/SplashRouteShell'
import '@/styles/dios-health-marketing.css'

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return <SplashRouteShell>{children}</SplashRouteShell>
}
