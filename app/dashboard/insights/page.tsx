import { RoutePlaceholder } from '@/components/auth/route-placeholder'
import { PatientTopBar } from '@/components/dashboard/patient-top-bar'
import { requirePatientSession } from '@/lib/auth/require-patient'

export default async function DashboardInsightsPage() {
  const { profile } = await requirePatientSession()

  return (
    <>
      <PatientTopBar fullName={profile.full_name ?? 'Patient'} avatarUrl={profile.avatar_url} />
      <RoutePlaceholder
        title="Dose insights"
        path="/dashboard/insights"
        note="Patient insights list — placeholder."
      />
    </>
  )
}
