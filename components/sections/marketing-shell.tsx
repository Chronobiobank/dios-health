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
  return (
    <div className={cn('marketing-layout calm-landing relative min-h-svh text-dios-ink', className)}>
      {prefetchRoutes ? <PitchLandingPrefetch /> : null}
      <div className="relative z-10 flex min-h-svh flex-col">
        <div className="marketing-main flex-1">{children}</div>
      </div>
    </div>
  )
}
