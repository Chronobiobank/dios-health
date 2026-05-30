import { DataControlsPanel } from '@/components/dashboard/data-controls-panel'
import { PatientTopBar } from '@/components/dashboard/patient-top-bar'
import { requirePatientSession } from '@/lib/auth/require-patient'

export default async function DashboardDataControlsPage() {
  const { user, profile, patient } = await requirePatientSession()

  return (
    <>
      <PatientTopBar fullName={profile.full_name ?? 'Patient'} />

      <section>
        <h1 className="text-2xl font-medium text-black">Data controls</h1>
        <p className="mt-2 text-sm text-black/55">
          You decide who sees your data. Each toggle saves immediately when you change it.
        </p>
      </section>

      <DataControlsPanel
        patientId={user.id}
        dataShareGp={patient.data_share_gp}
        dataShareResearch={patient.data_share_research}
        dataSharePolicy={patient.data_share_policy}
      />
    </>
  )
}
