import { cn } from '@/lib/utils'

export function DataValue({
  label,
  value,
  sub,
  size = 'md',
  className,
}: {
  label: string
  value: string | number
  sub?: string
  size?: 'lg' | 'md' | 'sm'
  className?: string
}) {
  const valueClass =
    size === 'lg' ? 'text-data-lg' : size === 'md' ? 'text-data-md' : 'text-data-sm'

  return (
    <div className={className}>
      <div className="data-label mb-[3px]">{label}</div>
      <div className={cn('font-mono font-medium tabular-nums tracking-tight text-foreground', valueClass)}>
        {value}
      </div>
      {sub ? <div className="mt-0.5 font-sans text-[10px] text-muted-foreground">{sub}</div> : null}
    </div>
  )
}
