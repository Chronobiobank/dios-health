import type { ReactNode } from 'react'

import { DarkAmbientBackground } from '@/components/deepdose/DarkAmbientBackground'
import { SplashVideoBackground } from '@/components/deepdose/SplashVideoBackground'
import { cn } from '@/lib/utils/cn'

type SplashFrameProps = {
  children: ReactNode
  /** First-light video on home; ambient orbs on gateway splash routes. */
  videoBackground?: boolean
}

/** Fullscreen splash shell — video (home) or ambient canvas (gateway). */
export function SplashFrame({ children, videoBackground = false }: SplashFrameProps) {
  return (
    <div
      data-clinical-layout
      className={cn(
        'clinical-layout deepdose-shell seco-shell--dark seco-splash',
        videoBackground && 'seco-splash--video'
      )}
    >
      {videoBackground ? <SplashVideoBackground /> : <DarkAmbientBackground />}
      <article className="seco-splash__page">{children}</article>
    </div>
  )
}
