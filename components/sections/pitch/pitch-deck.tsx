import { ChevronDown } from 'lucide-react'
import type { ReactNode } from 'react'

import { PITCH_MINIMAL_TILES } from '@/lib/pitch/pitch-minimal'
import { PitchEvidenceGrid } from './pitch-evidence-grid'
import { PitchFeatureGrid } from './pitch-feature-grid'
import { PitchFooter } from './pitch-footer'
import { PitchMinimalTileCard } from './pitch-minimal-tile'
import { PitchPhilosophySection } from './pitch-philosophy-section'
import { PitchProblemGrid } from './pitch-problem-grid'

function ScrollIndicator({ light }: { light?: boolean }) {
  return (
    <div
      className="pointer-events-none absolute inset-x-[var(--pitch-screen-inset)] bottom-[var(--pitch-screen-inset-bottom)] z-20 flex justify-center"
      aria-hidden
    >
      <ChevronDown
        className={`h-5 w-5 animate-bounce ${light ? 'text-[#0D0D0D]/25' : 'text-white/40'}`}
      />
    </div>
  )
}

function PitchScreen({
  id,
  children,
  light,
}: {
  id: string
  children: ReactNode
  light?: boolean
}) {
  return (
    <section id={id} className="pitch-screen relative snap-start snap-always bg-transparent">
      <div className="pitch-screen__tile relative z-10">{children}</div>
      <ScrollIndicator light={light} />
    </section>
  )
}

const CLINICAL_PROOF_TILE_ID = 'pitch-clinical-proof'

export function PitchDeck() {
  const supportTiles = PITCH_MINIMAL_TILES.filter((tile) => tile.id !== CLINICAL_PROOF_TILE_ID)

  return (
    <div className="pitch-deck relative snap-y snap-mandatory overflow-y-auto scroll-smooth md:snap-none md:overflow-visible">
      <PitchScreen id="pitch-problem" light>
        <PitchProblemGrid />
      </PitchScreen>

      <PitchScreen id="pitch-features" light>
        <PitchFeatureGrid />
      </PitchScreen>

      <PitchScreen id="pitch-philosophy">
        <PitchPhilosophySection />
      </PitchScreen>

      <PitchScreen id={CLINICAL_PROOF_TILE_ID} light>
        <PitchEvidenceGrid />
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
