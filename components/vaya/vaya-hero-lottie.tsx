'use client'

import { VayaLottie } from '@/components/dashboard/vaya-lottie'

export function VayaHeroLottie() {
  return (
    <div className="mt-8 flex justify-center">
      <div className="rounded-[2rem] bg-white p-5 shadow-[0_24px_80px_rgba(0,0,0,0.45)] sm:p-6">
        <VayaLottie size="lg" />
      </div>
    </div>
  )
}
