import { DIOS_BRAND_NAME, DIOS_LOGO_MARK } from '@/lib/brand/dios-brand'
import { cn } from '@/lib/utils'

type DiosWordmarkProps = {
  className?: string
}

/** DIOS — Montserrat Regular, all caps; O as ʘ (U+0298). */
export function DiosWordmark({ className }: DiosWordmarkProps) {
  return (
    <span className={cn('dios-wordmark', className)} aria-label={DIOS_BRAND_NAME}>
      {DIOS_LOGO_MARK}
    </span>
  )
}
