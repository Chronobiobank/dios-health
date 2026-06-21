import { createClient } from '@/lib/supabase/server'
import { loadPatientBti } from '@/lib/bti/load-patient-bti'
import { ClinicalActivePrescriptionsPanel } from '@/components/clinical/ClinicalActivePrescriptionsPanel'
import { ClinicalPrescribingPanel } from '@/components/clinical/ClinicalPrescribingPanel'

export default async function ClinicalPatientMedicationsPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id: patientId } = await params
  const supabase = await createClient()

  const { data: meds } = await supabase
    .from('patient_medications')
    .select('medication_code, dose_mg, current_timing')
    .eq('patient_id', patientId)
    .eq('is_active', true)

  const btiPayloads = await loadPatientBti(supabase, patientId)
  const btiByMedication = Object.fromEntries(btiPayloads.map((p) => [p.medication_id, p]))

  return (
    <div className="dash-meds__form">
      <ClinicalActivePrescriptionsPanel
        medications={meds ?? []}
        btiByMedication={btiByMedication}
      />
      <ClinicalPrescribingPanel
        patientId={patientId}
        medications={(meds ?? []).map((m) => ({
          medication_code: m.medication_code,
          current_timing: m.current_timing,
        }))}
      />
    </div>
  )
}
