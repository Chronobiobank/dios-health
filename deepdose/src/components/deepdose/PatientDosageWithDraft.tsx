'use client'

import { PatientDosageDashboard } from '@/components/deepdose/PatientDosageDashboard'
import { usePlanDraftContext } from '@/lib/patient/use-plan-draft-context'
import type { PlanContextFromDraft } from '@/lib/patient/plan-draft'

type PatientDosageWithDraftProps = {
  urlPlanContext?: PlanContextFromDraft
  signupHrefFromUrl: string
}

export function PatientDosageWithDraft({
  urlPlanContext,
  signupHrefFromUrl,
}: PatientDosageWithDraftProps) {
  const { ready, planContext, signupHref } = usePlanDraftContext({
    urlPlanContext,
    signupHrefFromUrl,
  })

  if (!ready) return null

  return (
    <PatientDosageDashboard
      medCodes={planContext.medCodes}
      medTimes={planContext.medTimes}
      wake={planContext.wake}
      signupHref={signupHref}
    />
  )
}
