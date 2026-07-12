import Link from 'next/link'
import type { CSSProperties } from 'react'

import { SpectrumTileGrid } from '@/components/deepdose/SpectrumTile'
import type { MembershipTier } from '@/lib/deepdose-marketing/membership-content'
import { marketingTilesClass } from '@/lib/design/marketing-system'
import { spectrumCue } from '@/lib/design/spectrum-cues'
import { cn } from '@/lib/utils/cn'

function CheckIcon() {
  return (
    <svg className="seco-homekit__check" viewBox="0 0 20 20" width="18" height="18" aria-hidden="true">
      <path
        d="M5 10.5l3.2 3.2L15 7"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

/**
 * Membership cards — global spectrum figure / cadence / body hierarchy
 * so price, meta, note, and bullets read as separate layers.
 */
export function MembershipTiers({ tiers }: { tiers: readonly MembershipTier[] }) {
  return (
    <SpectrumTileGrid
      cols={3}
      className={marketingTilesClass('seco-pricing__grid')}
      as="ul"
      aria-label="Membership options"
    >
      {tiers.map((tier, index) => {
        const cue = tier.cue ?? spectrumCue(index)

        return (
          <li
            key={tier.id}
            className={cn('seco-spectrum-tile', 'seco-spectrum-tile--hero')}
            style={{ '--cue': cue } as CSSProperties}
          >
            <div className="seco-spectrum-tile__head">
              <span className="seco-spectrum-tile__cue">{tier.name}</span>
            </div>
            <span className="seco-spectrum-tile__figure">{tier.figure}</span>
            <span className="seco-spectrum-tile__cadence">{tier.cadence}</span>
            <p className="seco-spectrum-tile__body">{tier.note}</p>
            <ul className="seco-homekit__checklist">
              {tier.includes.map((item) => (
                <li key={item} className="seco-homekit__check-item">
                  <CheckIcon />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <div className="seco-spectrum-tile__foot">
              <Link href={tier.cta.href} className="seco-landing__btn seco-landing__btn--primary">
                {tier.cta.label} →
              </Link>
            </div>
          </li>
        )
      })}
    </SpectrumTileGrid>
  )
}
