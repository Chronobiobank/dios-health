import type { Metadata } from 'next'
import { redirect } from 'next/navigation'

import { AuthedDosageHome } from '@/components/deepdose/AuthedDosageHome'
import { PatientDosageWithDraft } from '@/components/deepdose/PatientDosageWithDraft'
import { ProductAppShell } from '@/components/deepdose/ProductAppShell'
import { DOSAGE_PAGE_META } from '@/lib/deepdose-marketing/dosage-content'
import { resolvePlanFromSearchParams } from '@/lib/medications/parse-plan-search-params'
import {
  onboardingPathForStep,
  resolveOnboardingStep,
} from '@/lib/onboarding/resolve'
import { createClient } from '@/lib/supabase/server'

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

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (user) {
    const step = await resolveOnboardingStep(supabase, user.id)
    if (step !== 'complete') {
      redirect(onboardingPathForStep(step))
    }
    return (
      <ProductAppShell title="Chemistry" className="dd-dosage">
        <AuthedDosageHome userId={user.id} />
      </ProductAppShell>
    )
  }

  return (
    <ProductAppShell title="Chemistry" className="dd-dosage">
      <PatientDosageWithDraft urlPlanContext={urlPlanContext} signupHrefFromUrl={signupHref} />
    </ProductAppShell>
  )
}
