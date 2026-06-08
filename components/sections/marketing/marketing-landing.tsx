import Link from 'next/link'
import type { ReactNode } from 'react'

import {
  CorporateRoiControls,
  CorporateRoiProvider,
  CorporateRoiResults,
} from '@/components/sections/marketing/corporate-roi-calculator'
import { MarketingFontScope } from '@/components/sections/marketing/marketing-font-scope'
import {
  MarketingKawasakiFooter,
  MarketingKawasakiNav,
} from '@/components/sections/marketing/marketing-kawasaki-chrome'
import { MarketingKawasakiHtml } from '@/components/sections/marketing/marketing-kawasaki-html'
import { MarketingKawasakiProgress } from '@/components/sections/marketing/marketing-kawasaki-progress'
import { MarketingSlideBackground } from '@/components/sections/marketing/marketing-slide-background'
import {
  CORPORATE_BUYER,
  CORPORATE_CLOSING,
  CORPORATE_EVIDENCE,
  CORPORATE_HERO,
  CORPORATE_PROBLEM,
  CORPORATE_PROBLEM_PILLARS,
  CORPORATE_PRODUCT,
  CORPORATE_ROI,
  CORPORATE_SECTION_IDS,
  CORPORATE_STATS,
} from '@/lib/pitch/corporate-landing-content'

function SnapSection({
  id,
  slideNum,
  className = '',
  children,
}: {
  id: string
  slideNum: string
  className?: string
  children: ReactNode
}) {
  return (
    <section id={id} className={`kz-s kz-s--snap ${className}`.trim()} aria-labelledby={`${id}-heading`}>
      {children}
      <div className="kz-num">{slideNum}</div>
    </section>
  )
}

