'use client'

import { cn } from '@/lib/utils'

export type TimebotPulseState = 'idle' | 'thinking' | 'responding'

type TimebotPulseProps = {
  state?: TimebotPulseState
}

export function TimebotPulse({ state = 'idle' }: TimebotPulseProps) {
  return (
    <div
      className={cn('timebot-pulse mx-auto', state === 'thinking' && 'timebot-pulse--thinking')}
      data-state={state}
      aria-hidden
    >
      <span className="timebot-pulse__ring" />
      <span className="timebot-pulse__ring" />
      <span className="timebot-pulse__ring" />
      <span className="timebot-pulse__core">ʘ</span>
    </div>
  )
}
