import type { ReactNode } from 'react'

import { PitchLandingPrefetch } from '@/components/sections/pitch/pitch-landing-prefetch'
import { cn } from '@/lib/utils'

type MarketingShellProps = {
  children: ReactNode
  className?: string
  prefetchRoutes?: boolean
}

/** Public marketing pages — minimal wrapper, no scroll-snap shell. */
export function MarketingShell({
  children,
  className,
  prefetchRoutes = true,
}: MarketingShellProps) {
  return (
    <div className={cn('marketing-layout relative', className)}>
      {prefetchRoutes ? <PitchLandingPrefetch /> : null}
      {children}
    </div>
  )
}
