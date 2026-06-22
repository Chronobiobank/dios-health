import type { Metadata } from 'next'
import Link from 'next/link'

import { HashOpenDisclosure } from '@/components/deepdose/HashOpenDisclosure'
import { ResearchSections } from '@/components/deepdose/marketing/ResearchSections'
import { ScienceTrustSections } from '@/components/deepdose/marketing/ScienceTrustSections'
import {
  ScienceTrustDisclosure,
  ScienceTrustFoldStack,
} from '@/components/deepdose/ScienceTrustDisclosure'
import { SpectrumTile, SpectrumTileGrid } from '@/components/deepdose/SpectrumTile'
import {
  CHRONOBIOBANK_APPLE,
  CHRONOBIOBANK_AUDIENCES,
  CHRONOBIOBANK_CAPTURE,
  CHRONOBIOBANK_CONSENT,
  CHRONOBIOBANK_ECOSYSTEM,
  CHRONOBIOBANK_INTRO,
  CHRONOBIOBANK_LEARNING,
  CHRONOBIOBANK_META,
  CHRONOBIOBANK_PLANES,
  CHRONOBIOBANK_PRECEDENTS,
  CHRONOBIOBANK_RETRIEVE,
  CHRONOBIOBANK_SCIENCE,
  CHRONOBIOBANK_STORE,
  CHRONOBIOBANK_TIERS,
  CHRONOBIOBANK_TRUST,
} from '@/lib/deepdose-marketing/chronobiobank-content'
import {
  CHRONOBIOBANK_RESEARCH_ANCHOR,
  CHRONOBIOBANK_SCIENCE_ANCHOR,
} from '@/lib/deepdose-marketing/site-nav-links'

export const metadata: Metadata = {
  title: CHRONOBIOBANK_META.title,
  description: CHRONOBIOBANK_META.description,
}

