import { PatientTopBar } from '@/components/dashboard/patient-top-bar'
import { SECTION_LABEL } from '@/components/dashboard/dashboard-styles'
import { StreamsStatus } from '@/components/dashboard/streams-status'
import { TipTraQUploadPanel } from '@/components/dashboard/tiptraq-upload-panel'
import { requirePatientSession } from '@/lib/auth/require-patient'
import { formatDbTime, formatReportDate, type TipTraqNightRow } from '@/lib/dashboard/dlmo-profile'
import { createClient } from '@/lib/supabase/server'

export default async function DashboardStreamsPage() {
  const { user, profile, patient } = await requirePatientSession()
  const supabase = await createClient()

  const { data: nights } = await supabase
    .from('tiptraq_nights')
    .select('id, report_date, proxy_dlmo_time, confidence_score, confidence_label')
    .eq('patient_id', user.id)
    .order('report_date', { ascending: false })

  const nightHistory = (nights ?? []) as TipTraqNightRow[]

  return (
    <>
      <PatientTopBar fullName={profile.full_name ?? 'Patient'} />

      <section>
        <h1 className="text-2xl font-medium text-black">Data streams</h1>
        <p className="mt-2 text-sm text-black/55">
          Connect wearables and upload TipTraQ reports to refine your body clock.
        </p>
      </section>

      <section className="mt-8">
        <h2 className={SECTION_LABEL}>Upload TipTraQ report</h2>
        <div className="mt-4">
          <TipTraQUploadPanel />
        </div>
      </section>

      {nightHistory.length > 0 ? (
        <section className="mt-10">
          <h2 className={SECTION_LABEL}>Uploaded nights</h2>
          <ul className="mt-4 space-y-3">
            {nightHistory.map((night) => (
              <li
                key={night.id}
                className="flex items-center justify-between rounded-xl border-[0.5px] border-black/[0.08] bg-white px-4 py-3 shadow-[0_2px_12px_rgba(0,0,0,0.04)]"
              >
                <div>
                  <p className="text-sm font-medium text-black">{formatReportDate(night.report_date)}</p>
                  <p className="mt-0.5 font-mono text-[11px] text-black/45">
                    DLMO {formatDbTime(night.proxy_dlmo_time)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-mono text-sm font-medium text-black">{night.confidence_score ?? '—'}%</p>
                  <p className="font-mono text-[11px] text-black/45">{night.confidence_label ?? 'Low'}</p>
                </div>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <StreamsStatus wearableConnected={patient.wearable_connected} />
    </>
  )
}
