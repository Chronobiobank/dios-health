import { ChevronDown } from 'lucide-react'
import type { ReactNode } from 'react'

import { PITCH_MINIMAL_TILES } from '@/lib/pitch/pitch-minimal'

import { PitchFooter } from './pitch-footer'
import { PitchMinimalTileCard } from './pitch-minimal-tile'

function ScrollIndicator() {
  return (
    <div
      className="pointer-events-none absolute inset-x-[var(--pitch-screen-inset)] bottom-[var(--pitch-screen-inset)] z-20 flex justify-center"
      aria-hidden
    >
      <ChevronDown className="h-5 w-5 animate-bounce text-[#0D0D0D]/30" />
    </div>
  )
}

function PitchScreen({ id, children }: { id: string; children: ReactNode }) {
  return (
    <section id={id} className="pitch-screen relative snap-start snap-always bg-transparent">
      <div className="pitch-screen__tile relative z-10">{children}</div>
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
