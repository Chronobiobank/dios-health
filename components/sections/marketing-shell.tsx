import type { ReactNode } from 'react'

import { PitchLandingBackdrop, PitchShadowStyles } from '@/components/sections/pitch/pitch-backgrounds'
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
 * Public marketing pages — same pastel ambient layer, transparent nav (root layout),
 * and pitch footer as the landing deck.
 */
export function MarketingShell({
  children,
  className,
  showFooter = true,
  prefetchRoutes = true,
}: MarketingShellProps) {
  return (
    <div className={cn('calm-landing relative min-h-svh bg-[#F7FAFC] text-[#0D0D0D]', className)}>
      <PitchShadowStyles />
      {prefetchRoutes ? <PitchLandingPrefetch /> : null}
      <PitchLandingBackdrop fixed />
      <div className="relative z-10 flex min-h-svh flex-col">
        <div className="marketing-main flex-1">{children}</div>
        {showFooter ? <PitchFooter /> : null}
      </div>
    </div>
  )
}
