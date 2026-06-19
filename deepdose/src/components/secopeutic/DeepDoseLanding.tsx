import Image from 'next/image'
import Link from 'next/link'

import { SecopeuticFooter } from '@/components/secopeutic/SecopeuticFooter'
import { SecopeuticHeroHeadline } from '@/components/secopeutic/SecopeuticHeroHeadline'
import { SecopeuticHeroTabs } from '@/components/secopeutic/SecopeuticHeroTabs'
import {
  DEEPDOSE_LANDING_CLOSE,
  DEEPDOSE_LANDING_EVIDENCE,
  DEEPDOSE_LANDING_HERO,
} from '@/lib/secopeutic/landing-content'

export function DeepDoseLanding() {
  return (
    <div className="seco-landing seco-landing--maven">
      <section className="seco-landing__hero">
        <div className="seco-landing__hero-navy">
          <div className="seco-landing__section-inner">
            <div className="seco-reveal seco-reveal--1">
              <SecopeuticHeroHeadline />
            </div>
            <p className="seco-landing__hero-lede seco-reveal seco-reveal--2">
              {DEEPDOSE_LANDING_HERO.support}
            </p>
            <div className="seco-landing__hero-actions seco-reveal seco-reveal--3">
              <Link
                href={DEEPDOSE_LANDING_HERO.actions.primary.href}
                className="seco-landing__btn seco-landing__btn--primary"
              >
                {DEEPDOSE_LANDING_HERO.actions.primary.label} →
              </Link>
              <Link
                href={DEEPDOSE_LANDING_HERO.actions.secondary.href}
                className="seco-landing__btn seco-landing__btn--ghost"
              >
                {DEEPDOSE_LANDING_HERO.actions.secondary.label} →
              </Link>
            </div>
          </div>
        </div>
        <div className="seco-landing__section-inner seco-reveal seco-reveal--4">
          <SecopeuticHeroTabs />
        </div>
      </section>

      <section className="seco-evidence-band">
        <div className="seco-landing__section-inner">
          <div className="seco-landing__section-head">
            <div>
              <p className="seco-evidence-band__eyebrow">{DEEPDOSE_LANDING_EVIDENCE.eyebrow}</p>
              <h2 className="seco-landing__section-title">{DEEPDOSE_LANDING_EVIDENCE.headline}</h2>
            </div>
            <Link
              href={DEEPDOSE_LANDING_EVIDENCE.seeAll.href}
              className="seco-landing__section-link"
            >
              {DEEPDOSE_LANDING_EVIDENCE.seeAll.label} →
            </Link>
          </div>
          <p className="seco-landing__support">{DEEPDOSE_LANDING_EVIDENCE.support}</p>

          <ul className="seco-evidence-band__grid">
            {DEEPDOSE_LANDING_EVIDENCE.papers.map((paper) => (
              <li key={paper.id} className="seco-evidence-band__card">
                <a
                  href={paper.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="seco-evidence-band__link-overlay"
                >
                  {paper.image ? (
                    <span className="seco-evidence-band__media">
                      <Image
                        src={paper.image}
                        alt={paper.imageAlt ?? ''}
                        fill
                        sizes="(min-width: 768px) 33vw, 100vw"
                        className="seco-evidence-band__img"
                      />
                    </span>
                  ) : null}
                  <span className="seco-evidence-band__body">
                    <span className="seco-evidence-band__tier">
                      {paper.tier} · {paper.year}
                    </span>
                    <span className="seco-evidence-band__title">{paper.title}</span>
                    <span className="seco-evidence-band__meta">
                      {paper.authors} · {paper.meta}
                    </span>
                    <span className="seco-evidence-band__cue">Read source →</span>
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="seco-landing__close-navy">
        <div className="seco-landing__section-inner">
          <h2 className="seco-landing__section-title">{DEEPDOSE_LANDING_CLOSE.headline}</h2>
          <p className="seco-landing__support">{DEEPDOSE_LANDING_CLOSE.support}</p>
          <div className="seco-landing__actions">
            <Link
              href={DEEPDOSE_LANDING_CLOSE.cta.href}
              className="seco-landing__btn seco-landing__btn--primary"
            >
              {DEEPDOSE_LANDING_CLOSE.cta.label} →
            </Link>
            <Link
              href={DEEPDOSE_LANDING_CLOSE.secondaryCta.href}
              className="seco-landing__btn seco-landing__btn--secondary"
            >
              {DEEPDOSE_LANDING_CLOSE.secondaryCta.label} →
            </Link>
          </div>
        </div>
      </section>

      <SecopeuticFooter />
    </div>
  )
}
