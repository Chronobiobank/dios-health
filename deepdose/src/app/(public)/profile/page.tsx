import type { Metadata } from 'next'

import { PatientLandingWithDraft } from '@/components/deepdose/PatientLandingWithDraft'
import { ProfileAccountGear } from '@/components/deepdose/ProfileAccountGear'
import { DEEPDOSE_NAME } from '@/lib/brand/deepdose-brand'
import { resolvePlanFromSearchParams } from '@/lib/medications/parse-plan-search-params'
import { createClient } from '@/lib/supabase/server'

export const metadata: Metadata = {
  title: `${DEEPDOSE_NAME} · Me`,
  description: 'Your doses, SRI, and doser profile.',
  alternates: { canonical: '/profile' },
}

type PageProps = {
  searchParams: Promise<{ med?: string; meds?: string; times?: string; time?: string; wake?: string }>
}

export default async function ProfilePage({ searchParams }: PageProps) {
  const params = await searchParams
  const { urlPlanContext, signupHref } = resolvePlanFromSearchParams(params)

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  return (
    <PatientLandingWithDraft
      urlPlanContext={urlPlanContext}
      signupHrefFromUrl={signupHref}
      accountGear={user ? <ProfileAccountGear /> : null}
    />
  )
}
