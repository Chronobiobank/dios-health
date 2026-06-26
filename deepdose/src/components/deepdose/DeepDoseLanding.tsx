import Link from 'next/link'

import { PatientTimingPlan } from '@/components/deepdose/PatientTimingPlan'
import { LandingHeroIntro } from '@/components/deepdose/LandingHeroIntro'
import {
  DEEPDOSE_LANDING_CLOSE,
  DEEPDOSE_LANDING_HERO,
  DEEPDOSE_PATIENT_PLAN_HERO,
  patientPlanHeroSupport,
} from '@/lib/deepdose-marketing/landing-content'

type MedContext = {
  name: string
  time?: string | null
}

type PlanContext = {
  medCodes: string[]
  medNames: string[]
  medTimes?: string[]
  wake: string | null
  verdict: string
}

type DeepDoseLandingProps = {
  signupHref?: string
  medContext?: MedContext
  planContext?: PlanContext
}

export function DeepDoseLanding({
  signupHref = '/login',
  medContext,
  planContext,
}: DeepDoseLandingProps) {
  const closeCta = { ...DEEPDOSE_LANDING_CLOSE.cta, href: signupHref }

  if (planContext) {
    const hero = {
      ...DEEPDOSE_PATIENT_PLAN_HERO,
      support: patientPlanHeroSupport(planContext.medCodes.length, planContext.verdict),
    }
    return (
      <div className="seco-landing seco-landing--maven seco-landing--patient-plan">
        <section className="seco-landing__hero">
          <LandingHeroIntro hero={hero} />
          <div className="seco-landing__section-inner seco-reveal seco-reveal--3">
            <PatientTimingPlan
              variant="landing"
              autoStartOnboarding
              medCodes={planContext.medCodes}
              medTimes={planContext.medTimes}
              wake={planContext.wake}
              verdict={planContext.verdict}
              signupHref={signupHref}
            />
          </div>
        </section>
      </div>
    )
  }

  return (
    <div className="seco-landing seco-landing--maven">
      <section className="seco-landing__hero">
        <LandingHeroIntro hero={DEEPDOSE_LANDING_HERO} />
        <div className="seco-landing__section-inner seco-reveal seco-reveal--3">
          <div className="seco-landing__copy-stack">
            {medContext ? (
              <>
                <p className="seco-page__eyebrow">Your plan</p>
                <p className="seco-landing__support seco-landing__personalise">
                  You searched for <strong>{medContext.name}</strong>
                  {medContext.time ? (
                    <>
                      {' '}
                      at <strong>{medContext.time}</strong>
                    </>
                  ) : null}
                  .
                </p>
              </>
            ) : (
              <>
                <p className="seco-landing__support">
                  Enter your medications on the home page to see your timing plan.
                </p>
                <div className="seco-landing__actions">
                  <Link href="/" className="seco-landing__btn seco-landing__btn--primary">
                    Check my medications
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      </section>

      <section className="seco-landing__close-navy">
        <div className="seco-landing__section-inner">
          <div className="seco-landing__copy-stack seco-landing__close-stack">
            <h2 className="seco-landing__section-title">{DEEPDOSE_LANDING_CLOSE.headline}</h2>
            <p className="seco-landing__support">{DEEPDOSE_LANDING_CLOSE.support}</p>
            <div className="seco-landing__actions">
              <Link
                href={closeCta.href}
                className="seco-landing__btn seco-landing__btn--primary"
              >
                {closeCta.label}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
