import { createClient } from '@/lib/supabase/server'
import { getPatientCircadianContext } from '@/lib/medications/patient-phase'
import { buildClockWindows } from '@/lib/medications/clock-windows'
import { CLINICAL_CHRONOTYPE_LABELS } from '@/lib/clinical/patient-chart'
import { decimalHoursToHHMM } from '@/lib/utils/time'
import { ClinicalCircadianPanel } from '@/components/clinical/CircadianProfile'

export default async function ClinicalPatientCircadianPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id: patientId } = await params
  const supabase = await createClient()

  const [{ data: meds }, context] = await Promise.all([
    supabase
      .from('patient_medications')
      .select('medication_code')
      .eq('patient_id', patientId)
      .eq('is_active', true),
    getPatientCircadianContext(supabase, patientId),
  ])

  const chronotypeLabel = context.chronotypeCat
    ? CLINICAL_CHRONOTYPE_LABELS[context.chronotypeCat] ?? context.chronotypeCat
    : undefined

  return (
    <ClinicalCircadianPanel
      circadianScore={context.circadianScore}
      chronotypeLabel={chronotypeLabel}
      scoreComponents={context.scoreComponents ?? undefined}
      dlmoTime={decimalHoursToHHMM(context.dlmoEstimateHours)}
      clockWindows={buildClockWindows(meds ?? [], context.phaseOffsetMinutes)}
    />
  )
}
