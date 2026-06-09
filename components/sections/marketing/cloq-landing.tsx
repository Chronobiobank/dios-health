import Link from 'next/link'

import { CloqLandingHeroMedia } from '@/components/sections/marketing/cloq-landing-hero-media'
import { CloqLandingFooter, CloqLandingNav } from '@/components/sections/marketing/cloq-landing-chrome'
import {
  CorporateProofEvidence,
  CorporateRoiControls,
  CorporateRoiProvider,
  CorporateRoiResults,
} from '@/components/sections/marketing/corporate-roi-calculator'
import { unbounded } from '@/lib/fonts/marketing-fonts'
import {
  CORPORATE_CLOSE,
  CORPORATE_HERO,
  CORPORATE_MECHANISM,
  CORPORATE_PRODUCT,
  CORPORATE_PROOF,
} from '@/lib/pitch/corporate-landing-content'

function CloqHtml({ html }: { html: string }) {
  return <span dangerouslySetInnerHTML={{ __html: html }} />
}

export function CloqLanding() {
  return (
    <div className={`clq-site ${unbounded.variable}`}>
      <CloqLandingNav />

      <section id={CORPORATE_HERO.id} className="clq-section clq-section--hero">
        {CORPORATE_HERO.media ? <CloqLandingHeroMedia media={CORPORATE_HERO.media} /> : null}
        <div className="clq-container clq-hero__content">
          <p className="clq-eyebrow">{CORPORATE_HERO.eyebrow}</p>
          <h1 className="clq-h1">
            <CloqHtml html={CORPORATE_HERO.headlineHtml} />
          </h1>
          <p className="clq-lead">{CORPORATE_HERO.support}</p>
          <Link href={CORPORATE_HERO.cta.href} className="clq-btn">
            {CORPORATE_HERO.cta.label}
          </Link>
        </div>
      </section>

      <section id={CORPORATE_MECHANISM.id} className="clq-section clq-section--dark">
        <div className="clq-container">
          <p className="clq-eyebrow">{CORPORATE_MECHANISM.eyebrow}</p>
          <h2 className="clq-h1">
            <CloqHtml html={CORPORATE_MECHANISM.headlineHtml} />
          </h2>
          <p className="clq-lead">{CORPORATE_MECHANISM.support}</p>
          <div className="clq-stats">
            {CORPORATE_MECHANISM.stats.map((stat) => (
              <div key={stat.label}>
                <p className="clq-stat__value">{stat.value}</p>
                <p className="clq-stat__label">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id={CORPORATE_PRODUCT.id} className="clq-section clq-section--dark">
        <div className="clq-container">
          <p className="clq-eyebrow">{CORPORATE_PRODUCT.eyebrow}</p>
          <h2 className="clq-h1">
            <CloqHtml html={CORPORATE_PRODUCT.headlineHtml} />
          </h2>
          <p className="clq-lead">{CORPORATE_PRODUCT.support}</p>
          <div className="clq-steps">
            {CORPORATE_PRODUCT.steps.map((step) => (
              <article key={step.title} className="clq-step">
                <p className="clq-step__symbol">{step.symbol}</p>
                <h3 className="clq-step__title">{step.title}</h3>
                <p className="clq-step__body">{step.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <CorporateRoiProvider>
        <section id={CORPORATE_PROOF.id} className="clq-section clq-section--dark">
          <div className="clq-container">
            <p className="clq-eyebrow">{CORPORATE_PROOF.eyebrow}</p>
            <h2 className="clq-h1">
              <CloqHtml html={CORPORATE_PROOF.headlineHtml} />
            </h2>
            <p className="clq-lead">{CORPORATE_PROOF.support}</p>
            <div className="clq-roi">
              <CorporateRoiControls />
              <CorporateRoiResults />
            </div>
            <CorporateProofEvidence />
          </div>
        </section>
      </CorporateRoiProvider>

      <section id={CORPORATE_CLOSE.id} className="clq-section clq-section--black">
        <div className="clq-container">
          <p className="clq-eyebrow">{CORPORATE_CLOSE.eyebrow}</p>
          <h2 className="clq-h1">
            <CloqHtml html={CORPORATE_CLOSE.headlineHtml} />
          </h2>
          <p className="clq-lead">{CORPORATE_CLOSE.support}</p>
          <ol className="clq-sectors">
            {CORPORATE_CLOSE.sectors.map((sector, index) => (
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
            {CORPORATE_CLOSE.programme.map((row) => (
              <div key={row.label} className="clq-programme__row">
                <dt>{row.label}</dt>
                <dd>{row.value}</dd>
              </div>
            ))}
          </dl>
          <Link href={CORPORATE_CLOSE.cta.href} className="clq-btn">
            {CORPORATE_CLOSE.cta.label}
          </Link>
        </div>
      </section>

      <CloqLandingFooter />
    </div>
  )
}
