import { BODYCLOQ_LOGO_MARK } from '@/lib/brand/bodycloq-brand'
import { CLOQ_LOGO_GLYPH, CLOQ_LOGO_MARK } from '@/lib/brand/cloq-health'
import { cn } from '@/lib/utils'

type CloQWordmarkProps = {
  className?: string
}

/** CLOQ — Unbounded Light; O rendered as ʘ (U+0298). */
export function CloQWordmark({ className }: CloQWordmarkProps) {
  return (
    <span className={cn('cloq-wordmark', className)} aria-label="CLOQ">
      CL<span className="cloq-wordmark__o">{CLOQ_LOGO_GLYPH}</span>Q
    </span>
  )
}

/** BODYCLOQ metric wordmark — same ʘ glyph, longer mark. */
export function BodycloQWordmark({ className }: CloQWordmarkProps) {
  return (
    <span className={cn('cloq-wordmark', className)} aria-label="BodycloQ">
      BODYCL<span className="cloq-wordmark__o">{CLOQ_LOGO_GLYPH}</span>Q
    </span>
  )
}

type CloQMarkProps = {
  className?: string
}

/** ʘ (U+0298) — footer and compact brand moments. */
export function CloQMark({ className }: CloQMarkProps) {
  return (
    <span className={cn('cloq-mark', className)} aria-hidden>
      {CLOQ_LOGO_GLYPH}
    </span>
  )
}

type CloQTagProps = {
  className?: string
  children: string
}

/** MAKE TIME COUNT — Unbounded Light, all caps. */
export function CloQTag({ className, children }: CloQTagProps) {
  return <span className={cn('cloq-tag', className)}>{children}</span>
}
