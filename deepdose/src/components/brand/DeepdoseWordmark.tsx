import { DEEPDOSE_NAME, DEEPDOSE_WORDMARK } from '@/lib/brand/deepdose-brand'
import { cn } from '@/lib/utils/cn'

type DeepdoseWordmarkProps = {
  className?: string
}

/** unmed — nav logo wordmark. */
export function DeepdoseWordmark({ className }: DeepdoseWordmarkProps) {
  return (
    <span className={cn('deepdose-wordmark', className)} aria-label={DEEPDOSE_NAME}>
      {DEEPDOSE_WORDMARK}
    </span>
  )
}
