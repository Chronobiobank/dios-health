'use client'

import { PatientSleepWakeDashboard } from '@/components/deepdose/PatientSleepWakeDashboard'
import type { PlanContextFromDraft } from '@/lib/patient/plan-draft'

type PatientLandingDashboardProps = {
  planContext: PlanContextFromDraft
  signupHref: string
}

export function PatientLandingDashboard({
  planContext,
  signupHref,
}: PatientLandingDashboardProps) {
  return (
    <div className="seco-landing seco-landing--maven seco-landing--patient-plan seco-landing--sleep-wake-dash">
      <section className="seco-landing__hero seco-landing__hero--sleep-wake-dash">
        <div className="seco-landing__section-inner seco-reveal seco-reveal--1">
          <PatientSleepWakeDashboard
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
