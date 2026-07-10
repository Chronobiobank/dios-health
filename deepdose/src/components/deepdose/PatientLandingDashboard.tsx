'use client'

import type { ReactNode } from 'react'

import { PatientSleepWakeDashboard } from '@/components/deepdose/PatientSleepWakeDashboard'
import type { PlanContextFromDraft } from '@/lib/patient/plan-draft'

type PatientLandingDashboardProps = {
  planContext: PlanContextFromDraft
  signupHref: string
  accountGear?: ReactNode
}

export function PatientLandingDashboard({
  planContext,
  signupHref,
  accountGear,
}: PatientLandingDashboardProps) {
  return (
    <div className="seco-landing seco-landing--maven seco-landing--patient-plan seco-landing--sleep-wake-dash">
      <section className="seco-landing__hero seco-landing__hero--sleep-wake-dash">
        <div className="seco-landing__section-inner seco-reveal seco-reveal--1">
          <header className="dd-profile__head">
            <h1 className="seco-page__title dd-profile__title">
              <span className="seco-landing__hero-spectrum">Profile</span>
            </h1>
            {accountGear}
          </header>
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
