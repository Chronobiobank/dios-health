import type { Metadata } from 'next'

import { PatientLandingWithDraft } from '@/components/deepdose/PatientLandingWithDraft'
import { DEEPDOSE_NAME } from '@/lib/brand/deepdose-brand'
import { resolvePlanFromSearchParams } from '@/lib/medications/parse-plan-search-params'

export const metadata: Metadata = {
  title: `${DEEPDOSE_NAME} · Profile`,
  description:
    'Sleep matters. Your Sleep Regularity Index shows disease risk across a continuum. Raise it with six personalised daily doses.',
  alternates: { canonical: '/profile' },
}

type PageProps = {
  searchParams: Promise<{ med?: string; meds?: string; times?: string; time?: string; wake?: string }>
}

export default async function ProfilePage({ searchParams }: PageProps) {
  const params = await searchParams
  const { urlPlanContext, signupHref } = resolvePlanFromSearchParams(params)

  return (
    <PatientLandingWithDraft urlPlanContext={urlPlanContext} signupHrefFromUrl={signupHref} />
  )
}
