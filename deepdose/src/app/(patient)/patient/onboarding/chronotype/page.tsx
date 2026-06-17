import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import {
  getConsentPurposes,
  getCurrentFramework,
  getPatientConsents,
  hasCompletedRequiredConsents,
} from '@/lib/consent/dynamic-consent'
import ChronotypeForm from '@/components/patient/ChronotypeForm'

export default async function ChronotypeOnboardingPage() {
  const supabase = await createClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    redirect('/login?next=/patient/onboarding/chronotype')
  }

  const { framework } = await getCurrentFramework(supabase)
  if (framework) {
    const { purposes } = await getConsentPurposes(supabase, framework.id)
    const { consents } = await getPatientConsents(supabase, user.id)
    if (!hasCompletedRequiredConsents(purposes, consents)) {
      redirect('/patient/onboarding/consent')
    }
  }

  const { data: existing } = await supabase
    .from('chronotype_profiles')
    .select('id')
    .eq('patient_id', user.id)
    .limit(1)

  if (existing?.length) {
    redirect('/patient/onboarding/medications')
  }

  return <ChronotypeForm />
}
