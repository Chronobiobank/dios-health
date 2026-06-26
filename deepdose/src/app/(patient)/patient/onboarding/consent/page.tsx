import { redirect } from 'next/navigation'
import { Suspense } from 'react'
import { createClient } from '@/lib/supabase/server'
import {
  getConsentPurposes,
  getCurrentFramework,
  getPatientConsents,
} from '@/lib/consent/dynamic-consent'
import {
  buildLoginPathForMeds,
  medsPathOptionsFromParsed,
  parseMedsOnboardingParams,
} from '@/lib/medications/home-to-onboarding'
import {
  onboardingPathForStep,
  resolveOnboardingStep,
} from '@/lib/onboarding/resolve'
import ConsentPanel from '@/components/patient/ConsentPanel'
import { FormError } from '@/components/ui/Form'

function ErrorState({ message }: { message: string }) {
  return <FormError>{message}</FormError>
}

type PageProps = {
  searchParams: Promise<{
    med?: string
    meds?: string
    times?: string
    time?: string
    wake?: string
  }>
}

export default async function ConsentOnboardingPage({ searchParams }: PageProps) {
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
