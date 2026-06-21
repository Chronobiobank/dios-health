import { redirect } from 'next/navigation'
import { Suspense } from 'react'
import { createClient } from '@/lib/supabase/server'
import { getPatientCircadianContext } from '@/lib/medications/patient-phase'
import { buildConsentOnboardingPath, buildLoginPathForMeds } from '@/lib/medications/home-to-onboarding'
import {
  onboardingPathForStep,
  resolveOnboardingStep,
} from '@/lib/onboarding/resolve'
import MedicationsOnboardingForm from '@/components/patient/MedicationsOnboardingForm'

type PageProps = {
  searchParams: Promise<{ med?: string; time?: string }>
}

export default async function MedicationsOnboardingPage({ searchParams }: PageProps) {
  const params = await searchParams
  const med = params.med?.trim() ?? undefined
  const time = params.time?.trim()?.slice(0, 5) ?? undefined

  const supabase = await createClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    redirect(buildLoginPathForMeds({ med, time }))
  }

  const step = await resolveOnboardingStep(supabase, user.id)
  if (step !== 'medications') {
    if (step === 'consent') {
      redirect(buildConsentOnboardingPath({ med, time }))
    }
    redirect(onboardingPathForStep(step))
  }

  const context = await getPatientCircadianContext(supabase, user.id)

  return (
    <Suspense fallback={null}>
      <MedicationsOnboardingForm phaseOffsetMinutes={context.phaseOffsetMinutes} />
    </Suspense>
  )
}
