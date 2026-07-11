import Link from 'next/link'

import { SLEEP_SCORE } from '@/lib/brand/sleep-score'
import { cn } from '@/lib/utils/cn'

type SleepScoreTipTraqLinkProps = {
  className?: string
  /** Compact single-line link (Log footer, Me stats). */
  compact?: boolean
}

/** TipTraQ deepen CTA — use next to every consumer sleep-score readout. */
export function SleepScoreTipTraqLink({ className, compact = false }: SleepScoreTipTraqLinkProps) {
  if (compact) {
    return (
      <Link href={SLEEP_SCORE.tiptraqHref} className={cn('dd-score-tiptraq dd-score-tiptraq--compact', className)}>
        {SLEEP_SCORE.tiptraqLabel}
      </Link>
    )
  }

  return (
    <Link href={SLEEP_SCORE.tiptraqHref} className={cn('dd-score-tiptraq', className)}>
      <span className="dd-score-tiptraq__label">{SLEEP_SCORE.tiptraqLabel}</span>
      <span className="dd-score-tiptraq__hint">{SLEEP_SCORE.tiptraqHint}</span>
    </Link>
  )
}
