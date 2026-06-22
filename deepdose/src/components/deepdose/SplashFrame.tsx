import type { ReactNode } from 'react'

import { DarkAmbientBackground } from '@/components/deepdose/DarkAmbientBackground'

/** Fullscreen splash shell — same ambient canvas as the rest of the dark marketing site. */
export function SplashFrame({ children }: { children: ReactNode }) {
  return (
    <div
      data-clinical-layout
      className="clinical-layout deepdose-shell seco-shell--dark seco-splash"
    >
      <DarkAmbientBackground />
      <article className="seco-splash__page">{children}</article>
    </div>
  )
}
