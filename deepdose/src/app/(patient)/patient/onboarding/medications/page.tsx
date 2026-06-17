import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import {
  getConsentPurposes,
  getCurrentFramework,
  getPatientConsents,
  hasCompletedRequiredConsents,
} from '@/lib/consent/dynamic-consent'
import { getPatientCircadianContext } from '@/lib/medications/patient-phase'
import { buildMedicationRecommendations } from '@/lib/medications/recommendations'
import MedicationsOnboardingForm from '@/components/patient/MedicationsOnboardingForm'
import { FormError } from '@/components/ui/Form'

export default async function MedicationsOnboardingPage() {
  const supabase = await createClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    redirect('/login?next=/patient/onboarding/medications')
  }

  const { framework } = await getCurrentFramework(supabase)
  if (framework) {
    const { purposes } = await getConsentPurposes(supabase, framework.id)
    const { consents } = await getPatientConsents(supabase, user.id)
    if (!hasCompletedRequiredConsents(purposes, consents)) {
      redirect('/patient/onboarding/consent')
    }
  }

  const { data: chronotype } = await supabase
    .from('chronotype_profiles')
    .select('id')
    .eq('patient_id', user.id)
    .limit(1)

  if (!chronotype?.length) {
    redirect('/patient/onboarding/chronotype')
  }

  const { data: existingMeds } = await supabase
    .from('patient_medications')
    .select('id')
    .eq('patient_id', user.id)
    .eq('is_active', true)
    .limit(1)

  if (existingMeds?.length) {
    redirect('/patient/dashboard')
  }

  const context = await getPatientCircadianContext(supabase, user.id)

  const { data: medications, error: medsError } = await supabase
    .from('medications')
    .select('code, display_name, drug_class, evidence_grade')
    .order('display_name')

  if (medsError || !medications?.length) {
    return (
      <FormError>
        Could not load medications: {medsError?.message ?? 'No medications found'}
      </FormError>
    )
  }

  const recommendations = buildMedicationRecommendations(medications, context.phaseOffsetMinutes)

  return <MedicationsOnboardingForm medications={recommendations} context={context} />
}
