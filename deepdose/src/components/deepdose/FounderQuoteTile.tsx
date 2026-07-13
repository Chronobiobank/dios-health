import { GRANT_MUNRO_PROFILE } from '@/lib/deepdose-marketing/grant-munro-founder'
import { cn } from '@/lib/utils/cn'

type FounderQuoteTileProps = {
  quote: string
  grounding?: string
  /** Override default Grant Munro attribution (e.g. Manjam team). */
  name?: string
  role?: string
  className?: string
}

/** Full-width founder quote — dark glassmorphic tile, pull-quote typography. */
export function FounderQuoteTile({
  quote,
  grounding,
  name,
  role,
  className,
}: FounderQuoteTileProps) {
  const founder = GRANT_MUNRO_PROFILE
  const attribName = name ?? founder.name
  const attribRole = role ?? founder.role

  return (
    <figure className={cn('seco-founder-quote seco-founder-quote--light', className)}>
      {grounding ? <p className="seco-founder-quote__grounding">{grounding}</p> : null}
      <blockquote className="seco-founder-quote__pull" cite={attribName}>
        <p className="seco-founder-quote__text">{quote}</p>
        <footer className="seco-founder-quote__attrib">
          <cite className="seco-founder-quote__name">{attribName}</cite>
          {attribRole ? <span className="seco-founder-quote__role">{attribRole}</span> : null}
        </footer>
      </blockquote>
    </figure>
  )
}
