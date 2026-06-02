import { ChevronDown } from 'lucide-react'
import type { ReactNode } from 'react'

import { PITCH_MINIMAL_TILES } from '@/lib/pitch/pitch-minimal'

import { PitchShadowBackdrop, PitchShadowStyles } from './pitch-backgrounds'
import { PitchFooter } from './pitch-footer'
import { PitchMinimalTileCard } from './pitch-minimal-tile'

function ScrollIndicator() {
  return (
    <div
      className="pointer-events-none absolute inset-x-0 bottom-6 z-10 flex justify-center md:bottom-8"
      aria-hidden
    >
      <ChevronDown className="h-5 w-5 animate-bounce text-white/35" />
    </div>
  )
}

function PitchScreen({
  id,
  backgroundVariant,
  children,
}: {
  id: string
  backgroundVariant: 0 | 1 | 2 | 3 | 4
  children: ReactNode
}) {
  return (
    <section
      id={id}
      className="pitch-screen relative flex min-h-[100dvh] snap-start snap-always flex-col bg-calm-bg"
    >
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <PitchShadowBackdrop variant={backgroundVariant} />
      </div>
      <div className="relative z-10 mx-auto flex w-full max-w-[76rem] flex-1 flex-col justify-start gap-3 px-4 pb-20 pt-[calc(var(--dios-site-nav-height)+1rem)] sm:gap-4 sm:px-6 sm:pt-[calc(var(--dios-site-nav-height)+1.25rem)]">
        {children}
      </div>
      <ScrollIndicator />
    </section>
  )
}

const SCREEN_VARIANTS = [0, 1, 2, 3, 4, 0, 1, 2, 3, 4, 0, 1] as const satisfies readonly (0 | 1 | 2 | 3 | 4)[]

export function PitchDeck() {
  return (
    <div className="pitch-deck h-[100dvh] snap-y snap-mandatory overflow-y-auto overscroll-y-contain scroll-smooth md:h-auto md:snap-none md:overflow-visible">
      <PitchShadowStyles />

      {PITCH_MINIMAL_TILES.map((tile, index) => (
        <PitchScreen
          key={tile.id}
          id={tile.id}
          backgroundVariant={SCREEN_VARIANTS[index % SCREEN_VARIANTS.length]}
        >
          <PitchMinimalTileCard tile={tile} />
        </PitchScreen>
      ))}

      <div className="snap-start">
        <PitchFooter />
      </div>
    </div>
  )
}
