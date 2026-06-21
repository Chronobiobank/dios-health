'use client'

import { CHI_ABBREV } from '@/lib/circadian/chi'
import type { ClockWindow } from '@/components/shared/CircadianClock'
import ScoreGauge from '@/components/shared/ScoreGauge'
import CircadianClock from '@/components/shared/CircadianClock'
import { ProfileCollapsibleRow } from '@/components/patient/ProfileCollapsibleRow'

type ScoreComponents = NonNullable<Parameters<typeof ScoreGauge>[0]['components']>

export function ClinicalCircadianPanel({
  circadianScore,
  chronotypeLabel,
  scoreComponents,
  dlmoTime,
  clockWindows,
}: {
  circadianScore: number
  chronotypeLabel?: string
  scoreComponents?: ScoreComponents
  dlmoTime: string
  clockWindows: ClockWindow[]
}) {
  if (circadianScore <= 0) {
    return (
      <section
        className="dash-meds__tile seco-app-card p-5 md:p-6"
        aria-labelledby="clinical-circadian-empty-title"
      >
        <div className="dash-meds__section-head">
          <h2 id="clinical-circadian-empty-title" className="dash-meds__section-title">
            Circadian profile
          </h2>
        </div>
        <p className="dash-meds__empty-copy">
          Not enough rhythm data yet. Patient needs MCTQ or wearable sync.
        </p>
      </section>
    )
  }

  const chiMeta = chronotypeLabel
    ? `${CHI_ABBREV} ${circadianScore} · ${chronotypeLabel}`
    : `${CHI_ABBREV} ${circadianScore}`

  return (
    <div className="dash-meds__form">
      <section
        className="dash-meds__tile seco-app-card p-5 md:p-6"
        aria-labelledby="clinical-chi-title"
      >
        <div className="dash-meds__section-head">
          <h2 id="clinical-chi-title" className="dash-meds__section-title">
            {CHI_ABBREV} alignment
          </h2>
        </div>

        <ul className="dash-meds__list">
          <ProfileCollapsibleRow id="chi-score" label="Alignment score" meta={chiMeta}>
            <ScoreGauge
              score={circadianScore}
              chronotypeLabel={chronotypeLabel}
              components={scoreComponents}
            />
          </ProfileCollapsibleRow>
        </ul>
      </section>

      <section
        className="dash-meds__tile seco-app-card p-5 md:p-6"
        aria-labelledby="clinical-clock-title"
      >
        <div className="dash-meds__section-head">
          <h2 id="clinical-clock-title" className="dash-meds__section-title">
            Dosing windows
          </h2>
        </div>

        <ul className="dash-meds__list">
          <ProfileCollapsibleRow
            id="circadian-clock"
            label="24-hour rhythm"
            meta={`DLMO ${dlmoTime}`}
          >
            <CircadianClock
              dlmoTime={dlmoTime}
              windows={clockWindows}
              chronotypeLabel={chronotypeLabel}
            />
          </ProfileCollapsibleRow>
        </ul>
      </section>
    </div>
  )
}
