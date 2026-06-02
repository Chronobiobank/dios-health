'use client'

import { MelLottie } from '@/components/dashboard/mel-lottie'
import { getMelIntroMessageGeneric } from '@/lib/auth/greeting'

export function MelHeroLottie() {
  return (
    <div className="mt-8 flex w-full justify-center">
      <div className="w-full max-w-[280px]">
        <MelLottie state="idle" greeting={getMelIntroMessageGeneric()} />
      </div>
    </div>
  )
}

/** @deprecated Use {@link MelHeroLottie}. */
export const VayaHeroLottie = MelHeroLottie
