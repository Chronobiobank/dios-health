import Link from 'next/link'

import { MarketingFontScope } from '@/components/sections/marketing/marketing-font-scope'
import {
  MARKETING_BEATS,
  MARKETING_CTA_BAND,
  MARKETING_FOR_SECTION,
  MARKETING_HERO,
  MARKETING_MODEL,
  MARKETING_PULL_QUOTE,
  MARKETING_THREE_QUESTIONS,
} from '@/lib/pitch/marketing-landing-content'

function HtmlText({ html }: { html: string }) {
  return <span dangerouslySetInnerHTML={{ __html: html }} />
}

export function MarketingLanding() {
  return (
    <MarketingFontScope>
      <div className="mkt-page">
        <section className="mkt-hero" aria-labelledby="marketing-hero-heading">
          <p className="mkt-hero-eyebrow">{MARKETING_HERO.eyebrow}</p>
          <h1 id="marketing-hero-heading">
            {MARKETING_HERO.titleLine1}
            <br />
            <em>{MARKETING_HERO.titleEmphasis}</em>
          </h1>
          <p className="mkt-hero-sub">{MARKETING_HERO.sub}</p>
          <div className="mkt-hero-ctas">
            <Link href={MARKETING_HERO.ctas.primary.href} className="mkt-btn-primary">
              {MARKETING_HERO.ctas.primary.label}
            </Link>
            <Link href={MARKETING_HERO.ctas.secondary.href} className="mkt-btn-secondary">
              {MARKETING_HERO.ctas.secondary.label}
            </Link>
            <Link href={MARKETING_HERO.ctas.tertiary.href} className="mkt-btn-tertiary">
              {MARKETING_HERO.ctas.tertiary.label}
            </Link>
          </div>
          <div className="mkt-hero-statement">
            {MARKETING_HERO.statements.map((item) => (
              <div key={item.num} className="mkt-hs-item">
                <div className="mkt-hs-num">{item.num}</div>
                <div className="mkt-hs-text">
                  <HtmlText html={item.html} />
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mkt-pull-quote" aria-label="Pull quote">
          <p className="mkt-pq-text">
            <HtmlText html={MARKETING_PULL_QUOTE.textHtml} />
          </p>
          <p className="mkt-pq-attr">{MARKETING_PULL_QUOTE.attr}</p>
        </section>

        <section className="mkt-beats" aria-label="Platform beats">
          {MARKETING_BEATS.map((beat) => (
            <article key={beat.num} className="mkt-beat">
              <div className="mkt-beat-num">{beat.num}</div>
              <div>
                <h2 className="mkt-beat-head">
                  <HtmlText html={beat.headHtml} />
                </h2>
                <p className="mkt-beat-text">
                  <HtmlText html={beat.textHtml} />
                </p>
              </div>
            </article>
          ))}
        </section>

        <section className="mkt-three-q" aria-labelledby="marketing-three-q-heading">
          <p id="marketing-three-q-heading" className="mkt-tq-eyebrow">
            {MARKETING_THREE_QUESTIONS.eyebrow}
          </p>
          <div className="mkt-tq-grid">
            {MARKETING_THREE_QUESTIONS.items.map((item) => (
              <div key={item.num} className="mkt-tq-item">
                <div className="mkt-tq-num">{item.num}</div>
                <p className="mkt-tq-q">
                  <HtmlText html={item.html} />
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="mkt-for-section" aria-labelledby="marketing-for-heading">
          <h2 id="marketing-for-heading" className="mkt-for-head">
            {MARKETING_FOR_SECTION.head}
          </h2>
          <div className="mkt-for-grid">
            {MARKETING_FOR_SECTION.cards.map((card) => (
              <article key={card.type} className="mkt-for-card">
                <p className="mkt-for-type">{card.type}</p>
                <h3 className="mkt-for-title">{card.title}</h3>
                <p className="mkt-for-text">{card.text}</p>
                <Link href={card.link.href} className="mkt-for-link">
                  {card.link.label}
                </Link>
              </article>
            ))}
          </div>
        </section>

        <section className="mkt-model" aria-labelledby="marketing-model-heading">
          <h2 id="marketing-model-heading" className="mkt-model-head">
            <HtmlText html={MARKETING_MODEL.headHtml} />
          </h2>
          <p className="mkt-model-sub">{MARKETING_MODEL.sub}</p>
          <div className="mkt-model-tiers">
            {MARKETING_MODEL.tiers.map((tier) => (
              <article key={tier.level} className={`mkt-tier mkt-tier--${tier.level}`}>
                <p className="mkt-tier-label">{tier.label}</p>
                <h3 className="mkt-tier-name">{tier.name}</h3>
                <p className="mkt-tier-desc">{tier.desc}</p>
                <p className="mkt-tier-conf">{tier.conf}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="mkt-cta-band" aria-labelledby="marketing-cta-heading">
          <h2 id="marketing-cta-heading" className="mkt-cta-head">
            <HtmlText html={MARKETING_CTA_BAND.headHtml} />
          </h2>
          <p className="mkt-cta-sub">{MARKETING_CTA_BAND.sub}</p>
          <div className="mkt-cta-buttons">
            <Link href={MARKETING_CTA_BAND.ctas.primary.href} className="mkt-btn-primary">
              {MARKETING_CTA_BAND.ctas.primary.label}
            </Link>
            <Link href={MARKETING_CTA_BAND.ctas.secondary.href} className="mkt-btn-secondary">
              {MARKETING_CTA_BAND.ctas.secondary.label}
            </Link>
          </div>
          <p className="mkt-cta-divider">{MARKETING_CTA_BAND.divider}</p>
        </section>
      </div>
    </MarketingFontScope>
  )
}
