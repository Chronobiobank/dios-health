import Image from 'next/image'
import type { CSSProperties, ReactNode } from 'react'

import { ChronobiobankTileIcon, type ChronobiobankTileIconId } from '@/components/deepdose/ChronobiobankTileIcon'
import { MARKETING_NUM_CLASS, MARKETING_WIDE_TILE_CLASS } from '@/lib/design/marketing-system'
import { cn } from '@/lib/utils/cn'

type ChronobiobankPlaneTileProps = {
  cue: string
  label: string
  title: string
  beats: readonly string[]
  image: { src: string; alt: string }
  iconId?: ChronobiobankTileIconId
  foot?: ReactNode
  className?: string
}

/** Photo-backed wide marketing tile — numbered beats over a scrim (mission “How it works” pattern). */
export function ChronobiobankPlaneTile({
  cue,
  label,
  title,
  beats,
  image,
  iconId = 'device',
  foot,
  className,
}: ChronobiobankPlaneTileProps) {
  return (
    <article
      className={cn(MARKETING_WIDE_TILE_CLASS, 'seco-chronobiobank__plane-visual', className)}
      style={{ '--cue': cue } as CSSProperties}
    >
      <Image
        src={image.src}
        alt={image.alt}
        fill
        sizes="(min-width: 960px) 72rem, 100vw"
        className="seco-chronobiobank__plane-visual__img"
      />
      <div className="seco-chronobiobank__plane-visual__scrim" aria-hidden />
      <div className="seco-marketing-wide-tile__content seco-chronobiobank__plane-visual__content">
        <div className="seco-marketing-wide-tile__head seco-chronobiobank__plane-visual__head">
          <span className="seco-marketing-wide-tile__icon seco-chronobiobank__plane-visual__icon" aria-hidden>
            <ChronobiobankTileIcon id={iconId} />
          </span>
          <span className="seco-marketing-wide-tile__cue seco-chronobiobank__plane-visual__cue">{label}</span>
        </div>
        <h2 className="seco-marketing-wide-tile__title seco-chronobiobank__plane-visual__title">{title}</h2>
        <ol className="seco-marketing-wide-tile__body seco-chronobiobank__plane-visual__beats">
          {beats.map((beat, index) => (
            <li key={beat} className="seco-chronobiobank__plane-visual__beat">
              <span className={MARKETING_NUM_CLASS} aria-hidden="true">
                {index + 1}
              </span>
              <span className="seco-chronobiobank__plane-visual__beat-text">{beat}</span>
            </li>
          ))}
        </ol>
        {foot ? <div className="seco-chronobiobank__plane-visual__foot">{foot}</div> : null}
      </div>
    </article>
  )
}
