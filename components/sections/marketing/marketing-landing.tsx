import Link from 'next/link'
import type { ReactNode } from 'react'

import {
  CorporateProofEvidence,
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
  CORPORATE_BRAND,
  CORPORATE_CLOSE,
  CORPORATE_FOOTER,
  CORPORATE_HERO,
  CORPORATE_MECHANISM,
  CORPORATE_NAV,
  CORPORATE_PRODUCT,
  CORPORATE_PROOF,
  CORPORATE_SECTION_IDS,
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
      <MarketingKawasakiNav config={CORPORATE_NAV} brand={CORPORATE_BRAND} />
      <MarketingKawasakiProgress sectionIds={CORPORATE_SECTION_IDS} />

      <SnapSection id={CORPORATE_HERO.id} slideNum={CORPORATE_HERO.slideNum} className="kz-s--has-media kz-s--under-nav">
        {CORPORATE_HERO.media ? <MarketingSlideBackground media={CORPORATE_HERO.media} /> : null}
        <div className="kz-s__content">
          <p className="kz-ey">{CORPORATE_HERO.eyebrow}</p>
          <h1 id={`${CORPORATE_HERO.id}-heading`} className="kz-h1">
            <MarketingKawasakiHtml html={CORPORATE_HERO.headlineHtml} />
          </h1>
          <p className="kz-sup">{CORPORATE_HERO.support}</p>
          <div className="kz-cta-stack">
            <Link href={CORPORATE_HERO.cta.href} className="kz-btn-p">
              {CORPORATE_HERO.cta.label}
            </Link>
          </div>
        </div>
      </SnapSection>

      <SnapSection id={CORPORATE_MECHANISM.id} slideNum={CORPORATE_MECHANISM.slideNum} className="kz-s--dark">
        <div className="kz-s__content kz-s__content--wide">
          <p className="kz-ey">{CORPORATE_MECHANISM.eyebrow}</p>
          <h2 id={`${CORPORATE_MECHANISM.id}-heading`} className="kz-h1">
            <MarketingKawasakiHtml html={CORPORATE_MECHANISM.headlineHtml} />
          </h2>
          <p className="kz-sup">{CORPORATE_MECHANISM.support}</p>
          <div className="kz-stat-band">
            {CORPORATE_MECHANISM.stats.map((stat) => (
              <div key={stat.label} className="kz-stat-band__item">
                <p className="kz-stat-band__value kz-tabular">{stat.value}</p>
                <p className="kz-stat-band__label">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </SnapSection>

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

      <CorporateRoiProvider>
        <SnapSection
          id={CORPORATE_PROOF.id}
          slideNum={CORPORATE_PROOF.slideNum}
          className="kz-s--dark kz-s--proof kz-s--flow"
        >
          <div className="kz-s__content kz-s__content--wide">
            <p className="kz-ey">{CORPORATE_PROOF.eyebrow}</p>
            <h2 id={`${CORPORATE_PROOF.id}-heading`} className="kz-h1 kz-h1--panel">
              <MarketingKawasakiHtml html={CORPORATE_PROOF.headlineHtml} />
            </h2>
            <p className="kz-sup kz-sup--tight">{CORPORATE_PROOF.support}</p>
            <div className="kz-proof__workspace">
              <CorporateRoiControls />
              <CorporateRoiResults />
            </div>
            <CorporateProofEvidence />
          </div>
        </SnapSection>
      </CorporateRoiProvider>

      <SnapSection id={CORPORATE_CLOSE.id} slideNum={CORPORATE_CLOSE.slideNum} className="kz-s--bronze kz-s--flow">
        <div className="kz-s__content kz-s__content--wide">
          <p className="kz-ey">{CORPORATE_CLOSE.eyebrow}</p>
          <h2 id={`${CORPORATE_CLOSE.id}-heading`} className="kz-h1">
            <MarketingKawasakiHtml html={CORPORATE_CLOSE.headlineHtml} />
          </h2>
          <p className="kz-sup">{CORPORATE_CLOSE.support}</p>
          <ol className="kz-sector-list kz-sector-list--compact kz-sector-list--close">
            {CORPORATE_CLOSE.sectors.map((sector, index) => (
              <li key={sector.title} className="kz-sector-list__item">
                <span className="kz-sector-list__num">{String(index + 1).padStart(2, '0')}</span>
                <div>
                  <h3 className="kz-sector-list__title">{sector.title}</h3>
                  <p className="kz-sector-list__body">{sector.body}</p>
                </div>
              </li>
            ))}
          </ol>
          <dl className="kz-programme kz-programme--compact">
            {CORPORATE_CLOSE.programme.map((row) => (
              <div key={row.label} className="kz-programme__row">
                <dt>{row.label}</dt>
                <dd>{row.value}</dd>
              </div>
            ))}
          </dl>
          <Link href={CORPORATE_CLOSE.cta.href} className="kz-btn-p kz-close-cta">
            {CORPORATE_CLOSE.cta.label}
          </Link>
        </div>
      </SnapSection>

      <MarketingKawasakiFooter config={CORPORATE_FOOTER} brand={CORPORATE_BRAND} />
    </MarketingFontScope>
  )
}
