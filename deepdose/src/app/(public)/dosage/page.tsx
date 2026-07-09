import type { Metadata } from 'next'

import { PatientDosageWithDraft } from '@/components/deepdose/PatientDosageWithDraft'
import { DOSAGE_PAGE_META } from '@/lib/deepdose-marketing/dosage-content'
import { resolvePlanFromSearchParams } from '@/lib/medications/parse-plan-search-params'

export const metadata: Metadata = {
  title: DOSAGE_PAGE_META.title,
  description: DOSAGE_PAGE_META.description,
  alternates: { canonical: '/dosage' },
}

type PageProps = {
  searchParams: Promise<{ med?: string; meds?: string; times?: string; time?: string; wake?: string }>
}

export default async function DosagePage({ searchParams }: PageProps) {
  const params = await searchParams
  const { urlPlanContext, signupHref } = resolvePlanFromSearchParams(params)

  return (
    <PatientDosageWithDraft urlPlanContext={urlPlanContext} signupHrefFromUrl={signupHref} />
  )
}
