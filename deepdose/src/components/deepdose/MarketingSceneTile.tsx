import Image from 'next/image'
import type { CSSProperties, ReactNode } from 'react'

import { MARKETING_SCENE_TILE_CLASS } from '@/lib/design/marketing-system'
import { cn } from '@/lib/utils/cn'

type MarketingSceneTileProps = {
  image: { src: string; alt: string }
  /** CSS object-position for the photo crop */
  objectPosition?: string
  /** No border / radius / shadow — photo as open background, not a card */
  flush?: boolean
  className?: string
  children: ReactNode
}

/**
 * Photo scene tile — image fills the card; children (e.g. How loop) layer on top.
 * Use `flush` only when you want the photo without card chrome.
 */
export function MarketingSceneTile({
  image,
  objectPosition = 'center center',
  flush = false,
  className,
  children,
}: MarketingSceneTileProps) {
  return (
    <article
      className={cn(
        MARKETING_SCENE_TILE_CLASS,
        flush && 'seco-marketing-scene-tile--flush',
        className,
      )}
      style={{ '--scene-img-pos': objectPosition } as CSSProperties}
    >
      <Image
        src={image.src}
        alt={image.alt}
        fill
        sizes="(min-width: 640px) 26rem, 100vw"
        className="seco-marketing-scene-tile__img"
        priority
      />
      <div className="seco-marketing-scene-tile__scrim" aria-hidden />
      <div className="seco-marketing-scene-tile__stage">{children}</div>
    </article>
  )
}
