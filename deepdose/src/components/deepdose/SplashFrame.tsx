import type { ReactNode } from 'react'

import { DeepDoseSiteNav } from '@/components/deepdose/DeepDoseSiteNav'
import { SplashVideoBackground } from '@/components/deepdose/SplashVideoBackground'
import { cn } from '@/lib/utils/cn'

type SplashFrameProps = {
  children: ReactNode
  /** Muted looping first-light video behind the gate. */
  videoBackground?: boolean
  /** Sniffies-style gate hides marketing header; legal lives on-page. */
  showNav?: boolean
}

/** Fullscreen splash shell — OpenAI-style light canvas (+ optional video). */
export function SplashFrame({
  children,
  videoBackground = false,
  showNav = true,
}: SplashFrameProps) {
  return (
    <div
      data-clinical-layout
      className={cn(
        'clinical-layout deepdose-shell seco-shell--light seco-splash seco-splash--oai',
        videoBackground && 'seco-splash--video seco-splash--video-light'
      )}
    >
      {videoBackground ? <SplashVideoBackground /> : null}
      {showNav ? <DeepDoseSiteNav /> : null}
      <div className="clinical-site-nav__main seco-splash__main flex min-h-0 flex-1 flex-col">
        <article className="seco-splash__page">{children}</article>
      </div>
    </div>
  )
}
