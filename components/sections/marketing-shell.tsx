import type { ReactNode } from 'react'

import { PitchFooter } from '@/components/sections/pitch/pitch-footer'
import { PitchLandingPrefetch } from '@/components/sections/pitch/pitch-landing-prefetch'
import { cn } from '@/lib/utils'

type MarketingShellProps = {
  children: ReactNode
  className?: string
  showFooter?: boolean
  prefetchRoutes?: boolean
}

/**
 * Public marketing pages — transparent nav (root layout), global ambient backdrop,
 * and pitch footer aligned with the landing deck.
 */
export function MarketingShell({
  children,
  className,
  showFooter = true,
  prefetchRoutes = true,
}: MarketingShellProps) {
  return (
    <div className={cn('calm-landing relative min-h-svh text-dios-ink', className)}>
      {prefetchRoutes ? <PitchLandingPrefetch /> : null}
      <div className="relative z-10 flex min-h-svh flex-col">
        <div className="marketing-main flex-1">{children}</div>
        {showFooter ? <PitchFooter /> : null}
      </div>
    </div>
  )
}