export default function ChronobiobankPage() {
  return (
    <article className="seco-page seco-chronobiobank">
      <div className="seco-landing__section-inner">
        <header className="seco-chronobiobank__intro seco-reveal seco-reveal--1">
          <p className="seco-page__eyebrow">{CHRONOBIOBANK_INTRO.eyebrow}</p>
          <h1 className="seco-page__title">{CHRONOBIOBANK_INTRO.title}</h1>
          <p className="seco-page__lede">{CHRONOBIOBANK_INTRO.lede}</p>
          <blockquote className="seco-chronobiobank__quote">
            <p>{CHRONOBIOBANK_INTRO.quote}</p>
          </blockquote>
        </header>

        <SpectrumTileGrid cols={3} className="seco-chronobiobank__planes seco-reveal seco-reveal--2">
          {CHRONOBIOBANK_PLANES.map((plane) => (
            <SpectrumTile
              key={plane.id}
              cue={plane.cue}
              label={plane.label}
              title={plane.title}
              body={plane.body}
              titleTag="h2"
            />
          ))}
        </SpectrumTileGrid>

        <ScienceTrustFoldStack className="seco-chronobiobank__folds seco-reveal seco-reveal--3">
          <ScienceTrustDisclosure
            title={CHRONOBIOBANK_TRUST.title}
            teaser="UK Biobank trust tested · data stays on your edge"
            badge={CHRONOBIOBANK_TRUST.eyebrow}
          >
            <blockquote className="seco-chronobiobank__quote seco-chronobiobank__quote--trust">
              <p>{CHRONOBIOBANK_TRUST.quote}</p>
            </blockquote>
            <SpectrumTileGrid cols={2} className="seco-chronobiobank__contrast">
              {CHRONOBIOBANK_TRUST.contrasts.map((item) => (
                <SpectrumTile
                  key={item.id}
                  cue={item.cue}
                  label={item.label}
                  title={item.title}
                  body={item.body}
                  titleTag="h3"
                />
              ))}
            </SpectrumTileGrid>
            <p className="seco-chronobiobank__closing">{CHRONOBIOBANK_TRUST.closing}</p>
          </ScienceTrustDisclosure>

          <ScienceTrustDisclosure
            title={CHRONOBIOBANK_APPLE.title}
            teaser="On-device learning · distributed compute · lower central cost"
            badge={CHRONOBIOBANK_APPLE.eyebrow}
          >
            <p className="seco-chronobiobank__prose">{CHRONOBIOBANK_APPLE.lede}</p>
            <p className="seco-chronobiobank__prose">{CHRONOBIOBANK_APPLE.costBody}</p>
            <ul className="seco-chronobiobank__detail-list">
              {CHRONOBIOBANK_APPLE.federatedPoints.map((point) => (
                <li key={point.title}>
                  <p className="seco-chronobiobank__detail-title">{point.title}</p>
                  <p className="seco-chronobiobank__detail-body">{point.body}</p>
                </li>
              ))}
            </ul>
            <p className="seco-chronobiobank__note">{CHRONOBIOBANK_SCIENCE.body}</p>
            <p className="seco-chronobiobank__note">{CHRONOBIOBANK_APPLE.consentLine}</p>
          </ScienceTrustDisclosure>

          <ScienceTrustDisclosure
            title="Every participant, every device"
            teaser="Federated · privacy upload · assisted — hybrid by design"
            badge="Hybrid"
          >
            <p className="seco-chronobiobank__prose">{CHRONOBIOBANK_SCIENCE.note}</p>
            <SpectrumTileGrid as="ol" cols={3} className="seco-chronobiobank__tiers">
              {CHRONOBIOBANK_TIERS.map((tier, index) => (
                <SpectrumTile
                  key={tier.id}
                  as="li"
                  cue={tier.cue}
                  label={tier.label}
                  title={tier.title}
                  body={
                    <>
                      <p className="seco-chronobiobank__tier-audience">{tier.audience}</p>
                      <p>{tier.body}</p>
                    </>
                  }
                  foot={
                    <p className="seco-chronobiobank__tier-leaves">
                      <span className="seco-chronobiobank__tier-leaves-label">Leaves the edge</span>
                      {tier.leaves}
                    </p>
                  }
                  rank={index + 1}
                  titleTag="h3"
                />
              ))}
            </SpectrumTileGrid>
          </ScienceTrustDisclosure>

          <ScienceTrustDisclosure
            title={CHRONOBIOBANK_PRECEDENTS.title}
            teaser={CHRONOBIOBANK_PRECEDENTS.teaser}
            badge={CHRONOBIOBANK_PRECEDENTS.badge}
          >
            <ul className="seco-chronobiobank__detail-list">
              {CHRONOBIOBANK_PRECEDENTS.items.map((item) => (
                <li key={item.title}>
                  <p className="seco-chronobiobank__detail-title">{item.title}</p>
                  <p className="seco-chronobiobank__detail-body">{item.body}</p>
                </li>
              ))}
            </ul>
          </ScienceTrustDisclosure>

          <ScienceTrustDisclosure
            title="Capture · store · retrieve"
            teaser="Edge clinical data · learning coordinator · licensed aggregates"
            badge="Data plane"
          >
            <ul className="seco-chronobiobank__detail-list">
              {CHRONOBIOBANK_CAPTURE.points.map((point) => (
                <li key={point.title}>
                  <p className="seco-chronobiobank__detail-title">{point.title}</p>
                  <p className="seco-chronobiobank__detail-body">{point.body}</p>
                </li>
              ))}
            </ul>
            <ul className="seco-chronobiobank__detail-list">
              {CHRONOBIOBANK_STORE.stores.map((store) => (
                <li key={store.title}>
                  <p className="seco-chronobiobank__detail-title">{store.title}</p>
                  <p className="seco-chronobiobank__detail-body">{store.body}</p>
                </li>
              ))}
            </ul>
            <ul className="seco-chronobiobank__access-table">
              {CHRONOBIOBANK_RETRIEVE.rows.map((row) => (
                <li key={row.role} className="seco-chronobiobank__access-row">
                  <p className="seco-chronobiobank__access-role">{row.role}</p>
                  <div className="seco-chronobiobank__access-cols">
                    <p>
                      <span className="seco-chronobiobank__access-label">Gets</span>
                      {row.gets}
                    </p>
                    <p>
                      <span className="seco-chronobiobank__access-label">Never</span>
                      {row.never}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </ScienceTrustDisclosure>

          <ScienceTrustDisclosure
            title={CHRONOBIOBANK_LEARNING.title}
            teaser={CHRONOBIOBANK_LEARNING.teaser}
            badge={CHRONOBIOBANK_LEARNING.badge}
          >
            <p className="seco-chronobiobank__prose">{CHRONOBIOBANK_LEARNING.body}</p>
            <ol className="seco-chronobiobank__phases">
              {CHRONOBIOBANK_LEARNING.phases.map((phase) => (
                <li key={phase.label} className="seco-chronobiobank__phase">
                  <span className="seco-chronobiobank__phase-label">{phase.label}</span>
                  <span className="seco-chronobiobank__phase-detail">{phase.detail}</span>
                </li>
              ))}
            </ol>
          </ScienceTrustDisclosure>

          <ScienceTrustDisclosure
            title={CHRONOBIOBANK_CONSENT.title}
            teaser={CHRONOBIOBANK_CONSENT.teaser}
            badge={CHRONOBIOBANK_CONSENT.badge}
          >
            <ul className="seco-chronobiobank__detail-list">
              {CHRONOBIOBANK_CONSENT.pillars.map((pillar) => (
                <li key={pillar.title}>
                  <p className="seco-chronobiobank__detail-title">{pillar.title}</p>
                  <p className="seco-chronobiobank__detail-body">{pillar.body}</p>
                </li>
              ))}
            </ul>
            <p className="seco-chronobiobank__note">{CHRONOBIOBANK_CONSENT.note}</p>
            <Link href="/consent" className="seco-research-inline-link">
              Consent framework ↗
            </Link>
          </ScienceTrustDisclosure>

          <ScienceTrustDisclosure
            title={CHRONOBIOBANK_ECOSYSTEM.title}
            teaser="OpenMined · HDRUK · academic validation · London ICB path"
            badge="London"
          >
            <p className="seco-chronobiobank__prose">{CHRONOBIOBANK_ECOSYSTEM.lede}</p>
            <SpectrumTileGrid cols={2} className="seco-chronobiobank__partners">
              {CHRONOBIOBANK_ECOSYSTEM.partners.map((partner) => (
                <SpectrumTile
                  key={partner.id}
                  cue={partner.cue}
                  label={partner.label}
                  title={partner.title}
                  body={partner.body}
                  titleTag="h3"
                />
              ))}
            </SpectrumTileGrid>
            <p className="seco-chronobiobank__detail-title">{CHRONOBIOBANK_ECOSYSTEM.prototype.title}</p>
            <p className="seco-chronobiobank__detail-body">{CHRONOBIOBANK_ECOSYSTEM.prototype.body}</p>
            <SpectrumTileGrid cols={3} className="seco-chronobiobank__audiences">
              {CHRONOBIOBANK_AUDIENCES.map((audience) => (
                <SpectrumTile
                  key={audience.id}
                  cue={audience.cue}
                  label={audience.label}
                  title={audience.title}
                  body={audience.body}
                  titleTag="h3"
                  foot={
                    <Link href={audience.cta.href} className="seco-research-inline-link">
                      {audience.cta.label} →
                    </Link>
                  }
                />
              ))}
            </SpectrumTileGrid>
          </ScienceTrustDisclosure>

          <HashOpenDisclosure
            anchor={CHRONOBIOBANK_RESEARCH_ANCHOR}
            title="Research"
            teaser="Why timing matters · scholars · key papers"
            badge="Evidence"
          >
            <ResearchSections />
          </HashOpenDisclosure>

          <HashOpenDisclosure
            anchor={CHRONOBIOBANK_SCIENCE_ANCHOR}
            title="Science & trust"
            teaser="Proxy DLMO · wearables · privacy · clinical limits"
            badge="Measure"
          >
            <ScienceTrustSections />
          </HashOpenDisclosure>
        </ScienceTrustFoldStack>
      </div>
    </article>
  )
}
