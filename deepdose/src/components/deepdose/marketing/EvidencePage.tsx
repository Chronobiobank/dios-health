import Link from 'next/link'

import { MelatoninCascadeStrip } from '@/components/deepdose/marketing/MelatoninCascadeStrip'
import { SpectrumTile, SpectrumTileGrid } from '@/components/deepdose/SpectrumTile'
import {
  EVIDENCE_PAGE_INTRO,
  EVIDENCE_THEMES,
  type EvidenceThemeLink,
} from '@/lib/deepdose-marketing/evidence-content'

function EvidenceThemeLinks({ links }: { links: readonly EvidenceThemeLink[] }) {
  return (
    <ul className="seco-evidence-theme-links">
      {links.map((link) => (
        <li key={link.href + link.label}>
          {link.external ? (
            <a href={link.href} target="_blank" rel="noopener noreferrer" className="seco-evidence-theme-links__row">
              <span className="seco-evidence-theme-links__label">{link.label}</span>
              <span className="seco-evidence-theme-links__meta">{link.meta} ↗</span>
            </a>
          ) : (
            <Link href={link.href} className="seco-evidence-theme-links__row">
              <span className="seco-evidence-theme-links__label">{link.label}</span>
              <span className="seco-evidence-theme-links__meta">{link.meta} →</span>
            </Link>
          )}
        </li>
      ))}
    </ul>
  )
}

export function EvidencePage() {
  return (
    <article className="seco-page seco-evidence-page">
      <div className="seco-landing__section-inner">
        <header className="seco-evidence-page__intro seco-reveal seco-reveal--1">
          <p className="seco-page__eyebrow">{EVIDENCE_PAGE_INTRO.eyebrow}</p>
          <h1 className="seco-page__title seco-evidence-page__title">
            <span className="seco-landing__hero-line seco-landing__hero-line--white">
              {EVIDENCE_PAGE_INTRO.titleWhite}
            </span>
            <span className="seco-landing__hero-line seco-landing__hero-spectrum">
              {EVIDENCE_PAGE_INTRO.titleAccent}
            </span>
          </h1>
        </header>

        <MelatoninCascadeStrip />

        <SpectrumTileGrid as="ul" cols={2} sm2 className="seco-evidence-page__themes seco-reveal seco-reveal--3">
          {EVIDENCE_THEMES.map((theme) => (
            <SpectrumTile
              key={theme.id}
              as="li"
              cue={theme.cue}
              label={theme.label}
              title={theme.title}
              body={
                <>
                  <p className="seco-evidence-theme-links__lede">{theme.body}</p>
                  <EvidenceThemeLinks links={theme.links} />
                </>
              }
              titleTag="h2"
              titleVariant="display"
              className={theme.id === 'apply' ? 'seco-spectrum-tile--compact' : undefined}
              variant={theme.id === 'stakes' ? 'hero' : 'default'}
            />
          ))}
        </SpectrumTileGrid>
      </div>
    </article>
  )
}
