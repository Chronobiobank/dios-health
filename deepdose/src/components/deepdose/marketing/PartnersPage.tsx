import Link from 'next/link'

import { ChronobiobankTileIcon } from '@/components/deepdose/ChronobiobankTileIcon'
import { MarketingFoldTileGrid } from '@/components/deepdose/MarketingFoldTileGrid'
import { MarketingWideTile } from '@/components/deepdose/MarketingWideTile'
import {
  PARTNERS_ALIGNMENT_TILES,
  PARTNERS_COLLABORATION,
  PARTNERS_INSTRUMENT,
  PARTNERS_PAGE_CTA,
  PARTNERS_PAGE_INTRO,
} from '@/lib/deepdose-marketing/partners-content'
import { marketingCtaClass } from '@/lib/design/marketing-system'

const ALIGNMENT_ICONS = {
  smartphone: 'device',
  relapse: 'sleep',
  community: 'partner-nhs',
  data: 'federated',
} as const

export function PartnersPage() {
  return (
    <article className="seco-page seco-partners seco-marketing-page">
      <div className="seco-landing__section-inner">
        <header className="seco-partners__intro seco-reveal seco-reveal--1">
          <p className="seco-page__eyebrow">{PARTNERS_PAGE_INTRO.eyebrow}</p>
          <h1 className="seco-page__title seco-partners__title">
            <span className="seco-landing__hero-line seco-landing__hero-line--white">
              {PARTNERS_PAGE_INTRO.titleWhite}
            </span>
            <span className="seco-landing__hero-line seco-landing__hero-spectrum">
              {PARTNERS_PAGE_INTRO.titleAccent}
            </span>
          </h1>
          <p className="seco-page__lede seco-partners__lede">{PARTNERS_PAGE_INTRO.lede}</p>
        </header>

        <MarketingFoldTileGrid
          className="seco-partners__alignment seco-reveal seco-reveal--2"
          tiles={PARTNERS_ALIGNMENT_TILES.map((tile) => ({
            id: tile.id,
            badge: tile.badge,
            title: tile.title,
            teaser: tile.teaser,
            cue: tile.cue,
            icon: (
              <ChronobiobankTileIcon
                id={ALIGNMENT_ICONS[tile.id as keyof typeof ALIGNMENT_ICONS]}
              />
            ),
          }))}
        />

        <MarketingWideTile
          cue={PARTNERS_INSTRUMENT.cue}
          label={PARTNERS_INSTRUMENT.label}
          title={PARTNERS_INSTRUMENT.title}
          body={PARTNERS_INSTRUMENT.body}
          icon={<ChronobiobankTileIcon id="outcomes" />}
          foot={
            <p className="seco-partners__instrument-links">
              {PARTNERS_INSTRUMENT.links.map((link, index) => (
                <span key={link.href}>
                  {index > 0 ? ' · ' : null}
                  <Link href={link.href} className="seco-research-inline-link">
                    {link.label} →
                  </Link>
                </span>
              ))}
            </p>
          }
          className="seco-partners__instrument seco-reveal seco-reveal--3"
        />

        <MarketingWideTile
          cue={PARTNERS_COLLABORATION.cue}
          label={PARTNERS_COLLABORATION.label}
          title={PARTNERS_COLLABORATION.title}
          body={PARTNERS_COLLABORATION.body}
          icon={<ChronobiobankTileIcon id="partner-academic" />}
          foot={
            <ul className="seco-partners__beats">
              {PARTNERS_COLLABORATION.beats.map((beat) => (
                <li key={beat}>{beat}</li>
              ))}
            </ul>
          }
          className="seco-partners__collaboration seco-reveal seco-reveal--4"
        />

        <div className={marketingCtaClass('seco-partners__cta seco-reveal seco-reveal--5')}>
          <Link href={PARTNERS_PAGE_CTA.primary.href} className="seco-landing__btn seco-landing__btn--primary">
            {PARTNERS_PAGE_CTA.primary.label} →
          </Link>
          <p className="seco-marketing-cta__note">
            {PARTNERS_PAGE_CTA.note}{' '}
            <Link href="/about" className="seco-research-inline-link">
              About the founder →
            </Link>
          </p>
        </div>
      </div>
    </article>
  )
}
