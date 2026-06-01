'use client'

import Lottie, { type LottieRefCurrentProps } from 'lottie-react'
import { useEffect, useRef, useState } from 'react'

import animationData from '@/public/lottie/vaya-assistant.json'
import { cn } from '@/lib/utils'

export type VayaLottieState = 'idle' | 'thinking' | 'responding'

type VayaLottieProps = {
  state?: VayaLottieState
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const SIZE_PX = {
  sm: 96,
  md: 140,
  lg: 240,
} as const

const STATE_SPEED: Record<VayaLottieState, number> = {
  idle: 1,
  thinking: 1.75,
  responding: 1.15,
}

export function VayaLottie({ state = 'idle', size = 'md', className }: VayaLottieProps) {
  const lottieRef = useRef<LottieRefCurrentProps>(null)
  const [reducedMotion, setReducedMotion] = useState(false)
  const dimension = SIZE_PX[size]

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setReducedMotion(media.matches)
    update()
    media.addEventListener('change', update)
    return () => media.removeEventListener('change', update)
  }, [])

  useEffect(() => {
    const anim = lottieRef.current
    if (!anim) return
    if (reducedMotion) {
      anim.goToAndStop(30, true)
      return
    }
    anim.setSpeed(STATE_SPEED[state])
  }, [state, reducedMotion])

  return (
    <div
      className={cn(
        'vaya-lottie relative mx-auto shrink-0 transition-transform duration-500',
        !reducedMotion && state === 'thinking' && 'scale-105',
        !reducedMotion && state === 'responding' && 'scale-[1.02]',
        className
      )}
      data-state={state}
      style={{ width: dimension, height: dimension }}
      aria-hidden
    >
      <Lottie
        lottieRef={lottieRef}
        animationData={animationData}
        loop={!reducedMotion}
        autoplay={!reducedMotion}
        style={{ width: '100%', height: '100%' }}
      />
    </div>
  )
}
