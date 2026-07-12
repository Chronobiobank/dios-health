import type { Metadata } from 'next'

import { ProfilePageClient } from '@/components/deepdose/ProfilePageClient'
import { DEEPDOSE_NAME } from '@/lib/brand/deepdose-brand'
import { resolvePlanFromSearchParams } from '@/lib/medications/parse-plan-search-params'

export const metadata: Metadata = {
  title: `Profile · ${DEEPDOSE_NAME}`,
  description: 'Your chemical phenotype score, identity, doses, and Homekit tools.',
  alternates: { canonical: '/profile' },
}

type PageProps = {
  searchParams: Promise<{ med?: string; meds?: string; times?: string; time?: string; wake?: string }>
}

export default async function ProfilePage({ searchParams }: PageProps) {
  const params = await searchParams
  const { urlPlanContext, signupHref } = resolvePlanFromSearchParams(params)

  return (
    <ProfilePageClient
      urlPlanContext={urlPlanContext}
      signupHrefFromUrl={signupHref}
    />
  )
}
