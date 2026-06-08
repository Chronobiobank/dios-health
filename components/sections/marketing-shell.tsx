import type { ReactNode } from 'react'

import { PitchLandingPrefetch } from '@/components/sections/pitch/pitch-landing-prefetch'
import { cn } from '@/lib/utils'

type MarketingShellProps = {
  children: ReactNode
  className?: string
  prefetchRoutes?: boolean
}

/**
 * Public marketing pages — transparent nav (root layout), global ambient backdrop.
 * Site footer is rendered once in the root layout.
 */
export function MarketingShell({
  children,
  className,
  prefetchRoutes = true,
}: MarketingShellProps) {
  const isKawasaki = className?.includes('marketing-v2-shell')

  return (
    <div
      className={cn(
        'marketing-layout calm-landing relative text-dios-ink',
        isKawasaki ? 'min-h-0' : 'min-h-svh',
        className,
      )}
    >
      {prefetchRoutes ? <PitchLandingPrefetch /> : null}
      <div className={cn('relative z-10 flex flex-col', isKawasaki ? 'min-h-0' : 'min-h-svh')}>
        <div className={cn('marketing-main kz-narrative', isKawasaki ? 'min-h-0' : 'flex-1')}>
          {children}
        </div>
      </div>
    </div>
  )
}
