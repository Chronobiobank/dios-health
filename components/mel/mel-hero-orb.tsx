'use client'

import { MelOrb } from '@/components/dashboard/mel-orb'

export function MelHeroOrb() {
  return (
    <div className="mt-8 flex w-full justify-center">
      <MelOrb state="idle" volume={0} size={180} />
    </div>
  )
}

/** @deprecated Use {@link MelHeroOrb}. */
export const VayaHeroOrb = MelHeroOrb
