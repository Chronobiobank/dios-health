import { PatientTopBar } from '@/components/dashboard/patient-top-bar'
import { SECTION_LABEL } from '@/components/dashboard/dashboard-styles'
import { SmartphoneStreamPanel } from '@/components/dashboard/smartphone-stream-panel'
import { StreamsStatus } from '@/components/dashboard/streams-status'
import { TipTraqNightList } from '@/components/dashboard/tiptraq-night-list'
import { TipTraQUploadPanel } from '@/components/dashboard/tiptraq-upload-panel'
import { requirePatientSession } from '@/lib/auth/require-patient'
import { type TipTraqNightRow } from '@/lib/dashboard/dlmo-profile'
import { createClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000

export default async function DashboardStreamsPage() {
  const { user, profile, patient } = await requirePatientSession()
  const supabase = await createClient()

  const { data: nights } = await supabase
    .from('tiptraq_nights')
    .select('id, report_date, mlux_phase_time, confidence_score, confidence_label')
    .eq('patient_id', user.id)
    .order('report_date', { ascending: false })

  const { count: bloodPanelsCount } = await supabase
    .from('blood_circadian_panels')
    .select('id', { count: 'exact', head: true })
    .eq('patient_id', user.id)

  const { data: latestSmartphone } = await supabase
    .from('smartphone_circadian_observations')
    .select('observed_at, confidence_score')
    .eq('patient_id', user.id)
    .order('observed_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  const { data: mluxProfile } = await supabase
    .from('mlux_profiles')
    .select('layer1_confidence_score')
    .eq('patient_id', user.id)
    .maybeSingle()

  const nightHistory = (nights ?? []) as TipTraqNightRow[]

  const lastObservedAt = latestSmartphone?.observed_at ?? null
  const smartphoneActive =
    lastObservedAt != null && Date.now() - new Date(lastObservedAt).getTime() <= SEVEN_DAYS_MS

  const layer1Confidence =
    mluxProfile?.layer1_confidence_score ?? latestSmartphone?.confidence_score ?? null

  return (
    <>
      <PatientTopBar fullName={profile.full_name ?? 'Patient'} avatarUrl={profile.avatar_url} />

      <section>
        <h1 className="text-2xl font-medium text-black">Data streams</h1>
        <p className="mt-2 text-sm text-black/55">
          Start free with your phone, add bloods, then TipTraQ — each layer refines your body clock.
        </p>
      </section>

      <SmartphoneStreamPanel
        fitzpatrickType={patient.fitzpatrick_type}
        isActive={smartphoneActive}
        lastRecordedAt={lastObservedAt}
        layer1Confidence={layer1Confidence}
      />

      <section className="mt-10">
        <h2 className={SECTION_LABEL}>Upload TipTraQ recording</h2>
        <div className="mt-4">
          <TipTraQUploadPanel />
        </div>
      </section>

      {nightHistory.length > 0 ? (
        <div className="mt-10">
          <TipTraqNightList nights={nightHistory} />
        </div>
      ) : null}

      <StreamsStatus
        tipTraqNightsCount={nightHistory.length}
        bloodPanelsCount={bloodPanelsCount ?? 0}
        smartphoneActive={smartphoneActive}
      />
    </>
  )
}
