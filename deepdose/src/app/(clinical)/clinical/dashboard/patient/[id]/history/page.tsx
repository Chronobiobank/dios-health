import { createClient } from '@/lib/supabase/server'
import { fetchPatientRecommendationsForClinician } from '@/lib/prescribing/recommendations'
import { fetchPatientAdherenceLog } from '@/lib/clinical/patient-chart'
import { ClinicalRecommendationsPanel } from '@/components/clinical/ClinicalRecommendationsPanel'
import { ClinicalAdherencePanel } from '@/components/clinical/ClinicalAdherencePanel'

export default async function ClinicalPatientHistoryPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id: patientId } = await params
  const supabase = await createClient()

  const [recommendations, adherenceLog] = await Promise.all([
    fetchPatientRecommendationsForClinician(supabase, patientId),
    fetchPatientAdherenceLog(supabase, patientId),
  ])

  return (
    <div className="dash-meds__form">
      <ClinicalRecommendationsPanel recommendations={recommendations} />
      <ClinicalAdherencePanel entries={adherenceLog} />
    </div>
  )
}
