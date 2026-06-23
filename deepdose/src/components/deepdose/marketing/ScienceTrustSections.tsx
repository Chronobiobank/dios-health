import Link from 'next/link'

import { BodyClockCompareStrip } from '@/components/deepdose/BodyClockCompareStrip'
import { SpectrumTile, SpectrumTileGrid } from '@/components/deepdose/SpectrumTile'
import {
  ScienceTrustDisclosure,
  ScienceTrustFoldStack,
} from '@/components/deepdose/ScienceTrustDisclosure'
import { formatTipTraqBaselineFee } from '@/lib/clinical/tiptraq-program'
import {
  SCIENCE_TRUST_CLAIMS,
  SCIENCE_TRUST_CLINICIAN,
  SCIENCE_TRUST_ENGINE,
  SCIENCE_TRUST_EVIDENCE,
  SCIENCE_TRUST_MEASUREMENT,
  SCIENCE_TRUST_PRIVACY,
  SCIENCE_TRUST_STUDY,
  SCIENCE_TRUST_WEARABLES,
} from '@/lib/deepdose-marketing/science-trust-content'
import { CHRONOBIOBANK_RESEARCH_HREF, TECHNOLOGY_DLMO_PROXY_HREF } from '@/lib/deepdose-marketing/site-nav-links'
import { spectrumCue } from '@/lib/design/spectrum-cues'

