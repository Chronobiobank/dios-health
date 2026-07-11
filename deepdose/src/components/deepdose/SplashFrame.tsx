import type { ReactNode } from 'react'

import { DeepDoseSiteNav } from '@/components/deepdose/DeepDoseSiteNav'
import { cn } from '@/lib/utils/cn'

type SplashFrameProps = {
  children: ReactNode
  /** Kept for API compat — video/ambient disabled on light OpenAI splash. */
  videoBackground?: boolean
  /** Sniffies-style gate hides marketing header; legal lives on-page. */
  showNav?: boolean
}

/** Fullscreen splash shell — OpenAI-style light canvas. */
export function SplashFrame({
  children,
  showNav = true,
}: SplashFrameProps) {
  return (
    <div
      data-clinical-layout
      className={cn(
        'clinical-layout deepdose-shell seco-shell--light seco-splash seco-splash--oai'
      )}
    >
      {showNav ? <DeepDoseSiteNav /> : null}
      <div className="clinical-site-nav__main seco-splash__main flex min-h-0 flex-1 flex-col">
        <article className="seco-splash__page">{children}</article>
      </div>
    </div>
  )
}
