import { DEEPDOSE_NAME, DEEPDOSE_WORDMARK } from '@/lib/brand/deepdose-brand'
import { cn } from '@/lib/utils/cn'

type DeepdoseWordmarkProps = {
  className?: string
}

/** DEEPDOSE — Montserrat Medium, all caps; O as ʘ (U+0298), same weight as letters. */
export function DeepdoseWordmark({ className }: DeepdoseWordmarkProps) {
  return (
    <span className={cn('deepdose-wordmark', className)} aria-label={DEEPDOSE_NAME}>
      {DEEPDOSE_WORDMARK}
    </span>
  )
}
