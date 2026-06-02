import { ChevronDown } from 'lucide-react'
import type { ReactNode } from 'react'

import { PITCH_MINIMAL_TILES } from '@/lib/pitch/pitch-minimal'

import { PitchFooter } from './pitch-footer'
import { PitchMinimalTileCard } from './pitch-minimal-tile'

function ScrollIndicator() {
  return (
    <div
      className="pointer-events-none absolute inset-x-0 bottom-6 z-10 flex justify-center md:bottom-8"
      aria-hidden
    >
      <ChevronDown className="h-5 w-5 animate-bounce text-[#0D0D0D]/30" />
    </div>
  )
}

function PitchScreen({ id, children }: { id: string; children: ReactNode }) {
  return (
    <section
      id={id}
      className="pitch-screen relative flex min-h-[100dvh] snap-start snap-always flex-col bg-transparent"
    >
      <div className="relative z-10 mx-auto flex w-full max-w-[76rem] flex-1 flex-col justify-start gap-3 px-4 pb-20 pt-[calc(var(--dios-site-nav-height)+1rem)] sm:gap-4 sm:px-6 sm:pt-[calc(var(--dios-site-nav-height)+1.25rem)]">
        {children}
      </div>
      <ScrollIndicator />
    </section>
  )
}

export function PitchDeck() {
  return (
    <div className="pitch-deck relative h-[100dvh] snap-y snap-mandatory overflow-y-auto overscroll-y-contain scroll-smooth md:h-auto md:snap-none md:overflow-visible">
      {PITCH_MINIMAL_TILES.map((tile) => (
        <PitchScreen key={tile.id} id={tile.id}>
          <PitchMinimalTileCard tile={tile} />
        </PitchScreen>
      ))}

      <div className="snap-start">
        <PitchFooter />
      </div>
    </div>
  )
}
