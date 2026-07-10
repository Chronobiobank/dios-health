import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getPatientCircadianContext } from '@/lib/medications/patient-phase'
import {
  onboardingPathForStep,
  resolveOnboardingStep,
} from '@/lib/onboarding/resolve'
import { DashboardMedicationsPanel } from '@/components/patient/DashboardMedicationsPanel'

export default async function DashboardMedicationsPage() {
  const supabase = await createClient()
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    redirect('/?next=/patient/dashboard/medications')
  }

  const nextOnboardingStep = await resolveOnboardingStep(supabase, user.id)
  if (nextOnboardingStep === 'consent' || nextOnboardingStep === 'medications') {
    redirect(onboardingPathForStep(nextOnboardingStep))
  }

  const context = await getPatientCircadianContext(supabase, user.id)

  return (
    <div className="dash-meds space-y-8">
      <header className="seco-landing__copy-stack dash-meds__page-head">
        <h1 className="seco-page__title dash-meds__page-title">Your medicines</h1>
      </header>

      <DashboardMedicationsPanel phaseOffsetMinutes={context.phaseOffsetMinutes} />
    </div>
  )
}
