import Image from 'next/image'
import type { CSSProperties, ReactNode } from 'react'

import { ChronobiobankTileIcon, type ChronobiobankTileIconId } from '@/components/deepdose/ChronobiobankTileIcon'
import { PlaneTileVideoBackground } from '@/components/deepdose/PlaneTileVideoBackground'
import { MARKETING_NUM_CLASS, MARKETING_WIDE_TILE_CLASS } from '@/lib/design/marketing-system'
import { cn } from '@/lib/utils/cn'

type ChronobiobankPlaneTileProps = {
  cue: string
  label: string
  title: string
  beats: readonly string[]
  image?: { src: string; alt: string }
  /** Muted looping fill video (takes precedence over `image`). */
  videoSrc?: string
  iconId?: ChronobiobankTileIconId
  foot?: ReactNode
  variant?: 'photo' | 'light'
  className?: string
}

/** Wide marketing tile — photo/video hero (mission) or light glass band (foundation). */
export function ChronobiobankPlaneTile({
  cue,
  label,
  title,
  beats,
  image,
  videoSrc,
  iconId = 'device',
  foot,
  variant = 'photo',
  className,
}: ChronobiobankPlaneTileProps) {
  const isLight = variant === 'light'

  return (
    <article
      className={cn(
        MARKETING_WIDE_TILE_CLASS,
        isLight ? 'seco-marketing-wide-tile--light' : 'seco-chronobiobank__plane-visual',
        className,
      )}
      style={{ '--cue': cue } as CSSProperties}
    >
      {!isLight && videoSrc ? (
        <PlaneTileVideoBackground src={videoSrc} />
      ) : !isLight && image ? (
        <>
          <Image
            src={image.src}
            alt={image.alt}
            fill
            sizes="(min-width: 960px) 72rem, 100vw"
            className="seco-chronobiobank__plane-visual__img"
          />
          <div className="seco-chronobiobank__plane-visual__scrim" aria-hidden />
        </>
      ) : null}
      <div
        className={cn(
          'seco-marketing-wide-tile__content',
          !isLight && 'seco-chronobiobank__plane-visual__content',
        )}
      >
        <div
          className={cn(
            'seco-marketing-wide-tile__head',
            !isLight && 'seco-chronobiobank__plane-visual__head',
          )}
        >
          <span
            className={cn(
              'seco-marketing-wide-tile__icon',
              !isLight && 'seco-chronobiobank__plane-visual__icon',
            )}
            aria-hidden
          >
            <ChronobiobankTileIcon id={iconId} />
          </span>
          <span
            className={cn(
              'seco-marketing-wide-tile__cue',
              !isLight && 'seco-chronobiobank__plane-visual__cue',
            )}
          >
            {label}
          </span>
        </div>
        <h2
          className={cn(
            'seco-marketing-wide-tile__title',
            !isLight && 'seco-chronobiobank__plane-visual__title',
          )}
        >
          {title}
        </h2>
        <ol
          className={cn(
            'seco-marketing-wide-tile__body',
            'seco-chronobiobank__plane-visual__beats',
            isLight && 'seco-marketing-wide-tile__beats',
          )}
        >
          {beats.map((beat, index) => (
            <li key={beat} className="seco-chronobiobank__plane-visual__beat">
              <span className={MARKETING_NUM_CLASS} aria-hidden="true">
                {index + 1}
              </span>
              <span className="seco-chronobiobank__plane-visual__beat-text">{beat}</span>
            </li>
          ))}
        </ol>
        {foot ? (
          <div className={cn('seco-marketing-wide-tile__foot', !isLight && 'seco-chronobiobank__plane-visual__foot')}>
            {foot}
          </div>
        ) : null}
      </div>
    </article>
  )
}
