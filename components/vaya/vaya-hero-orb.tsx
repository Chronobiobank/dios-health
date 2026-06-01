'use client'

import { VayaOrb } from '@/components/dashboard/vaya-orb'

export function VayaHeroOrb() {
  return (
    <div className="mt-8 flex w-full justify-center">
      <VayaOrb state="idle" volume={0} size={180} />
    </div>
  )
}
