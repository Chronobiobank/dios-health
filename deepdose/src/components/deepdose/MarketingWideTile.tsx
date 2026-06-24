import type { CSSProperties, ReactNode } from 'react'

import { MARKETING_WIDE_TILE_CLASS } from '@/lib/design/marketing-system'
import { cn } from '@/lib/utils/cn'

type MarketingWideTileProps = {
  cue: string
  label: string
  title: string
  body: string
  icon?: ReactNode
  foot?: ReactNode
  titleTag?: 'h2' | 'h3'
  className?: string
}

/** Full-width glass marketing tile — wide typography without a photo band. */
export function MarketingWideTile({
  cue,
  label,
  title,
  body,
  icon,
  foot,
  titleTag: TitleTag = 'h2',
  className,
}: MarketingWideTileProps) {
  return (
    <article
      className={cn(
        MARKETING_WIDE_TILE_CLASS,
        'seco-marketing-wide-tile--glass seco-app-card',
        className,
      )}
      style={{ '--cue': cue } as CSSProperties}
    >
      <div className="seco-marketing-wide-tile__content">
        <div className="seco-marketing-wide-tile__head">
          {icon ? (
            <span className="seco-marketing-wide-tile__icon" aria-hidden>
              {icon}
            </span>
          ) : null}
          <span className="seco-marketing-wide-tile__cue">{label}</span>
        </div>
        <TitleTag className="seco-marketing-wide-tile__title">{title}</TitleTag>
        <p className="seco-marketing-wide-tile__body">{body}</p>
        {foot ? <div className="seco-marketing-wide-tile__foot">{foot}</div> : null}
      </div>
    </article>
  )
}