export function MarketingLanding() {
  return (
    <MarketingFontScope className="marketing-v2-root--corporate">
      <MarketingKawasakiNav />
      <MarketingKawasakiProgress sectionIds={CORPORATE_SECTION_IDS} />

      <SnapSection id={CORPORATE_HERO.id} slideNum={CORPORATE_HERO.slideNum} className="kz-s--has-media kz-s--under-nav">
        {CORPORATE_HERO.media ? <MarketingSlideBackground media={CORPORATE_HERO.media} /> : null}
        <div className="kz-s__content">
          <p className="kz-ey">{CORPORATE_HERO.eyebrow}</p>
          <h1 id={`${CORPORATE_HERO.id}-heading`} className="kz-h1">
            <MarketingKawasakiHtml html={CORPORATE_HERO.headlineHtml} />
          </h1>
          <p className="kz-sup">{CORPORATE_HERO.support}</p>
          <div className="kz-cta-stack kz-cta-stack--row">
            <Link href={CORPORATE_HERO.ctas.primary.href} className="kz-btn-p">
              {CORPORATE_HERO.ctas.primary.label}
            </Link>
            <Link href={CORPORATE_HERO.ctas.secondary.href} className="kz-btn-s">
              {CORPORATE_HERO.ctas.secondary.label}
            </Link>
          </div>
        </div>
      </SnapSection>

      <SnapSection id={CORPORATE_STATS.id} slideNum={CORPORATE_STATS.slideNum} className="kz-s--dark">
        <div className="kz-s__content kz-s__content--wide">
          <p className="kz-ey">{CORPORATE_STATS.eyebrow}</p>
          <h2 id={`${CORPORATE_STATS.id}-heading`} className="kz-h1">
            <MarketingKawasakiHtml html={CORPORATE_STATS.headlineHtml} />
          </h2>
          <p className="kz-sup">{CORPORATE_STATS.support}</p>
          <div className="kz-stat-band">
            {CORPORATE_STATS.stats.map((stat) => (
              <div key={stat.label} className="kz-stat-band__item">
                <p className="kz-stat-band__value kz-tabular">{stat.value}</p>
                <p className="kz-stat-band__label">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </SnapSection>

      <SnapSection id={CORPORATE_PROBLEM.id} slideNum={CORPORATE_PROBLEM.slideNum}>
        <div className="kz-s__content">
          <p className="kz-ey">{CORPORATE_PROBLEM.eyebrow}</p>
          <h2 id={`${CORPORATE_PROBLEM.id}-heading`} className="kz-h1">
            <MarketingKawasakiHtml html={CORPORATE_PROBLEM.headlineHtml} />
          </h2>
          <p className="kz-sup">{CORPORATE_PROBLEM.support}</p>
        </div>
      </SnapSection>

      {CORPORATE_PROBLEM_PILLARS.map((pillar) => (
        <SnapSection key={pillar.id} id={pillar.id} slideNum={pillar.slideNum} className="kz-s--dark">
          <div className="kz-s__content">
            <p className="kz-ey">{pillar.eyebrow}</p>
            <h2 id={`${pillar.id}-heading`} className="kz-h1">
              <MarketingKawasakiHtml html={pillar.headlineHtml} />
            </h2>
            <p className="kz-sup">{pillar.support}</p>
            <p className="kz-pillar-metric kz-tabular">{pillar.metric}</p>
            <p className="kz-pillar-metric-note">{pillar.metricNote}</p>
          </div>
        </SnapSection>
      ))}

      <SnapSection id={CORPORATE_PRODUCT.id} slideNum={CORPORATE_PRODUCT.slideNum} className="kz-s--dark">
        <div className="kz-s__content kz-s__content--wide">
          <p className="kz-ey">{CORPORATE_PRODUCT.eyebrow}</p>
          <h2 id={`${CORPORATE_PRODUCT.id}-heading`} className="kz-h1">
            <MarketingKawasakiHtml html={CORPORATE_PRODUCT.headlineHtml} />
          </h2>
          <p className="kz-sup">{CORPORATE_PRODUCT.support}</p>
          <div className="kz-step-strip">
            {CORPORATE_PRODUCT.steps.map((step) => (
              <article key={step.title} className="kz-step-strip__item">
                <p className="kz-step-strip__symbol">{step.symbol}</p>
                <h3 className="kz-step-strip__title">{step.title}</h3>
                <p className="kz-step-strip__body">{step.body}</p>
              </article>
            ))}
          </div>
        </div>
      </SnapSection>

      <SnapSection id={CORPORATE_BUYER.id} slideNum={CORPORATE_BUYER.slideNum}>
        <div className="kz-s__content kz-s__content--wide">
          <p className="kz-ey">{CORPORATE_BUYER.eyebrow}</p>
          <h2 id={`${CORPORATE_BUYER.id}-heading`} className="kz-h1">
            <MarketingKawasakiHtml html={CORPORATE_BUYER.headlineHtml} />
          </h2>
          <p className="kz-sup">{CORPORATE_BUYER.support}</p>
          <ol className="kz-sector-list kz-sector-list--compact">
            {CORPORATE_BUYER.sectors.map((sector) => (
              <li key={sector.num} className="kz-sector-list__item">
                <span className="kz-sector-list__num">{sector.num}</span>
                <div>
                  <h3 className="kz-sector-list__title">{sector.title}</h3>
                  <p className="kz-sector-list__body">{sector.body}</p>
                </div>
              </li>
            ))}
          </ol>
          <Link href={CORPORATE_BUYER.cta.href} className="kz-cta-btn kz-slide-link">
            {CORPORATE_BUYER.cta.label}
          </Link>
        </div>
      </SnapSection>

      <CorporateRoiProvider>
        <SnapSection id={CORPORATE_ROI.intro.id} slideNum={CORPORATE_ROI.intro.slideNum}>
          <div className="kz-s__content">
            <p className="kz-ey">{CORPORATE_ROI.intro.eyebrow}</p>
            <h2 id={`${CORPORATE_ROI.intro.id}-heading`} className="kz-h1">
              <MarketingKawasakiHtml html={CORPORATE_ROI.intro.headlineHtml} />
            </h2>
            <p className="kz-sup">{CORPORATE_ROI.intro.support}</p>
            <CorporateRoiControls />
          </div>
        </SnapSection>

        <SnapSection id="roi-result" slideNum="10" className="kz-s--dark kz-s--roi-result">
          <div className="kz-s__content">
            <p className="kz-ey">Your estimate</p>
            <CorporateRoiResults />
          </div>
        </SnapSection>
      </CorporateRoiProvider>

      <SnapSection id={CORPORATE_EVIDENCE.id} slideNum={CORPORATE_EVIDENCE.slideNum} className="kz-s--dark">
        <div className="kz-s__content kz-s__content--wide">
          <p className="kz-ey">{CORPORATE_EVIDENCE.eyebrow}</p>
          <h2 id={`${CORPORATE_EVIDENCE.id}-heading`} className="kz-h1">
            <MarketingKawasakiHtml html={CORPORATE_EVIDENCE.headlineHtml} />
          </h2>
          <ul className="kz-evidence-list">
            {CORPORATE_EVIDENCE.citations.map((item) => (
              <li key={item.source}>
                <p className="kz-evidence-list__source">{item.source}</p>
                <p className="kz-evidence-list__quote">{item.quote}</p>
              </li>
            ))}
          </ul>
        </div>
      </SnapSection>

      <SnapSection id={CORPORATE_CLOSING.id} slideNum={CORPORATE_CLOSING.slideNum} className="kz-s--bronze">
        <div className="kz-s__content kz-s__content--wide">
          <p className="kz-ey">{CORPORATE_CLOSING.eyebrow}</p>
          <h2 id={`${CORPORATE_CLOSING.id}-heading`} className="kz-h1">
            <MarketingKawasakiHtml html={CORPORATE_CLOSING.headlineHtml} />
          </h2>
          <p className="kz-sup">{CORPORATE_CLOSING.support}</p>
          <dl className="kz-programme kz-programme--compact">
            {CORPORATE_CLOSING.programme.map((row) => (
              <div key={row.label} className="kz-programme__row">
                <dt>{row.label}</dt>
                <dd>{row.value}</dd>
              </div>
            ))}
          </dl>
          <div className="kz-cta-stack kz-cta-stack--row">
            <Link href={CORPORATE_CLOSING.ctas.primary.href} className="kz-btn-p">
              {CORPORATE_CLOSING.ctas.primary.label}
            </Link>
            <Link href={CORPORATE_CLOSING.ctas.secondary.href} className="kz-btn-s">
              {CORPORATE_CLOSING.ctas.secondary.label}
            </Link>
          </div>
        </div>
      </SnapSection>

      <MarketingKawasakiFooter />
    </MarketingFontScope>
  )
}
