import type { ReactNode } from 'react'

import { SplashVideoBackground } from '@/components/deepdose/SplashVideoBackground'

/** Fullscreen splash shell — uses the same dark Maven marketing chrome as the rest of the site. */
export function SplashFrame({ children }: { children: ReactNode }) {
  return (
    <div className="clinical-layout deepdose-shell seco-shell--dark seco-splash">
      <SplashVideoBackground />
      <article className="seco-splash__page">{children}</article>
    </div>
  )
}
