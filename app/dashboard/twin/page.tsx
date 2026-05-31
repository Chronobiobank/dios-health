import { DashboardPageTransition } from '@/components/dashboard/dashboard-page-transition'
import { PatientTopBar } from '@/components/dashboard/patient-top-bar'
import { buildPatientDashboardHeader } from '@/lib/auth/patient-dashboard-header'
import { requirePatientSession } from '@/lib/auth/require-patient'

export default async function DashboardTwinPage() {
  const { profile, patient } = await requirePatientSession()

  const header = buildPatientDashboardHeader({
    profile,
    patient,
    subtitle: 'Your live body clock twin — coming soon.',
  })

  return (
    <DashboardPageTransition className="gap-6">
      <PatientTopBar {...header} />
      <section className="rounded-lg border border-black/10 bg-[#FAFAFA] px-6 py-12 text-center">
        <p className="text-[15px] leading-relaxed text-black/60">
          Patient twin view — placeholder.
        </p>
      </section>
    </DashboardPageTransition>
  )
}
