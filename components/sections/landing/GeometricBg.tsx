import { cn } from '@/lib/utils'

type GeometricBgProps = {
  variant?: 'hero' | 'light' | 'muted'
  className?: string
}

export function GeometricBg({ variant = 'light', className }: GeometricBgProps) {
  return (
    <div className={cn('pointer-events-none absolute inset-0 overflow-hidden', className)} aria-hidden>
      {variant === 'hero' ? (
        <>
          <div className="absolute -left-24 top-1/4 h-72 w-72 rounded-full bg-teal-400/20 blur-3xl" />
          <div className="absolute -right-16 bottom-0 h-80 w-80 rounded-full bg-violet-500/15 blur-3xl" />
          <div
            className="absolute inset-0 opacity-[0.07]"
            style={{
              backgroundImage:
                'linear-gradient(rgba(255,255,255,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.4) 1px, transparent 1px)',
              backgroundSize: '48px 48px',
            }}
          />
        </>
      ) : (
        <>
          <div
            className={cn(
              'absolute -right-20 -top-16 h-56 w-56 rounded-full blur-3xl',
              variant === 'muted' ? 'bg-teal-200/40' : 'bg-teal-100/50'
            )}
          />
          <div
            className={cn(
              'absolute -bottom-24 -left-16 h-64 w-64 rounded-full blur-3xl',
              variant === 'muted' ? 'bg-violet-200/30' : 'bg-violet-100/40'
            )}
          />
        </>
      )}
    </div>
  )
}
