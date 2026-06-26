import { redirect } from 'next/navigation'
import { Suspense } from 'react'
import { createClient } from '@/lib/supabase/server'
import { getPatientCircadianContext } from '@/lib/medications/patient-phase'
import {
  buildConsentOnboardingPath,
  buildLoginPathForMeds,
  medsPathOptionsFromParsed,
  parseMedsOnboardingParams,
} from '@/lib/medications/home-to-onboarding'
import {
  onboardingPathForStep,
  resolveOnboardingStep,
} from '@/lib/onboarding/resolve'
import MedicationsOnboardingForm from '@/components/patient/MedicationsOnboardingForm'

type PageProps = {
  searchParams: Promise<{
    med?: string
    meds?: string
    times?: string
    time?: string
    wake?: string
  }>
}

export default async function MedicationsOnboardingPage({ searchParams }: PageProps) {
  const params = await searchParams
  const parsed = parseMedsOnboardingParams(
    new URLSearchParams(
      Object.entries(params).flatMap(([key, value]) => (value ? [[key, value]] : []))
    )
  )
  const medPathOptions = medsPathOptionsFromParsed(parsed)

  const supabase = await createClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    redirect(buildLoginPathForMeds(medPathOptions))
  }

  const step = await resolveOnboardingStep(supabase, user.id)
  if (step !== 'medications') {
    if (step === 'consent') {
      redirect(buildConsentOnboardingPath(medPathOptions))
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
