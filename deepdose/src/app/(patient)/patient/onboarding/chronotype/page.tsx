import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import {
  buildPersonalTimingPath,
  medsPathOptionsFromParsed,
  parseMedsOnboardingParams,
} from '@/lib/medications/home-to-onboarding'
import {
  onboardingPathForStep,
  resolveOnboardingStep,
} from '@/lib/onboarding/resolve'
import ChronotypeForm from '@/components/patient/ChronotypeForm'

type PageProps = {
  searchParams: Promise<{
    med?: string
    meds?: string
    times?: string
    time?: string
    wake?: string
  }>
}

export default async function ChronotypeOnboardingPage({ searchParams }: PageProps) {
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
    redirect(buildPersonalTimingPath(medPathOptions))
  }

  const step = await resolveOnboardingStep(supabase, user.id)
  if (step !== 'chronotype') {
    redirect(onboardingPathForStep(step))
  }

  return <ChronotypeForm />
}
