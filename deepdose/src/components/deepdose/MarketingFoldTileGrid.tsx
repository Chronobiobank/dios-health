import Link from 'next/link'
import type { CSSProperties, ReactNode } from 'react'

import { cn } from '@/lib/utils/cn'

export type MarketingFoldTileItem = {
  id: string
  badge: string
  title: string
  teaser: string
  cue: string
  icon?: ReactNode
  href?: string
  external?: boolean
}

type MarketingFoldTileGridProps = {
  tiles: readonly MarketingFoldTileItem[]
  className?: string
}

function MarketingFoldTile({ tile }: { tile: MarketingFoldTileItem }) {
  const className = cn(
    'seco-science-fold seco-science-fold--grid-tile seco-science-fold--grid-static seco-app-card',
    tile.href && 'seco-science-fold--linked',
    !tile.icon && 'seco-science-fold--no-icon'
  )
  const style = { '--cue': tile.cue } as CSSProperties
  const body = (
    <div className="seco-science-fold__summary">
      <div className="seco-science-fold__head seco-science-fold__head--mission">
        {tile.icon ? (
          <span className="seco-science-fold__icon" aria-hidden>
            {tile.icon}
          </span>
        ) : null}
        <span className="seco-science-fold__badge">{tile.badge}</span>
        <h3 className="seco-science-fold__title">{tile.title}</h3>
        <p className="seco-science-fold__teaser">{tile.teaser}</p>
      </div>
    </div>
  )

  if (tile.href) {
    if (tile.external) {
      return (
        <a
          href={tile.href}
          target="_blank"
          rel="noopener noreferrer"
          role="listitem"
          className={className}
          style={style}
        >
          {body}
        </a>
      )
    }

    return (
      <Link href={tile.href} role="listitem" className={className} style={style}>
        {body}
      </Link>
    )
  }

  return (
    <article role="listitem" className={className} style={style}>
      {body}
    </article>
  )
}

/** Static 2×2 marketing fold tiles — mission feature grid pattern. */
export function MarketingFoldTileGrid({ tiles, className }: MarketingFoldTileGridProps) {
  return (
    <div className={cn('seco-science-folds seco-marketing-fold-grid', className)}>
      <div className="seco-marketing-fold-grid__tiles" role="list">
        {tiles.map((tile) => (
          <MarketingFoldTile key={tile.id} tile={tile} />
        ))}
      </div>
    </div>
  )
}
