import { cn } from '@/lib/utils'

type Severity = 'red' | 'amber' | 'green' | 'blue'

const STYLES: Record<Severity, string> = {
  red: 'border-status-red-border bg-status-red-bg text-[#9B2C2C]',
  amber: 'border-status-amber-border bg-status-amber-bg text-[#744210]',
  green: 'border-status-green-border bg-status-green-bg text-status-green',
  blue: 'border-status-blue-border bg-status-blue-bg text-status-blue',
}

export function FlagBadge({
  label,
  severity = 'blue',
  className,
}: {
  label: string
  severity?: Severity
  className?: string
}) {
  return (
    <span
      className={cn(
        'inline-block whitespace-nowrap rounded-[3px] border-[0.5px] px-[7px] py-0.5 font-mono text-ui-label tracking-wide',
        STYLES[severity],
        className
      )}
    >
      {label}
    </span>
  )
}
