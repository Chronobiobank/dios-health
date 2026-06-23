import Link from 'next/link'

import { ChronobiobankTileIcon } from '@/components/deepdose/ChronobiobankTileIcon'
import { SpectrumTile, SpectrumTileGrid } from '@/components/deepdose/SpectrumTile'
import {
  DLMO_PROXY_CLINICIAN_CTA,
  DLMO_PROXY_CONFIDENCE,
  DLMO_PROXY_CONTRAST,
  DLMO_PROXY_FUSION,
  DLMO_PROXY_LIMITS,
  DLMO_PROXY_PAGE_INTRO,
  DLMO_PROXY_REFERENCES,
  DLMO_PROXY_SIGNALS,
  DLMO_PROXY_TIERS,
} from '@/lib/deepdose-marketing/technology-content'
import { spectrumCue } from '@/lib/design/spectrum-cues'

export function DlmoProxyTechnologyPage() {
  return (
    <article className="seco-page seco-technology seco-technology--dlmo">
      <div className="seco-landing__section-inner">
        <header className="seco-technology__intro seco-reveal seco-reveal--1">
          <p className="seco-page__eyebrow">{DLMO_PROXY_PAGE_INTRO.eyebrow}</p>
          <h1 className="seco-page__title seco-technology__title">
            <span className="seco-landing__hero-line seco-landing__hero-line--white">
              {DLMO_PROXY_PAGE_INTRO.titleWhite}
            </span>
            <span className="seco-landing__hero-line seco-landing__hero-spectrum">
              {DLMO_PROXY_PAGE_INTRO.titleAccent}
            </span>
          </h1>
          <p className="seco-page__lede seco-technology__lede">{DLMO_PROXY_PAGE_INTRO.lede}</p>
          <p className="seco-technology__version">{DLMO_PROXY_PAGE_INTRO.versionLabel}</p>
        </header>

        <section className="seco-technology__section seco-reveal seco-reveal--2" aria-labelledby="dlmo-contrast-title">
          <div className="seco-technology__section-head">
            <p className="seco-page__eyebrow">{DLMO_PROXY_CONTRAST.eyebrow}</p>
            <h2 id="dlmo-contrast-title" className="seco-technology__h2">
              Reference standard vs free-tier proxy
            </h2>
          </div>
          <SpectrumTileGrid cols={2} className="seco-technology__contrast">
            {DLMO_PROXY_CONTRAST.contrasts.map((item) => (
              <SpectrumTile
                key={item.id}
                cue={item.cue}
                variant={item.variant}
                label={item.label}
                title={item.title}
                body={item.body}
                titleTag="h2"
                titleVariant="display"
                icon={<ChronobiobankTileIcon id={item.id === 'proxy' ? 'sleep' : 'query'} />}
              />
            ))}
          </SpectrumTileGrid>
        </section>

        <section className="seco-technology__section seco-reveal seco-reveal--3">
          <div className="seco-science-proxy">
            <p className="seco-science-proxy__title">{DLMO_PROXY_SIGNALS.headline}</p>
            <p className="seco-science-proxy__lede">{DLMO_PROXY_SIGNALS.lede}</p>
            <SpectrumTileGrid as="ul" cols={2} sm2 className="seco-science-proxy__signals">
              {DLMO_PROXY_SIGNALS.signals.map((signal, index) => (
                <SpectrumTile
                  key={signal.id}
                  as="li"
                  className="seco-spectrum-tile--compact"
                  cue={spectrumCue(index)}
                  label={signal.title}
                  title={signal.formula}
                  body={signal.body}
                  titleVariant="formula"
                  titleTag="p"
                />
              ))}
            </SpectrumTileGrid>
            <p className="seco-science-proxy__fusion">{DLMO_PROXY_SIGNALS.fusion}</p>
          </div>
        </section>

        <section className="seco-technology__section seco-reveal seco-reveal--4" aria-labelledby="dlmo-fusion-title">
          <div className="seco-technology__section-head">
            <p className="seco-page__eyebrow">{DLMO_PROXY_FUSION.eyebrow}</p>
            <h2 id="dlmo-fusion-title" className="seco-technology__h2">
              {DLMO_PROXY_FUSION.title}
            </h2>
            <p className="seco-technology__support">{DLMO_PROXY_FUSION.support}</p>
          </div>
          <SpectrumTileGrid as="ol" cols={2} sm2 className="seco-technology__grid">
            {DLMO_PROXY_FUSION.steps.map((step, index) => (
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
              />
            ))}
          </SpectrumTileGrid>
        </section>

        <section className="seco-technology__section seco-reveal seco-reveal--5" aria-labelledby="dlmo-confidence-title">
          <div className="seco-technology__section-head">
            <p className="seco-page__eyebrow">{DLMO_PROXY_CONFIDENCE.eyebrow}</p>
            <h2 id="dlmo-confidence-title" className="seco-technology__h2">
              {DLMO_PROXY_CONFIDENCE.title}
            </h2>
            <p className="seco-technology__support">{DLMO_PROXY_CONFIDENCE.support}</p>
          </div>
          <SpectrumTileGrid as="ul" cols={3} className="seco-technology__grid seco-technology__grid--bands">
            {DLMO_PROXY_CONFIDENCE.bands.map((band, index) => (
              <SpectrumTile
                key={band.label}
                as="li"
                cue={spectrumCue(index + 2)}
                label={band.label}
                title={band.range}
                body={band.threshold}
                titleVariant="display"
                titleTag="p"
                className="seco-spectrum-tile--stat"
              />
            ))}
          </SpectrumTileGrid>
          <ul className="seco-science-limits__list seco-technology__rules">
            {DLMO_PROXY_CONFIDENCE.rules.map((rule) => (
              <li key={rule}>{rule}</li>
            ))}
          </ul>
        </section>

        <section className="seco-technology__section seco-reveal seco-reveal--6" aria-labelledby="dlmo-tiers-title">
          <div className="seco-technology__section-head">
            <p className="seco-page__eyebrow">{DLMO_PROXY_TIERS.eyebrow}</p>
            <h2 id="dlmo-tiers-title" className="seco-technology__h2">
              {DLMO_PROXY_TIERS.title}
            </h2>
            <p className="seco-technology__support">{DLMO_PROXY_TIERS.lede}</p>
          </div>
          <SpectrumTileGrid as="ol" cols={3} className="seco-technology__grid seco-technology__grid--tiers">
            {DLMO_PROXY_TIERS.layers.map((layer, index) => (
              <SpectrumTile
                key={layer.id}
                as="li"
                cue={spectrumCue(index)}
                label={'badge' in layer && layer.badge ? layer.badge : `Step ${index + 1}`}
                title={layer.title}
                body={layer.body}
                rank={index + 1}
                titleTag="h3"
              />
            ))}
          </SpectrumTileGrid>
        </section>

        <section className="seco-technology__section seco-reveal seco-reveal--7">
          <SpectrumTile
            cue="#6b7280"
            variant="muted"
            label={DLMO_PROXY_LIMITS.eyebrow}
            title={DLMO_PROXY_LIMITS.title}
            body={
              <ul className="seco-hometest__checklist seco-technology__limits-list">
                {DLMO_PROXY_LIMITS.points.map((point) => (
                  <li key={point} className="seco-technology__limits-item">
                    {point}
                  </li>
                ))}
              </ul>
            }
            foot={<p className="seco-technology__limits-note">{DLMO_PROXY_LIMITS.upgrade}</p>}
            titleTag="h2"
          />
        </section>

        <section className="seco-technology__section seco-reveal seco-reveal--8" aria-labelledby="dlmo-refs-title">
          <div className="seco-technology__section-head">
            <h2 id="dlmo-refs-title" className="seco-technology__h2">
              {DLMO_PROXY_REFERENCES.title}
            </h2>
          </div>
          <SpectrumTileGrid as="ul" cols={2} className="seco-technology__grid">
            {DLMO_PROXY_REFERENCES.papers.map((paper) => (
              <SpectrumTile
                key={paper.id}
                as="li"
                cue={paper.cue}
                label={paper.year}
                title={paper.title}
                body={`${paper.authors} · ${paper.meta}`}
                foot={
                  <a
                    href={paper.href}
                    className="seco-technology__tile-link"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Read paper ↗
                  </a>
                }
                titleTag="h3"
              />
            ))}
          </SpectrumTileGrid>
        </section>

        <section className="seco-technology__close seco-reveal seco-reveal--9">
          <SpectrumTile
            cue="#acd3de"
            variant="hero"
            label="Clinical review"
            title={DLMO_PROXY_CLINICIAN_CTA.headline}
            body={DLMO_PROXY_CLINICIAN_CTA.support}
            titleTag="h2"
            foot={
              <nav className="seco-technology__cta-actions seco-technology__cta-actions--links" aria-label="Next steps">
                {DLMO_PROXY_CLINICIAN_CTA.links.map((link) => (
                  <Link key={link.href} href={link.href} className="seco-research-inline-link">
                    {link.label} →
                  </Link>
                ))}
              </nav>
            }
          />
        </section>
      </div>
    </article>
  )
}
