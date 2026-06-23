import Link from 'next/link'

import { LandingHeroIntro } from '@/components/deepdose/LandingHeroIntro'
import { DeepDoseHeroTabs } from '@/components/deepdose/DeepDoseHeroTabs'
import { PatientDailyDosesSection } from '@/components/deepdose/PatientDailyDosesSection'
import {
  DEEPDOSE_LANDING_CLOSE,
  DEEPDOSE_LANDING_HERO,
} from '@/lib/deepdose-marketing/landing-content'

type MedContext = {
  name: string
  time?: string | null
}

type DeepDoseLandingProps = {
  signupHref?: string
  medContext?: MedContext
}

export function DeepDoseLanding({
  signupHref = '/login',
  medContext,
}: DeepDoseLandingProps) {
  const closeCta = { ...DEEPDOSE_LANDING_CLOSE.cta, href: signupHref }

  return (
    <div className="seco-landing seco-landing--maven">
      <section className="seco-landing__hero">
        <LandingHeroIntro hero={DEEPDOSE_LANDING_HERO} />
        <div className="seco-landing__section-inner seco-reveal seco-reveal--3">
          <DeepDoseHeroTabs />
        </div>
        <div className="seco-landing__section-inner seco-patient-landing__doses">
          <PatientDailyDosesSection signupHref={signupHref} />
        </div>
      </section>

      <section className="seco-landing__close-navy">
        <div className="seco-landing__section-inner">
          <div className="seco-landing__copy-stack seco-landing__close-stack">
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
                  . We&apos;ll build your personalised timing plan around it.
                </p>
              </>
            ) : (
              <>
                <h2 className="seco-landing__section-title">{DEEPDOSE_LANDING_CLOSE.headline}</h2>
                <p className="seco-landing__support">{DEEPDOSE_LANDING_CLOSE.support}</p>
              </>
            )}
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
