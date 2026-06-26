'use client'

import { useEffect, useState } from 'react'

import { DeepDoseLanding } from '@/components/deepdose/DeepDoseLanding'
import { buildLoginPathForMeds } from '@/lib/medications/home-to-onboarding'
import {
  buildPlanContextFromDraft,
  planDraftToMedsOptions,
  readPlanDraft,
  savePlanDraft,
  type PlanContextFromDraft,
} from '@/lib/patient/plan-draft'

type PatientLandingWithDraftProps = {
  urlPlanContext?: PlanContextFromDraft
  signupHrefFromUrl: string
}

export function PatientLandingWithDraft({
  urlPlanContext,
  signupHrefFromUrl,
}: PatientLandingWithDraftProps) {
  const [draftPlan, setDraftPlan] = useState<PlanContextFromDraft | null>(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    if (urlPlanContext) {
      savePlanDraft({
        medCodes: urlPlanContext.medCodes,
        medTimes: urlPlanContext.medTimes ?? [],
        wake: urlPlanContext.wake,
      })
      setReady(true)
      return
    }

    const draft = readPlanDraft()
    if (draft) {
      setDraftPlan(buildPlanContextFromDraft(draft))
    }
    setReady(true)
  }, [urlPlanContext])

  if (!ready) return null

  const planContext = urlPlanContext ?? draftPlan ?? undefined
  const signupHref = planContext
    ? buildLoginPathForMeds(
        planDraftToMedsOptions({
          medCodes: planContext.medCodes,
          medTimes: planContext.medTimes ?? [],
          wake: planContext.wake,
        })
      )
    : signupHrefFromUrl

  return <DeepDoseLanding signupHref={signupHref} planContext={planContext} />
}
