import type { CSSProperties } from 'react'
import Link from 'next/link'

import { ChronobiobankTileIcon } from '@/components/deepdose/ChronobiobankTileIcon'
import { ClinicianPortalTileIcon } from '@/components/deepdose/ClinicianPortalTileIcon'
import { SpectrumTile, SpectrumTileGrid } from '@/components/deepdose/SpectrumTile'
import {
  TECHNOLOGY_AI,
  TECHNOLOGY_BOUNDARY,
  TECHNOLOGY_CMO_FLOW,
  TECHNOLOGY_CTA,
  TECHNOLOGY_DEEP_DIVES,
  TECHNOLOGY_DILIGENCE,
  TECHNOLOGY_HERO,
  TECHNOLOGY_HUB_INTRO,
  TECHNOLOGY_OUTPUTS,
  TECHNOLOGY_STACK,
  TECHNOLOGY_VALIDATION,
} from '@/lib/deepdose-marketing/technology-content'
import { marketingCtaClass, marketingTilesClass } from '@/lib/design/marketing-system'

const STACK_ICONS = {
  ingest: 'device',
  phase: 'sleep',
  compute: 'outcomes',
  govern: 'governance',
} as const

const CMO_ICONS = ['triage', 'tiptraq', 'timing', 'invite'] as const

