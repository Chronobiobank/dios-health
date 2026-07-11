'use client'

import { PatientLandingDashboard } from '@/components/deepdose/PatientLandingDashboard'
import { usePlanDraftContext } from '@/lib/patient/use-plan-draft-context'
import type { PlanContextFromDraft } from '@/lib/patient/plan-draft'

type PatientLandingWithDraftProps = {
  urlPlanContext?: PlanContextFromDraft
  signupHrefFromUrl: string
}

export function PatientLandingWithDraft({
  urlPlanContext,
  signupHrefFromUrl,
}: PatientLandingWithDraftProps) {
  const { ready, planContext, signupHref } = usePlanDraftContext({
    urlPlanContext,
    signupHrefFromUrl,
  })

  if (!ready) return null

  return (
    <PatientLandingDashboard
      planContext={planContext}
      signupHref={signupHref}
    />
  )
}
