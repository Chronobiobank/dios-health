import Link from 'next/link'

import { BODY_CLOCK_PRICING_COMPARE } from '@/lib/circadian/body-clock-measurement'

type BodyClockCompareStripProps = {
  clinicalFigure?: string
}

export function BodyClockCompareStrip({ clinicalFigure }: BodyClockCompareStripProps) {
  const { eyebrow, headline, support, estimate, clinical } = BODY_CLOCK_PRICING_COMPARE

  return (
    <section
      className="seco-body-clock-compare seco-reveal seco-reveal--2"
      aria-labelledby="body-clock-compare-title"
    >
      <header className="seco-body-clock-compare__head">
        <p className="seco-page__eyebrow">{eyebrow}</p>
        <h2 id="body-clock-compare-title" className="seco-body-clock-compare__title">
          {headline}
        </h2>
        <p className="seco-body-clock-compare__support">{support}</p>
      </header>

      <div className="seco-body-clock-compare__grid">
        <article className="seco-body-clock-compare__col">
          <p className="seco-body-clock-compare__col-badge seco-body-clock-compare__col-badge--free">
            {estimate.figure}
          </p>
          <h3 className="seco-body-clock-compare__col-title">{estimate.title}</h3>
          <ul className="seco-body-clock-compare__points">
            {estimate.points.map((point) => (
              <li key={point}>{point}</li>
            ))}
          </ul>
          <Link href={estimate.cta.href} className="seco-landing__btn seco-landing__btn--ghost">
            {estimate.cta.label}
          </Link>
        </article>

        <div className="seco-body-clock-compare__arrow" aria-hidden="true">
          <span className="seco-body-clock-compare__arrow-line" />
          <span className="seco-body-clock-compare__arrow-label">Upgrade</span>
        </div>

        <article className="seco-body-clock-compare__col seco-body-clock-compare__col--clinical">
          <p className="seco-body-clock-compare__col-badge seco-body-clock-compare__col-badge--clinical">
            {clinicalFigure ?? clinical.figure}
          </p>
          <h3 className="seco-body-clock-compare__col-title">{clinical.title}</h3>
          <ul className="seco-body-clock-compare__points">
            {clinical.points.map((point) => (
              <li key={point}>{point}</li>
            ))}
          </ul>
          <Link href={clinical.cta.href} className="seco-landing__btn seco-landing__btn--primary">
            {clinical.cta.label}
          </Link>
        </article>
      </div>
    </section>
  )
}
