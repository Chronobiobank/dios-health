import Link from 'next/link'
import { LandingFooter, LandingNav } from '@/components/marketing/landing-chrome'
import { MarketingBlobShell } from '@/components/marketing/MarketingBlobShell'
import {
  LANDING_CLOSE,
  LANDING_HERO,
  LANDING_MECHANISM,
  LANDING_PRODUCT,
  LANDING_PROOF,
} from '@/lib/marketing/landing-content'

function LandingHtml({ html }: { html: string }) {
  return <span dangerouslySetInnerHTML={{ __html: html }} />
}

export function DiosLanding() {
  return (
    <MarketingBlobShell>
      <LandingNav />

      <section
        id={LANDING_HERO.id}
        className="clq-section clq-section--hero clq-section--hero-blobs"
      >
        <div className="clq-hero__scrim clq-hero__scrim--blobs" aria-hidden />
        <div className="clq-container clq-hero__content">
          <p className="clq-eyebrow">{LANDING_HERO.eyebrow}</p>
          <h1 className="clq-h1">
            <LandingHtml html={LANDING_HERO.headlineHtml} />
          </h1>
          <p className="clq-lead">{LANDING_HERO.support}</p>
          <Link href={LANDING_HERO.cta.href} className="clq-btn">
            {LANDING_HERO.cta.label}
          </Link>
        </div>
      </section>

      <section id={LANDING_MECHANISM.id} className="clq-section clq-section--dark">
        <div className="clq-container">
          <p className="clq-eyebrow">{LANDING_MECHANISM.eyebrow}</p>
          <h2 className="clq-h1">
            <LandingHtml html={LANDING_MECHANISM.headlineHtml} />
          </h2>
          <p className="clq-lead">{LANDING_MECHANISM.support}</p>
          <div className="clq-stats">
            {LANDING_MECHANISM.stats.map((stat) => (
              <div key={stat.label}>
                <p className="clq-stat__value">{stat.value}</p>
                <p className="clq-stat__label">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id={LANDING_PRODUCT.id} className="clq-section clq-section--dark">
        <div className="clq-container">
          <p className="clq-eyebrow">{LANDING_PRODUCT.eyebrow}</p>
          <h2 className="clq-h1">
            <LandingHtml html={LANDING_PRODUCT.headlineHtml} />
          </h2>
          <p className="clq-lead">{LANDING_PRODUCT.support}</p>
          <div className="clq-steps">
            {LANDING_PRODUCT.steps.map((step) => (
              <article key={step.title} className="clq-step">
                <p className="clq-step__symbol">{step.symbol}</p>
                <h3 className="clq-step__title">{step.title}</h3>
                <p className="clq-step__body">{step.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id={LANDING_PROOF.id} className="clq-section clq-section--dark">
        <div className="clq-container">
          <p className="clq-eyebrow">{LANDING_PROOF.eyebrow}</p>
          <h2 className="clq-h1">
            <LandingHtml html={LANDING_PROOF.headlineHtml} />
          </h2>
          <p className="clq-lead">{LANDING_PROOF.support}</p>

          <div className="clq-roi">
            <div className="clq-roi__controls">
              <p className="clq-roi__peak-ey">Peak evidence</p>
              <p className="clq-roi__peak-title">{LANDING_PROOF.peak.title}</p>
              <p className="clq-roi__peak-stat">{LANDING_PROOF.peak.stat}</p>
            </div>
            <div className="clq-roi__results">
              <p className="clq-roi__results-ey">Deepdose alignment</p>
              <p className="clq-roi__results-total">{LANDING_PROOF.results.total}</p>
              <p className="clq-roi__results-sub">{LANDING_PROOF.results.sub}</p>
              <div className="clq-roi__recovery">
                {LANDING_PROOF.recovery.map((row) => (
                  <div key={row.label}>
                    <p className="clq-roi__recovery-label">{row.label}</p>
                    <p className="clq-roi__recovery-value">{row.value}</p>
                  </div>
                ))}
              </div>
              <Link href={LANDING_PROOF.cta.href} className="clq-btn clq-roi__cta">
                {LANDING_PROOF.cta.label}
              </Link>
            </div>
          </div>

          <ul className="clq-citations">
            {LANDING_PROOF.citations.map((item) => (
              <li key={item.source}>
                <span className="clq-citations__source">{item.source}</span>
                <span className="clq-citations__quote">{item.quote}</span>
              </li>
            ))}
          </ul>
          <p className="clq-method">{LANDING_PROOF.methodology}</p>
        </div>
      </section>

      <section id={LANDING_CLOSE.id} className="clq-section clq-section--black">
        <div className="clq-container">
          <p className="clq-eyebrow">{LANDING_CLOSE.eyebrow}</p>
          <h2 className="clq-h1">
            <LandingHtml html={LANDING_CLOSE.headlineHtml} />
          </h2>
          <p className="clq-lead">{LANDING_CLOSE.support}</p>
          <ol className="clq-sectors">
            {LANDING_CLOSE.sectors.map((sector, index) => (
              <li key={sector.title}>
                <span className="clq-sectors__num">{String(index + 1).padStart(2, '0')}</span>
                <div>
                  <h3 className="clq-sectors__title">{sector.title}</h3>
                  <p className="clq-sectors__body">{sector.body}</p>
                </div>
              </li>
            ))}
          </ol>
          <dl className="clq-programme">
            {LANDING_CLOSE.programme.map((row) => (
              <div key={row.label} className="clq-programme__row">
                <dt>{row.label}</dt>
                <dd>{row.value}</dd>
              </div>
            ))}
          </dl>
          <Link href={LANDING_CLOSE.cta.href} className="clq-btn">
            {LANDING_CLOSE.cta.label}
          </Link>
        </div>
      </section>

      <LandingFooter />
    </MarketingBlobShell>
  )
}
