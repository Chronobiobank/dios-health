import { Suspense } from 'react'

import { GpReportView } from '@/components/dashboard/gp-report-view'
import { PrintGpReportActions } from '@/components/dashboard/print-gp-report-actions'
import { buildGpReportData } from '@/lib/dashboard/gp-report-data'
import type { MLuxProfileRow } from '@/lib/dashboard/mlux-profile'
import { requirePatientSession } from '@/lib/auth/require-patient'
import { createClient } from '@/lib/supabase/server'

export default async function DashboardGpReportPage() {
  const { user, profile, patient } = await requirePatientSession()
  const supabase = await createClient()

  const [{ data: mluxProfile }, { data: nights }] = await Promise.all([
    supabase.from('mlux_profiles').select('*').eq('patient_id', user.id).maybeSingle(),
    supabase
      .from('tiptraq_nights')
      .select('report_date, mlux_phase_time, confidence_score')
      .eq('patient_id', user.id)
      .order('report_date', { ascending: false }),
  ])

  const profileRow = mluxProfile as MLuxProfileRow | null
  const report = buildGpReportData({
    patientName: profile.full_name ?? 'Patient',
    age: patient.age,
    biologicalSex: patient.biological_sex,
    dataShareGp: patient.data_share_gp,
    mluxProfile: profileRow,
    nights: nights ?? [],
  })

  return (
    <>
      <GpReportView report={report} />

      <Suspense fallback={null}>
        <div className="print:hidden">
          <PrintGpReportActions canPrint={report.hasTipTraqData} />
        </div>
      </Suspense>
    </>
  )
}
