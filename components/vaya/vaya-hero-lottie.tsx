'use client'

import { VayaLottie } from '@/components/dashboard/vaya-lottie'
import { getVayaIntroMessageGeneric } from '@/lib/auth/greeting'

export function VayaHeroLottie() {
  return (
    <div className="mt-8 flex w-full max-w-lg justify-center px-2">
      <div className="w-full rounded-[2rem] bg-white p-6 shadow-[0_24px_80px_rgba(0,0,0,0.45)] sm:p-8">
        <VayaLottie
          size="lg"
          bubbleVariant="intro"
          greeting={getVayaIntroMessageGeneric()}
        />
      </div>
    </div>
  )
}
