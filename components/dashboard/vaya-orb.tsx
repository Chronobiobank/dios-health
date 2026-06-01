'use client'

import { cn } from '@/lib/utils'
import { VayaLottie, type VayaLottieState } from '@/components/dashboard/vaya-lottie'

type VayaOrbProps = {
  state: VayaLottieState
  volume: number
  greeting?: string
}

export function VayaOrb({ state, volume, greeting }: VayaOrbProps) {
  const scale = 1 + Math.max(0, Math.min(volume, 1)) * 0.08

  return (
    <div
      className={cn('transition-transform duration-150 ease-out')}
      style={{ transform: `scale(${scale})` }}
    >
      {/* TODO: replace placeholder with dedicated VayaOrb visual component. */}
      <VayaLottie state={state} bubbleVariant="intro" greeting={greeting} />
    </div>
  )
}
