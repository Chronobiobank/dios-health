import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import type { MCTQInput } from '@/lib/circadian/mctq'
import {
  onboardingPathForStep,
  resolveOnboardingStep,
} from '@/lib/onboarding/resolve'
import { DashboardRhythmPanel } from '@/components/patient/DashboardRhythmPanel'

function parseStoredMctq(raw: unknown): Partial<MCTQInput> | undefined {
  if (!raw || typeof raw !== 'object') return undefined
  const mctq = (raw as { mctq?: unknown }).mctq
  if (!mctq || typeof mctq !== 'object') return undefined
  return mctq as Partial<MCTQInput>
}

export default async function DashboardRhythmPage() {
  const supabase = await createClient()
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    redirect('/?next=/patient/dashboard/rhythm')
  }

  const nextOnboardingStep = await resolveOnboardingStep(supabase, user.id)
  if (nextOnboardingStep === 'consent' || nextOnboardingStep === 'medications') {
    redirect(onboardingPathForStep(nextOnboardingStep))
  }

  const { data: latestDlmo } = await supabase
    .from('dlmo_estimates')
    .select('raw_data')
    .eq('patient_id', user.id)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  const initialValues = parseStoredMctq(latestDlmo?.raw_data)

  return (
    <div className="dash-meds space-y-8">
      <header className="seco-landing__copy-stack dash-meds__page-head">
        <h1 className="seco-page__title dash-meds__page-title">Your sleep rhythm</h1>
      </header>

      <DashboardRhythmPanel initialValues={initialValues} />
    </div>
  )
}
