import { SpectrumTile, SpectrumTileGrid } from '@/components/deepdose/SpectrumTile'
import { DoseIcon, DOSE_TIMING } from '@/components/chronobiology/DoseVisual'
import { ZEITGEBER_DOMAINS } from '@/lib/chronobiology/zeitgebers'

export function PatientDailyDosesSection() {
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
                titleVariant="display"
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
    </div>
  )
}
