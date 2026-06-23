import Link from 'next/link'

import { SpectrumTile, SpectrumTileGrid } from '@/components/deepdose/SpectrumTile'
import { DoseIcon, DOSE_TIMING } from '@/components/chronobiology/DoseVisual'
import { ZEITGEBER_DOMAINS } from '@/lib/chronobiology/zeitgebers'

type PatientDailyDosesSectionProps = {
  signupHref?: string
}

export function PatientDailyDosesSection({ signupHref = '/login' }: PatientDailyDosesSectionProps) {
  return (
    <div className="seco-patient-doses">
      <section className="seco-about__section seco-reveal seco-reveal--4" aria-labelledby="patient-doses-title">
        <h2 id="patient-doses-title" className="seco-about__h2">
          Your daily doses
        </h2>
        <SpectrumTileGrid as="ul" cols={3} className="seco-about__list">
          {ZEITGEBER_DOMAINS.map((domain) => {
            const timing = DOSE_TIMING[domain.id]
            return (
              <SpectrumTile
                key={domain.id}
                as="li"
                cue={timing.color}
                label={domain.cue}
                title={domain.label}
                body={domain.description}
                titleTag="h3"
                icon={<DoseIcon id={domain.id} />}
                foot={
                  <div className="seco-about__timing">
                    <span className="seco-about__track" aria-hidden="true">
                      <span className="seco-about__marker" style={{ left: `${timing.pct}%` }} />
                    </span>
                    <span className="seco-about__time-label">{timing.label}</span>
                  </div>
                }
              />
            )
          })}
        </SpectrumTileGrid>
      </section>

      <section className="seco-about__section seco-reveal seco-reveal--5" aria-labelledby="patient-dashboard-title">
        <h2 id="patient-dashboard-title" className="seco-about__h2">
          One simple dashboard
        </h2>
        <p className="seco-about__intro">
          A home sleep test, your wearable, and a short sleep-timing quiz feed one dashboard. You
          see what to do next. Your clinician sees your nights, any drift, and when to step in.
          You choose what data we can use, and you can change your mind at any time.
        </p>
        <div className="seco-about__actions">
          <Link href={signupHref} className="seco-landing__btn seco-landing__btn--primary">
            Start free →
          </Link>
        </div>
      </section>
    </div>
  )
}
