import { cn } from '@/lib/utils'

type Status = 'red' | 'amber' | 'green' | 'blue'

const COLOR_CLASS: Record<Status, string> = {
  red: 'bg-status-red',
  amber: 'bg-status-amber',
  green: 'bg-status-green',
  blue: 'bg-status-blue',
}

const LABEL_CLASS: Record<Status, string> = {
  red: 'text-status-red',
  amber: 'text-status-amber',
  green: 'text-status-green',
  blue: 'text-status-blue',
}

const LABEL: Record<Status, string> = {
  red: 'Needs review',
  amber: 'Watch',
  green: 'On track',
  blue: 'Info',
}

export function StatusDot({
  status,
  showLabel = false,
  className,
}: {
  status: Status
  showLabel?: boolean
  className?: string
}) {
  return (
    <span className={cn('inline-flex items-center gap-1.5', className)}>
      <span
        aria-label={LABEL[status]}
        className={cn('inline-block size-2 shrink-0 rounded-full', COLOR_CLASS[status])}
      />
      {showLabel ? (
        <span className={cn('font-mono text-[10px] tracking-wide', LABEL_CLASS[status])}>
          {LABEL[status]}
        </span>
      ) : null}
    </span>
  )
}
