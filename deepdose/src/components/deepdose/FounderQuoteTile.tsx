import { GRANT_MUNRO_PROFILE } from '@/lib/deepdose-marketing/grant-munro-founder'
import { cn } from '@/lib/utils/cn'

type FounderQuoteTileProps = {
  quote: string
  grounding?: string
  className?: string
}

/** Full-width founder quote — light spectrum gradient, pull-quote typography. */
export function FounderQuoteTile({ quote, grounding, className }: FounderQuoteTileProps) {
  const founder = GRANT_MUNRO_PROFILE

  return (
    <figure className={cn('seco-founder-quote seco-founder-quote--light', className)}>
      {grounding ? <p className="seco-founder-quote__grounding">{grounding}</p> : null}
      <blockquote className="seco-founder-quote__pull" cite={founder.name}>
        <p className="seco-founder-quote__text">{quote}</p>
        <footer className="seco-founder-quote__attrib">
          <cite className="seco-founder-quote__name">{founder.name}</cite>
          <span className="seco-founder-quote__role">{founder.role}</span>
        </footer>
      </blockquote>
    </figure>
  )
}