export function ScienceTrustSections() {
  const clinicalFigure = formatTipTraqBaselineFee()

  return (
    <div className="seco-science seco-science--embedded">
      <BodyClockCompareStrip clinicalFigure={clinicalFigure} />

      <ScienceTrustFoldStack>
        <ScienceTrustDisclosure title={SCIENCE_TRUST_CLAIMS.title} teaser={SCIENCE_TRUST_CLAIMS.teaser}>
          <p>{SCIENCE_TRUST_CLAIMS.body}</p>
        </ScienceTrustDisclosure>

        <ScienceTrustDisclosure
          title={SCIENCE_TRUST_MEASUREMENT.title}
          teaser={SCIENCE_TRUST_MEASUREMENT.teaser}
          badge={SCIENCE_TRUST_MEASUREMENT.badge}
          defaultOpen
        >
          <ol className="seco-science-ladder">
            {SCIENCE_TRUST_MEASUREMENT.layers.map((layer, index) => (
              <li key={layer.id} className="seco-science-ladder__step">
                <span className="seco-science-ladder__index" aria-hidden="true">
                  {index + 1}
                </span>
                <div className="seco-science-ladder__body">
                  <div className="seco-science-ladder__head">
                    <h4 className="seco-science-ladder__title">{layer.title}</h4>
                    {'badge' in layer && layer.badge ? (
                      <span className="seco-science-ladder__badge">{layer.badge}</span>
                    ) : null}
                  </div>
                  <p className="seco-science-ladder__text">{layer.body}</p>
                </div>
              </li>
            ))}
          </ol>
          <div className="seco-science-proxy">
            <p className="seco-science-proxy__title">{SCIENCE_TRUST_MEASUREMENT.proxyDlmo.headline}</p>
            <p className="seco-science-proxy__lede">{SCIENCE_TRUST_MEASUREMENT.proxyDlmo.lede}</p>
            <SpectrumTileGrid as="ul" cols={2} sm2 className="seco-science-proxy__signals">
              {SCIENCE_TRUST_MEASUREMENT.proxyDlmo.signals.map((signal, index) => (
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
            <p className="seco-science-proxy__fusion">{SCIENCE_TRUST_MEASUREMENT.proxyDlmo.fusion}</p>
            <Link href={TECHNOLOGY_DLMO_PROXY_HREF} className="seco-research-inline-link">
              Full proxy DLMO methodology →
            </Link>
          </div>
          <div className="seco-science-limits">
            <p className="seco-science-limits__title">{SCIENCE_TRUST_MEASUREMENT.limits.title}</p>
            <ul className="seco-science-limits__list">
              {SCIENCE_TRUST_MEASUREMENT.limits.points.map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>
            <p className="seco-science-limits__note">{SCIENCE_TRUST_MEASUREMENT.limits.goldStandard}</p>
          </div>
        </ScienceTrustDisclosure>

        <ScienceTrustDisclosure
          title={SCIENCE_TRUST_ENGINE.title}
          teaser={SCIENCE_TRUST_ENGINE.teaser}
          badge={SCIENCE_TRUST_ENGINE.badge}
        >
          <div className="seco-science-folds seco-science-folds--nested">
            {SCIENCE_TRUST_ENGINE.outputs.map((output) => (
              <ScienceTrustDisclosure
                key={output.id}
                nested
                title={output.term}
                teaser={output.teaser}
              >
                <p>{output.body}</p>
              </ScienceTrustDisclosure>
            ))}
          </div>
        </ScienceTrustDisclosure>

        <ScienceTrustDisclosure
          title={SCIENCE_TRUST_WEARABLES.title}
          teaser={SCIENCE_TRUST_WEARABLES.teaser}
          badge={SCIENCE_TRUST_WEARABLES.badge}
        >
          <ul className="seco-science-wearables">
            {SCIENCE_TRUST_WEARABLES.providers.map((provider) => (
              <li key={provider.name} className="seco-science-wearables__row">
                <span className="seco-science-wearables__name">{provider.name}</span>
                <span className="seco-science-wearables__tier">{provider.tier}</span>
                <span className="seco-science-wearables__streams">{provider.streams}</span>
              </li>
            ))}
          </ul>
        </ScienceTrustDisclosure>

        <ScienceTrustDisclosure
          title={SCIENCE_TRUST_STUDY.title}
          teaser={SCIENCE_TRUST_STUDY.teaser}
          badge={SCIENCE_TRUST_STUDY.badge}
        >
          <ul className="seco-science-endpoints">
            {SCIENCE_TRUST_STUDY.endpoints.map((endpoint) => (
              <li key={endpoint}>{endpoint}</li>
            ))}
          </ul>
          <p className="seco-science__note">{SCIENCE_TRUST_STUDY.note}</p>
        </ScienceTrustDisclosure>

        <ScienceTrustDisclosure
          title={SCIENCE_TRUST_PRIVACY.title}
          teaser={SCIENCE_TRUST_PRIVACY.teaser}
          badge={SCIENCE_TRUST_PRIVACY.badge}
        >
          <ul className="seco-science-privacy">
            {SCIENCE_TRUST_PRIVACY.pillars.map((pillar) => (
              <li key={pillar.title}>
                <p className="seco-science-privacy__title">{pillar.title}</p>
                <p className="seco-science-privacy__body">{pillar.body}</p>
              </li>
            ))}
          </ul>
          <nav className="seco-science__links" aria-label="Related policies">
            {SCIENCE_TRUST_PRIVACY.links.map((link) => (
              <Link key={link.href} href={link.href} className="seco-research-inline-link">
                {link.label} ↗
              </Link>
            ))}
          </nav>
        </ScienceTrustDisclosure>

        <ScienceTrustDisclosure
          title={SCIENCE_TRUST_CLINICIAN.title}
          teaser={SCIENCE_TRUST_CLINICIAN.teaser}
          badge={SCIENCE_TRUST_CLINICIAN.badge}
        >
          <ul className="seco-science-clinician">
            {SCIENCE_TRUST_CLINICIAN.points.map((point) => (
              <li key={point}>{point}</li>
            ))}
          </ul>
          <div className="seco-science-clinician__actions">
            <Link href={SCIENCE_TRUST_CLINICIAN.methodology.href} className="seco-research-inline-link">
              {SCIENCE_TRUST_CLINICIAN.methodology.label} →
            </Link>
            <Link href={SCIENCE_TRUST_CLINICIAN.cta.href} className="seco-landing__btn seco-landing__btn--primary">
              {SCIENCE_TRUST_CLINICIAN.cta.label} →
            </Link>
            <Link href={SCIENCE_TRUST_CLINICIAN.landing.href} className="seco-landing__btn seco-landing__btn--ghost">
              {SCIENCE_TRUST_CLINICIAN.landing.label}
            </Link>
          </div>
        </ScienceTrustDisclosure>
      </ScienceTrustFoldStack>

      <section className="seco-science__section">
        <p className="seco-page__eyebrow">Evidence</p>
        <h3 className="seco-science__h2">{SCIENCE_TRUST_EVIDENCE.headline}</h3>
        <p className="seco-science__support">{SCIENCE_TRUST_EVIDENCE.support}</p>
        <ul className="seco-science-evidence">
          {SCIENCE_TRUST_EVIDENCE.papers.map((paper) => (
            <li key={paper.id}>
              <a
                href={paper.href}
                className="seco-science-evidence__link seco-app-card p-4 md:p-5"
                target="_blank"
                rel="noopener noreferrer"
              >
                <span className="seco-science-evidence__title">{paper.title}</span>
                <span className="seco-science-evidence__meta">
                  {paper.authors} · {paper.year} ↗
                </span>
              </a>
            </li>
          ))}
        </ul>
        <p className="seco-science__caveat">{SCIENCE_TRUST_EVIDENCE.caveat}</p>
        <Link href={CHRONOBIOBANK_RESEARCH_HREF} className="seco-landing__btn seco-landing__btn--ghost">
          {SCIENCE_TRUST_EVIDENCE.seeAll.label} →
        </Link>
      </section>
    </div>
  )
}
