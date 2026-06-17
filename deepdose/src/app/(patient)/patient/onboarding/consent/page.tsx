import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import {
  getConsentPurposes,
  getCurrentFramework,
  getPatientConsents,
  hasCompletedRequiredConsents,
} from '@/lib/consent/dynamic-consent'
import ConsentPanel from '@/components/patient/ConsentPanel'
import { FormError } from '@/components/ui/Form'

function ErrorState({ message }: { message: string }) {
  return <FormError>{message}</FormError>
}

export default async function ConsentOnboardingPage() {
  const supabase = await createClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    redirect('/login?next=/patient/onboarding/consent')
  }

  const { framework, error: frameworkError } = await getCurrentFramework(supabase)
  if (frameworkError || !framework) {
    return <ErrorState message={`Could not load consent framework: ${frameworkError ?? 'Not found'}`} />
  }

  const { purposes, error: purposesError } = await getConsentPurposes(supabase, framework.id)
  if (purposesError) {
    return <ErrorState message={`Could not load consent purposes: ${purposesError}`} />
  }

  const { consents, error: consentsError } = await getPatientConsents(supabase, user.id)
  if (consentsError) {
    return <ErrorState message={`Could not load your consents: ${consentsError}`} />
  }

  if (hasCompletedRequiredConsents(purposes, consents)) {
    redirect('/patient/onboarding/chronotype')
  }

  return <ConsentPanel framework={framework} purposes={purposes} initialConsents={consents} />
}
