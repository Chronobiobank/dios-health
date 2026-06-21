import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { loadPatientBti } from '@/lib/bti/load-patient-bti'
import { fetchPatientTipTraqAssessment } from '@/lib/clinical/tiptraq-assessments'
import {
  buildBlockMetricsFromRecords,
  fetchPatientTipTraqNights,
} from '@/lib/clinical/tiptraq-nights'
import { TIPTRAQ_BASELINE_NIGHTS } from '@/lib/clinical/tiptraq-program'
import { TipTraqPatientPanel } from '@/components/clinical/TipTraqGpProgramPanel'
import { TipTraqReadingsPanel } from '@/components/clinical/TipTraqReadingsPanel'
import { ClinicalActivePrescriptionsPanel } from '@/components/clinical/ClinicalActivePrescriptionsPanel'

export default async function ClinicalPatientOverviewPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id: patientId } = await params
  const supabase = await createClient()
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    redirect('/login?next=/clinical/dashboard')
  }

  const [{ data: meds }, tiptraqAssessment] = await Promise.all([
    supabase
      .from('patient_medications')
      .select('medication_code, dose_mg, current_timing')
      .eq('patient_id', patientId)
      .eq('is_active', true),
    fetchPatientTipTraqAssessment(supabase, patientId, user.id),
  ])

  const [btiPayloads, tiptraqNights] = await Promise.all([
    loadPatientBti(supabase, patientId),
    fetchPatientTipTraqNights(supabase, patientId, tiptraqAssessment?.id ?? null),
  ])

  const btiByMedication = Object.fromEntries(btiPayloads.map((p) => [p.medication_id, p]))
  const tiptraqMetrics = buildBlockMetricsFromRecords(
    tiptraqNights,
    tiptraqAssessment?.nights_required ?? TIPTRAQ_BASELINE_NIGHTS
  )

  return (
    <div className="dash-meds__form">
      <TipTraqPatientPanel patientId={patientId} assessment={tiptraqAssessment} />
      <TipTraqReadingsPanel
        patientId={patientId}
        assessment={tiptraqAssessment}
        nights={tiptraqNights}
        metrics={tiptraqMetrics}
      />
      <ClinicalActivePrescriptionsPanel
        medications={meds ?? []}
        btiByMedication={btiByMedication}
      />
    </div>
  )
}
