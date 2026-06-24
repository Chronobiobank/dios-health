import Image from 'next/image'
import type { CSSProperties } from 'react'

import type { TipTraqStepCopySide, TipTraqStepCopyValign } from '@/lib/deepdose-marketing/tiptraq-content'
import { MARKETING_NUM_CLASS, MARKETING_WIDE_TILE_CLASS } from '@/lib/design/marketing-system'
import { cn } from '@/lib/utils/cn'

type MarketingPhotoStepTileProps = {
  rank: number
  cue: string
  title: string
  body: string
  image: { src: string; alt: string }
  copySide?: TipTraqStepCopySide
  copyValign?: TipTraqStepCopyValign
  imagePosition?: string
  className?: string
}

const COPY_VALIGN_CLASS: Record<TipTraqStepCopyValign, string> = {
  top: 'seco-marketing-step-tile--copy-top',
  center: 'seco-marketing-step-tile--copy-center',
  bottom: 'seco-marketing-step-tile--copy-bottom',
}

/** Full-bleed photo step tile — short head + sub anchored to darker image regions. */
export function MarketingPhotoStepTile({
  rank,
  cue,
  title,
  body,
  image,
  copySide = 'left',
  copyValign = 'center',
  imagePosition,
  className,
}: MarketingPhotoStepTileProps) {
  const imgPos =
    imagePosition ?? (copySide === 'right' ? '32% center' : '68% center')

  return (
    <article
      className={cn(
        MARKETING_WIDE_TILE_CLASS,
        'seco-marketing-step-tile',
        copySide === 'right' && 'seco-marketing-step-tile--copy-right',
        COPY_VALIGN_CLASS[copyValign],
        className,
      )}
      style={
        {
          '--cue': cue,
          '--step-img-pos': imgPos,
        } as CSSProperties
      }
    >
      <Image
        src={image.src}
        alt={image.alt}
        fill
        sizes="(min-width: 960px) 72rem, 100vw"
        className="seco-marketing-step-tile__img"
      />
      <div className="seco-marketing-step-tile__scrim" aria-hidden />
      <div className="seco-marketing-step-tile__content">
        <span className={MARKETING_NUM_CLASS} aria-hidden="true">
          {rank}
        </span>
        <h2 className="seco-marketing-step-tile__title">{title}</h2>
        <p className="seco-marketing-step-tile__body">{body}</p>
      </div>
    </article>
  )
}
