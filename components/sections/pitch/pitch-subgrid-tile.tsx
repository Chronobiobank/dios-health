'use client'

import Link from 'next/link'

import type { RetinomicFeatureCopy } from '@/lib/pitch/retinomic-landing-copy'
import { cn } from '@/lib/utils'

import { PitchMediaTile } from './pitch-media-tile'

type PitchSubgridTileProps = {
  card: RetinomicFeatureCopy
}

/** Optional link wrapper — full-cell tap target for landing 2×2 glass sub-tiles */
export function PitchSubgridTile({ card }: PitchSubgridTileProps) {
  const content = (
    <PitchMediaTile image={card.image} imageAlt={card.imageAlt} size="subgrid">
      <p className="pitch-tile-card-title line-clamp-2 text-[0.8125rem] leading-snug sm:text-sm">
        {card.lead}
      </p>
      <p className="pitch-tile-sub pitch-tile-sub--light !mt-1.5 hidden !text-[0.6875rem] !leading-snug sm:block sm:!text-xs">
        {card.body}
      </p>
    </PitchMediaTile>
  )

  if (!card.href) {
    return content
  }

  const linkClass = cn(
    'flex h-full min-h-0 w-full min-w-0 rounded-[var(--pitch-radius,var(--calm-radius-card,8px))]',
    'transition-opacity hover:opacity-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--calm-brand)]'
  )

  if (card.external) {
    return (
      <a href={card.href} target="_blank" rel="noopener noreferrer" className={linkClass}>
        {content}
      </a>
    )
  }

  return (
    <Link href={card.href} prefetch className={linkClass}>
      {content}
    </Link>
  )
}