export function TechnologyHubPage() {
  return (
    <article className="seco-page seco-technology">
      <div className="seco-landing__section-inner">
        <header className="seco-technology__intro seco-reveal seco-reveal--1">
          <p className="seco-page__eyebrow">{TECHNOLOGY_HUB_INTRO.eyebrow}</p>
          <h1 className="seco-page__title seco-technology__title">
            <span className="seco-landing__hero-line seco-landing__hero-line--white">
              {TECHNOLOGY_HUB_INTRO.titleWhite}
            </span>
            <span className="seco-landing__hero-line seco-landing__hero-spectrum">
              {TECHNOLOGY_HUB_INTRO.titleAccent}
            </span>
          </h1>
          <p className="seco-page__lede seco-technology__lede">{TECHNOLOGY_HUB_INTRO.lede}</p>
        </header>

        <SpectrumTile
          cue={TECHNOLOGY_HERO.cue}
          variant="hero"
          className="seco-technology__hero-tile seco-reveal seco-reveal--2"
          label={TECHNOLOGY_HERO.label}
          title={TECHNOLOGY_HERO.title}
          body={TECHNOLOGY_HERO.body}
          titleTag="h2"
          titleVariant="display"
          icon={<ChronobiobankTileIcon id="federated" />}
        />

        <section className="seco-technology__section seco-reveal seco-reveal--3" aria-labelledby="tech-stack-title">
          <div className="seco-technology__section-head">
            <p className="seco-page__eyebrow">{TECHNOLOGY_STACK.eyebrow}</p>
            <h2 id="tech-stack-title" className="seco-technology__h2">
              {TECHNOLOGY_STACK.title}
            </h2>
            <p className="seco-technology__support">{TECHNOLOGY_STACK.support}</p>
          </div>
          <SpectrumTileGrid as="ul" cols={2} sm2 className={marketingTilesClass('seco-technology__grid')}>
            {TECHNOLOGY_STACK.layers.map((layer) => (
              <SpectrumTile
                key={layer.id}
                as="li"
                cue={layer.cue}
                label={layer.label}
                title={layer.title}
                body={layer.body}
                titleTag="h3"
                icon={
                  <ChronobiobankTileIcon
                    id={STACK_ICONS[layer.id as keyof typeof STACK_ICONS]}
                  />
                }
              />
            ))}
          </SpectrumTileGrid>
        </section>

        <section className="seco-technology__section seco-reveal seco-reveal--4" aria-labelledby="tech-validation-title">
          <div className="seco-technology__section-head">
            <p className="seco-page__eyebrow">{TECHNOLOGY_VALIDATION.eyebrow}</p>
            <h2 id="tech-validation-title" className="seco-technology__h2">
              {TECHNOLOGY_VALIDATION.title}
            </h2>
            <p className="seco-technology__support">{TECHNOLOGY_VALIDATION.support}</p>
          </div>
          <SpectrumTileGrid as="ol" cols={3} className={marketingTilesClass('seco-technology__grid seco-technology__grid--tiers')}>
            {TECHNOLOGY_VALIDATION.tiers.map((tier) => (
              <SpectrumTile
                key={tier.id}
                as="li"
                cue={tier.cue}
                label={tier.badge}
                title={tier.title}
                body={
                  <>
                    <p>{tier.body}</p>
                    {'href' in tier && tier.href ? (
                      <Link href={tier.href} className="seco-technology__tile-link">
                        {tier.linkLabel} →
                      </Link>
                    ) : null}
                  </>
                }
                rank={tier.rank}
                titleVariant="display"
                titleTag="h3"
              />
            ))}
          </SpectrumTileGrid>
        </section>

        <section className="seco-technology__section seco-reveal seco-reveal--5" aria-labelledby="tech-boundary-title">
          <div className="seco-technology__section-head">
            <p className="seco-page__eyebrow">{TECHNOLOGY_BOUNDARY.eyebrow}</p>
            <h2 id="tech-boundary-title" className="seco-technology__h2">
              {TECHNOLOGY_BOUNDARY.title}
            </h2>
          </div>
          <SpectrumTileGrid cols={2} className={marketingTilesClass('seco-technology__contrast')}>
            {TECHNOLOGY_BOUNDARY.contrasts.map((item) => (
              <SpectrumTile
                key={item.id}
                cue={item.cue}
                variant={item.variant}
                label={item.label}
                title={item.title}
                body={item.body}
                titleTag="h3"
                icon={
                  <ChronobiobankTileIcon id={item.id === 'support' ? 'consent-care' : 'shield'} />
                }
              />
            ))}
          </SpectrumTileGrid>
        </section>

        <section className="seco-technology__section seco-reveal seco-reveal--6" aria-labelledby="tech-ai-title">
          <div className="seco-technology__section-head">
            <p className="seco-page__eyebrow">{TECHNOLOGY_AI.eyebrow}</p>
            <h2 id="tech-ai-title" className="seco-technology__h2">
              {TECHNOLOGY_AI.title}
            </h2>
          </div>
          <SpectrumTileGrid cols={2} className={marketingTilesClass('seco-technology__contrast')}>
            {TECHNOLOGY_AI.contrasts.map((item) => (
              <SpectrumTile
                key={item.id}
                cue={item.cue}
                variant={item.variant}
                label={item.label}
                title={item.title}
                body={item.body}
                titleTag="h3"
                icon={
                  <ChronobiobankTileIcon
                    id={item.id === 'rules' ? 'weights' : 'learning'}
                  />
                }
              />
            ))}
          </SpectrumTileGrid>
        </section>

        <section className="seco-technology__section seco-reveal seco-reveal--7" aria-labelledby="tech-cmo-title">
          <div className="seco-technology__section-head">
            <p className="seco-page__eyebrow">{TECHNOLOGY_CMO_FLOW.eyebrow}</p>
            <h2 id="tech-cmo-title" className="seco-technology__h2">
              {TECHNOLOGY_CMO_FLOW.title}
            </h2>
            <p className="seco-technology__support">{TECHNOLOGY_CMO_FLOW.support}</p>
          </div>
          <SpectrumTileGrid as="ol" cols={2} sm2 className={marketingTilesClass('seco-technology__grid')}>
            {TECHNOLOGY_CMO_FLOW.steps.map((step, index) => (
              <SpectrumTile
                key={step.title}
                as="li"
                cue={step.cue}
                label={step.label}
                title={step.title}
                body={step.body}
                rank={index + 1}
                titleVariant="display"
                titleTag="h3"
                icon={<ClinicianPortalTileIcon id={CMO_ICONS[index]} />}
              />
            ))}
          </SpectrumTileGrid>
        </section>

        <section className="seco-technology__section seco-reveal seco-reveal--8" aria-labelledby="tech-outputs-title">
          <div className="seco-technology__section-head">
            <p className="seco-page__eyebrow">{TECHNOLOGY_OUTPUTS.eyebrow}</p>
            <h2 id="tech-outputs-title" className="seco-technology__h2">
              {TECHNOLOGY_OUTPUTS.title}
            </h2>
            <p className="seco-technology__support">{TECHNOLOGY_OUTPUTS.support}</p>
          </div>
          <SpectrumTileGrid as="ul" cols={2} sm2 className={marketingTilesClass('seco-technology__grid')}>
            {TECHNOLOGY_OUTPUTS.metrics.map((metric) => (
              <SpectrumTile
                key={metric.id}
                as="li"
                cue={metric.cue}
                label={metric.label}
                title={metric.title}
                body={metric.body}
                titleTag="h3"
                className="seco-spectrum-tile--compact"
              />
            ))}
          </SpectrumTileGrid>
        </section>

        <section className="seco-technology__section seco-reveal seco-reveal--9" aria-labelledby="tech-diligence-title">
          <div className="seco-technology__section-head">
            <p className="seco-page__eyebrow">{TECHNOLOGY_DILIGENCE.eyebrow}</p>
            <h2 id="tech-diligence-title" className="seco-technology__h2">
              {TECHNOLOGY_DILIGENCE.title}
            </h2>
          </div>
          <ul className="seco-technology__diligence">
            {TECHNOLOGY_DILIGENCE.items.map((item) => (
              <li key={item.id} className="seco-technology__diligence-item seco-app-card">
                <span className="seco-technology__diligence-stat">{item.stat}</span>
                <p className="seco-technology__diligence-label">{item.label}</p>
              </li>
            ))}
          </ul>
        </section>

        <section className="seco-technology__section seco-reveal seco-reveal--10" aria-labelledby="tech-deep-title">
          <div className="seco-technology__section-head">
            <p className="seco-page__eyebrow">{TECHNOLOGY_DEEP_DIVES.eyebrow}</p>
            <h2 id="tech-deep-title" className="seco-technology__h2">
              {TECHNOLOGY_DEEP_DIVES.title}
            </h2>
          </div>
          <ul className="seco-technology__deep-dives">
            {TECHNOLOGY_DEEP_DIVES.topics.map((topic) => (
              <li key={topic.id}>
                <Link
                  href={topic.href}
                  className="seco-technology__deep-dive seco-app-card"
                  style={{ '--cue': topic.cue } as CSSProperties}
                >
                  <div className="seco-technology__deep-dive-head">
                    <span className="seco-technology__deep-dive-badge">{topic.badge}</span>
                    <span className="seco-technology__deep-dive-audience">{topic.audience}</span>
                  </div>
                  <h3 className="seco-technology__deep-dive-title">{topic.title}</h3>
                  <p className="seco-technology__deep-dive-teaser">{topic.teaser}</p>
                  <span className="seco-technology__deep-dive-link">Read →</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section className="seco-technology__close seco-reveal seco-reveal--11">
          <SpectrumTile
            cue="#8b9cf8"
            variant="hero"
            label="Next step"
            title={TECHNOLOGY_CTA.headline}
            body={TECHNOLOGY_CTA.support}
            titleTag="h2"
            foot={
              <div className={marketingCtaClass('seco-marketing-cta--row seco-technology__cta-actions')}>
                <Link href={TECHNOLOGY_CTA.primary.href} className="seco-landing__btn seco-landing__btn--primary">
                  {TECHNOLOGY_CTA.primary.label} →
                </Link>
                <Link href={TECHNOLOGY_CTA.secondary.href} className="seco-landing__btn seco-landing__btn--ghost">
                  {TECHNOLOGY_CTA.secondary.label}
                </Link>
              </div>
            }
          />
        </section>
      </div>
    </article>
  )
}
