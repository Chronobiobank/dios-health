import { SECOPEUTIC_BRAND_NAME, SECOPEUTIC_LOGO_GLYPH } from '@/lib/brand/secopeutic-brand'
import { cn } from '@/lib/utils'

type SecopeuticWordmarkProps = {
  className?: string
}

/** SECOPEUTIC — Montserrat Regular, all caps; O rendered as ʘ (U+0298). */
export function SecopeuticWordmark({ className }: SecopeuticWordmarkProps) {
  return (
    <span className={cn('secopeutic-wordmark', className)} aria-label={SECOPEUTIC_BRAND_NAME}>
      SEC
      <span className="secopeutic-wordmark__o" aria-hidden="true">
        {SECOPEUTIC_LOGO_GLYPH}
      </span>
      PEUTIC
    </span>
  )
}
