import type { ReactNode } from 'react'

import { DarkAmbientBackground } from '@/components/deepdose/DarkAmbientBackground'
import { DeepDoseSiteNav } from '@/components/deepdose/DeepDoseSiteNav'
import { SplashVideoBackground } from '@/components/deepdose/SplashVideoBackground'
import { cn } from '@/lib/utils/cn'

type SplashFrameProps = {
  children: ReactNode
  /** You Are The Drug hero video on home; ambient orbs on gateway splash routes. */
  videoBackground?: boolean
  /** Sniffies-style gate hides marketing header; legal lives on-page. */
  showNav?: boolean
}

/** Fullscreen splash shell — optional sticky nav (off on home gate). */
export function SplashFrame({
  children,
  videoBackground = false,
  showNav = true,
}: SplashFrameProps) {
  return (
    <div
      data-clinical-layout
      className={cn(
        'clinical-layout deepdose-shell seco-shell--dark seco-splash',
        videoBackground && 'seco-splash--video'
      )}
    >
      {videoBackground ? <SplashVideoBackground /> : <DarkAmbientBackground />}
      {showNav ? <DeepDoseSiteNav /> : null}
      <div className="clinical-site-nav__main seco-splash__main flex min-h-0 flex-1 flex-col">
        <article className="seco-splash__page">{children}</article>
      </div>
    </div>
  )
}
