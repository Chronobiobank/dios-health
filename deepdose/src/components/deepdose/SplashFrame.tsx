import type { ReactNode } from 'react'

import { AmbientBackground } from '@/components/deepdose/AmbientBackground'
import { DeepDoseSiteNav } from '@/components/deepdose/DeepDoseSiteNav'
import { cn } from '@/lib/utils/cn'

type SplashFrameProps = {
  children: ReactNode
  /** @deprecated Video splash retired — ambient orbs are always on. */
  videoBackground?: boolean
  /** Sniffies-style gate hides marketing header; legal lives on-page. */
  showNav?: boolean
}

/** Fullscreen splash shell — ambient orb canvas + optional marketing nav. */
export function SplashFrame({ children, showNav = true }: SplashFrameProps) {
  return (
    <div
      data-clinical-layout
      className={cn(
        'clinical-layout deepdose-shell seco-shell--light seco-splash seco-splash--oai seco-splash--ambient'
      )}
    >
      <AmbientBackground tone="light" />
      {showNav ? <DeepDoseSiteNav /> : null}
      <div className="clinical-site-nav__main seco-splash__main flex min-h-0 flex-1 flex-col">
        <article className="seco-splash__page">{children}</article>
      </div>
    </div>
  )
}
