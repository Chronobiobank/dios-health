import { Check, Circle } from 'lucide-react'

import { CARD } from '@/components/sections/layout'
import { cn } from '@/lib/utils'

type VerificationTimelineProps = {
  credentialsSubmitted: boolean
}

const STEPS = [
  { key: 'account', label: 'Account created' },
  { key: 'credentials', label: 'Credentials submitted' },
  { key: 'verification', label: 'Verification in progress' },
] as const

export function VerificationTimeline({ credentialsSubmitted }: VerificationTimelineProps) {
  return (
    <ol className={`${CARD} space-y-0 rounded-2xl p-6 sm:p-8`}>
      {STEPS.map((step, index) => {
        const isComplete =
          step.key === 'account' ||
          (step.key === 'credentials' && credentialsSubmitted) ||
          false
        const isCurrent = step.key === 'verification'
        const isLast = index === STEPS.length - 1

        return (
          <li key={step.key} className={cn('flex gap-4', !isLast && 'pb-6')}>
            <div className="flex flex-col items-center">
              <span
                className={cn(
                  'flex h-7 w-7 shrink-0 items-center justify-center rounded-full border',
                  isComplete && 'border-black bg-black text-white',
                  isCurrent && !isComplete && 'border-black/30 text-black/40',
                  !isComplete && !isCurrent && 'border-black/20 text-black/30'
                )}
                aria-hidden
              >
                {isComplete ? (
                  <Check className="h-4 w-4" strokeWidth={2.5} />
                ) : (
                  <Circle className="h-3 w-3" strokeWidth={2.5} />
                )}
              </span>
              {!isLast ? <span className="mt-2 w-px flex-1 bg-black/10" aria-hidden /> : null}
            </div>
            <div className="pt-0.5">
              <p
                className={cn(
                  'type-body text-sm font-medium',
                  isComplete && 'text-black',
                  isCurrent && 'text-black',
                  !isComplete && !isCurrent && 'text-black/40'
                )}
              >
                {step.label}
              </p>
            </div>
          </li>
        )
      })}
    </ol>
  )
}
