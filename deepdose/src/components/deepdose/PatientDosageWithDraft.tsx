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
    <div className="seco-landing seco-landing--maven seco-landing--patient-plan seco-landing--sleep-wake-dash">
      <section className="seco-landing__hero seco-landing__hero--sleep-wake-dash">
        <div className="seco-landing__section-inner seco-reveal seco-reveal--1">
          <PatientDosageDashboard
            medCodes={planContext.medCodes}
            medTimes={planContext.medTimes}
            wake={planContext.wake}
            signupHref={signupHref}
          />
        </div>
      </section>
    </div>
  )
}
