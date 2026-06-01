import Link from 'next/link'

import { DataControlsPanel } from '@/components/dashboard/data-controls-panel'
import { DashboardPageTransition } from '@/components/dashboard/dashboard-page-transition'
import { GpReportButton } from '@/components/dashboard/gp-report-button'
import { PatientTopBar } from '@/components/dashboard/patient-top-bar'
import { TipTraqNightList } from '@/components/dashboard/tiptraq-night-list'
import { SignOutButton } from '@/components/auth/sign-out-button'
import { ProfileAvatarUpload } from '@/components/profile/profile-avatar-upload'
import { buildPatientDashboardHeader } from '@/lib/auth/patient-dashboard-header'
import { requirePatientSession } from '@/lib/auth/require-patient'
import { PATIENT_ROUTES } from '@/lib/auth/routes'
import { type TipTraqNightRow } from '@/lib/dashboard/mlux-profile'
import { createClient } from '@/lib/supabase/server'

export default async function DashboardDataControlsPage() {
  const { user, profile, patient } = await requirePatientSession()
  const supabase = await createClient()

  const { data: nights } = await supabase
    .from('tiptraq_nights')
    .select('id, report_date, mlux_phase_time, confidence_score, confidence_label')
    .eq('patient_id', user.id)
    .order('report_date', { ascending: false })

  const nightHistory = (nights ?? []) as TipTraqNightRow[]

  const header = buildPatientDashboardHeader({
    profile,
    patient,
    subtitle: 'Your profile and data sharing preferences.',
  })

  return (
    <DashboardPageTransition className="gap-6">
      <PatientTopBar {...header} />

      <section>
        <ProfileAvatarUpload fullName={profile.full_name ?? 'Patient'} initialAvatarUrl={profile.avatar_url} />
      </section>

      <section className="mt-8">
        <h2 className="text-xs font-medium uppercase tracking-[0.08em] text-black/45">Profile</h2>
        <Link
          href={PATIENT_ROUTES.profile}
          className="mt-4 flex items-center justify-between rounded-2xl border-[0.5px] border-black/[0.08] bg-white px-5 py-4 shadow-[0_2px_12px_rgba(0,0,0,0.06)] transition-colors hover:border-black/15"
        >
          <div>
            <p className="text-sm font-medium text-black">Demographic details</p>
            <p className="mt-1 text-sm text-black/55">
              Skin type, location, shift work, and body clock questions
            </p>
          </div>
          <span className="font-mono text-[11px] text-black/45">Edit →</span>
        </Link>
      </section>

      {nightHistory.length > 0 ? (
        <div className="mt-10">
          <TipTraqNightList nights={nightHistory} title="Your TipTraQ recordings" />
          <div className="mt-6">
            <GpReportButton />
          </div>
        </div>
      ) : null}

      <section className="mt-10">
        <h2 className="text-xs font-medium uppercase tracking-[0.08em] text-black/45">Data controls</h2>
        <p className="mt-2 text-sm text-black/55">
          You decide who sees your data. Each toggle saves immediately when you change it.
        </p>
      </section>

      <div className="mt-4">
        <DataControlsPanel
          patientId={user.id}
          dataShareGp={patient.data_share_gp}
          dataShareResearch={patient.data_share_research}
          dataSharePolicy={patient.data_share_policy}
        />
      </div>

      <section className="mt-12 border-t border-black/10 pt-8">
        <h2 className="text-xs font-medium uppercase tracking-[0.08em] text-black/45">Account</h2>
        <SignOutButton className="mt-4" />
      </section>
    </DashboardPageTransition>
  )
}
