import { GRANT_MUNRO_PROFILE } from '@/lib/deepdose-marketing/grant-munro-founder'
import { cn } from '@/lib/utils/cn'

type FounderQuoteTileProps = {
  quote: string
  className?: string
}

/** Full-width founder quote — light spectrum gradient, no portrait wash. */
export function FounderQuoteTile({ quote, className }: FounderQuoteTileProps) {
  const founder = GRANT_MUNRO_PROFILE

  return (
    <figure className={cn('seco-founder-quote seco-founder-quote--light', className)}>
      <blockquote className="seco-founder-quote__body">
        <p className="seco-founder-quote__text">&ldquo;{quote}&rdquo;</p>
        <figcaption className="seco-founder-quote__attrib">
          <span className="seco-founder-quote__eyebrow">Founder</span>
          <span className="seco-founder-quote__name">{founder.name}</span>
          <span className="seco-founder-quote__role">{founder.role}</span>
        </figcaption>
      </blockquote>
    </figure>
  )
}
