import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import {
  onboardingPathForStep,
  resolveOnboardingStep,
} from '@/lib/onboarding/resolve'
import ChronotypeForm from '@/components/patient/ChronotypeForm'

export default async function ChronotypeOnboardingPage() {
  const supabase = await createClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    redirect('/login?next=/patient/onboarding/chronotype')
  }

  const step = await resolveOnboardingStep(supabase, user.id)
  if (step !== 'chronotype') {
    redirect(onboardingPathForStep(step))
  }

  return <ChronotypeForm />
}
