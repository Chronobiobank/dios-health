'use client'

import { useEffect, useState } from 'react'

import { buildLoginPathForMeds } from '@/lib/medications/home-to-onboarding'
import { buildDemoPlanContext } from '@/lib/patient/patient-landing-defaults'
import {
  buildPlanContextFromDraft,
  planDraftToMedsOptions,
  readPlanDraft,
  savePlanDraft,
  type PlanContextFromDraft,
} from '@/lib/patient/plan-draft'

type UsePlanDraftContextArgs = {
  urlPlanContext?: PlanContextFromDraft
  signupHrefFromUrl: string
}

export function usePlanDraftContext({
  urlPlanContext,
  signupHrefFromUrl,
}: UsePlanDraftContextArgs) {
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

  const planContext = urlPlanContext ?? draftPlan ?? buildDemoPlanContext()

  const signupHref = planContext
    ? buildLoginPathForMeds(
        planDraftToMedsOptions({
          medCodes: planContext.medCodes,
          medTimes: planContext.medTimes ?? [],
          wake: planContext.wake,
        })
      )
    : signupHrefFromUrl

  return { ready, planContext, signupHref }
}
