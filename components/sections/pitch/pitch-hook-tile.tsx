'use client'

import { PITCH_HERO } from '@/lib/pitch/landing-images'

import { PitchMediaTile } from './pitch-primitives'
import { PitchTileVideo } from './pitch-tile-video'

/** Hook screen hero card — pills video inside the tile (OpenAI-style). */
export function PitchHookTile() {
  return (
    <PitchMediaTile
      variant="orange"
      hero
      video
      media={
        <PitchTileVideo
          src={PITCH_HERO.video}
          poster={PITCH_HERO.poster}
          ariaLabel="Unused NHS prescription medicines"
        />
      }
    />
  )
}
