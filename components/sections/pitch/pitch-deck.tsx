import { ChevronDown } from 'lucide-react'
import type { ReactNode } from 'react'

import { PITCH_MINIMAL_TILES } from '@/lib/pitch/pitch-minimal'
import { PitchFeatureGrid } from './pitch-feature-grid'
import { PitchFooter } from './pitch-footer'
import { PitchMinimalTileCard } from './pitch-minimal-tile'
import { PitchPhilosophySection } from './pitch-philosophy-section'

function ScrollIndicator() {
  return (
    <div
      className="pointer-events-none absolute inset-x-[var(--pitch-screen-inset)] bottom-[var(--pitch-screen-inset-bottom)] z-20 flex justify-center"
      aria-hidden
    >
      <ChevronDown className="h-5 w-5 animate-bounce text-white/40" />
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
  const [heroTile, ...supportTiles] = PITCH_MINIMAL_TILES

  return (
    <div className="pitch-deck relative snap-y snap-mandatory overflow-y-auto scroll-smooth md:snap-none md:overflow-visible">
      {heroTile ? (
        <PitchScreen key={heroTile.id} id={heroTile.id}>
          <PitchMinimalTileCard tile={heroTile} />
        </PitchScreen>
      ) : null}

      <PitchScreen id="pitch-features">
        <PitchFeatureGrid />
      </PitchScreen>

      <PitchScreen id="pitch-philosophy">
        <PitchPhilosophySection />
      </PitchScreen>

      {supportTiles.map((tile) => (
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
