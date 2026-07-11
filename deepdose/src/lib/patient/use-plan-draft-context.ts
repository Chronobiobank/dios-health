'use client'

import { useEffect, useMemo } from 'react'

import { buildLoginPathForMeds } from '@/lib/medications/home-to-onboarding'
import { buildDemoPlanContext } from '@/lib/patient/patient-landing-defaults'
import {
  buildPlanContextFromDraft,
  planDraftToMedsOptions,
  readPlanDraft,
  savePlanDraft,
  type PlanContextFromDraft,
} from '@/lib/patient/plan-draft'
import { useIsClient } from '@/lib/react/use-is-client'

type UsePlanDraftContextArgs = {
  urlPlanContext?: PlanContextFromDraft
  signupHrefFromUrl: string
}

export function usePlanDraftContext({
  urlPlanContext,
  signupHrefFromUrl,
}: UsePlanDraftContextArgs) {
  const isClient = useIsClient()

  useEffect(() => {
    if (!urlPlanContext) return
    savePlanDraft({
      medCodes: urlPlanContext.medCodes,
      medTimes: urlPlanContext.medTimes ?? [],
      wake: urlPlanContext.wake,
    })
  }, [urlPlanContext])

  const draftPlan = useMemo(() => {
    if (urlPlanContext || !isClient) return null
    const draft = readPlanDraft()
    return draft ? buildPlanContextFromDraft(draft) : null
  }, [urlPlanContext, isClient])

  const ready = Boolean(urlPlanContext) || isClient
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
