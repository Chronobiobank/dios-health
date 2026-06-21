import { redirect } from 'next/navigation'
import { Suspense } from 'react'
import { createClient } from '@/lib/supabase/server'
import {
  getConsentPurposes,
  getCurrentFramework,
  getPatientConsents,
} from '@/lib/consent/dynamic-consent'
import {
  onboardingPathForStep,
  resolveOnboardingStep,
} from '@/lib/onboarding/resolve'
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

  const step = await resolveOnboardingStep(supabase, user.id)
  if (step !== 'consent') {
    redirect(onboardingPathForStep(step))
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

  return (
    <Suspense fallback={null}>
      <ConsentPanel framework={framework} purposes={purposes} initialConsents={consents} />
    </Suspense>
  )
}
