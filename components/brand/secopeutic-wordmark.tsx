import { SECOPEUTIC_BRAND_NAME, SECOPEUTIC_LOGO_MARK } from '@/lib/brand/secopeutic-brand'
import { cn } from '@/lib/utils'

type SecopeuticWordmarkProps = {
  className?: string
}

/** SECOPEUTIC — Montserrat Regular, all caps; O as ʘ (U+0298) in one mark like DIOS. */
export function SecopeuticWordmark({ className }: SecopeuticWordmarkProps) {
  return (
    <span className={cn('secopeutic-wordmark', className)} aria-label={SECOPEUTIC_BRAND_NAME}>
      {SECOPEUTIC_LOGO_MARK}
    </span>
  )
}
