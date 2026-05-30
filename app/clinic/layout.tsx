import { ClinicLayoutShell } from '@/components/clinic/clinic-layout-shell'

export default function ClinicLayout({ children }: { children: React.ReactNode }) {
  return <ClinicLayoutShell>{children}</ClinicLayoutShell>
}
