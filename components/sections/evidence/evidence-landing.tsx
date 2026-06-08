import Link from 'next/link'

import { MarketingFontScope } from '@/components/sections/marketing/marketing-font-scope'
import {
  MarketingKawasakiFooter,
  MarketingKawasakiNav,
} from '@/components/sections/marketing/marketing-kawasaki-chrome'
import { MarketingKawasakiHtml } from '@/components/sections/marketing/marketing-kawasaki-html'
import { MarketingKawasakiSection } from '@/components/sections/marketing/marketing-kawasaki-section'
import {
  EVIDENCE_CLOSING_SLIDE,
  EVIDENCE_CTA_SECTION,
  EVIDENCE_CYCLE,
  EVIDENCE_STORY_SLIDES,
} from '@/lib/pitch/evidence-landing-content'

export function EvidenceLanding() {
  return (
    <MarketingFontScope>
      <MarketingKawasakiNav />

      {EVIDENCE_STORY_SLIDES.map((slide, index) => (
        <MarketingKawasakiSection
          key={slide.id}
          {...slide}
          headingLevel={index === 0 ? 'h1' : 'h2'}
        />
      ))}

      <section
        id={EVIDENCE_CYCLE.id}
        className="kz-s kz-s--dark"
        aria-labelledby={`${EVIDENCE_CYCLE.id}-heading`}
      >
        <div className="kz-s__content">
          <p className="kz-ey">{EVIDENCE_CYCLE.eyebrow}</p>
          <h2 id={`${EVIDENCE_CYCLE.id}-heading`} className="kz-h1">
            <MarketingKawasakiHtml html={EVIDENCE_CYCLE.headlineHtml} />
          </h2>
          <p className="kz-sup">{EVIDENCE_CYCLE.support}</p>
          <div className="kz-metrics">
            {EVIDENCE_CYCLE.metrics.map((metric) => (
              <div key={metric.label} className="kz-metrics__item">
                <p className="kz-metrics__label">{metric.label}</p>
                <p className="kz-metrics__value kz-tabular">{metric.value}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="kz-num">{EVIDENCE_CYCLE.slideNum}</div>
      </section>

      <MarketingKawasakiSection {...EVIDENCE_CLOSING_SLIDE} />

      <section
        id={EVIDENCE_CTA_SECTION.id}
        className="kz-s"
        aria-labelledby={`${EVIDENCE_CTA_SECTION.id}-heading`}
      >
        <div className="kz-s__content">
          <p className="kz-ey">{EVIDENCE_CTA_SECTION.eyebrow}</p>
          <h2 id={`${EVIDENCE_CTA_SECTION.id}-heading`} className="kz-h1">
            <MarketingKawasakiHtml html={EVIDENCE_CTA_SECTION.headlineHtml} />
          </h2>
          <p className="kz-sup">{EVIDENCE_CTA_SECTION.support}</p>
          <div className="kz-cta-stack">
            <Link href={EVIDENCE_CTA_SECTION.ctas.primary.href} className="kz-cta-btn kz-cta-stack__btn">
              {EVIDENCE_CTA_SECTION.ctas.primary.label}
            </Link>
            <Link href={EVIDENCE_CTA_SECTION.ctas.secondary.href} className="kz-cta-btn kz-cta-stack__btn">
              {EVIDENCE_CTA_SECTION.ctas.secondary.label}
            </Link>
            <Link href={EVIDENCE_CTA_SECTION.ctas.tertiary.href} className="kz-cta-btn kz-cta-stack__btn">
              {EVIDENCE_CTA_SECTION.ctas.tertiary.label}
            </Link>
          </div>
        </div>
        <div className="kz-num">{EVIDENCE_CTA_SECTION.slideNum}</div>
      </section>

      <MarketingKawasakiFooter />
    </MarketingFontScope>
  )
}
