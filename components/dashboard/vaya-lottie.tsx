'use client'

import Lottie, { type LottieRefCurrentProps } from 'lottie-react'
import { useEffect, useRef, useState } from 'react'

import animationData from '@/public/lottie/vaya-assistant.json'
import { cn } from '@/lib/utils'

export type VayaLottieState = 'idle' | 'thinking' | 'responding'

type VayaLottieProps = {
  state?: VayaLottieState
  size?: 'sm' | 'md' | 'lg'
  greeting?: string
  bubbleVariant?: 'compact' | 'intro'
  className?: string
}

const SIZE_PX = {
  sm: 192,
  md: 280,
  lg: 480,
} as const

const COMPACT_BUBBLE_TEXT: Record<keyof typeof SIZE_PX, string> = {
  sm: 'text-[11px] leading-tight',
  md: 'text-[13px] leading-snug',
  lg: 'text-[17px] leading-snug',
}

const STATE_SPEED: Record<VayaLottieState, number> = {
  idle: 1,
  thinking: 1.75,
  responding: 1.15,
}

function SpeechBubble({
  greeting,
  size,
  variant,
}: {
  greeting: string
  size: keyof typeof SIZE_PX
  variant: 'compact' | 'intro'
}) {
  const isIntro = variant === 'intro'

  const bubble = (
    <div
      className={cn(
        'relative font-sans text-black shadow-[0_4px_20px_rgba(0,0,0,0.08)]',
        isIntro
          ? 'rounded-[1.25rem] border border-black/[0.07] bg-white px-5 py-4 text-left text-[15px] font-normal leading-relaxed sm:px-6 sm:py-5 sm:text-[16px] sm:leading-relaxed'
          : cn(
              'rounded-2xl border border-black/[0.06] bg-white px-3 py-2 font-medium',
              'after:absolute after:-bottom-1.5 after:left-[38%] after:h-3 after:w-3 after:rotate-45 after:border-b after:border-r after:border-black/[0.06] after:bg-white',
              COMPACT_BUBBLE_TEXT[size]
            )
      )}
    >
      {greeting}
    </div>
  )

  if (isIntro) {
    return (
      <div
        className="w-full max-w-[min(100%,28rem)] opacity-0 animate-in fade-in duration-500"
        style={{ animationDelay: '350ms', animationFillMode: 'forwards' }}
        role="status"
        aria-live="polite"
      >
        {bubble}
        <div
          className="mx-auto mt-2 h-3 w-3 rotate-45 border-b border-r border-black/[0.07] bg-white"
          aria-hidden
        />
      </div>
    )
  }

  return (
    <div
      className="pointer-events-none absolute left-[8%] top-[4%] z-10 max-w-[58%] opacity-0 animate-in fade-in duration-500"
      style={{ animationDelay: '350ms', animationFillMode: 'forwards' }}
      role="status"
      aria-live="polite"
    >
      {bubble}
    </div>
  )
}

export function VayaLottie({
  state = 'idle',
  size = 'md',
  greeting,
  bubbleVariant = 'compact',
  className,
}: VayaLottieProps) {
  const lottieRef = useRef<LottieRefCurrentProps>(null)
  const [reducedMotion, setReducedMotion] = useState(false)
  const dimension = SIZE_PX[size]
  const isIntro = bubbleVariant === 'intro'

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
        'vaya-lottie flex w-full flex-col items-center',
        isIntro ? 'gap-3' : 'relative mx-auto shrink-0',
        !isIntro && !reducedMotion && state === 'thinking' && 'scale-105',
        !isIntro && !reducedMotion && state === 'responding' && 'scale-[1.02]',
        !isIntro && 'transition-transform duration-500',
        className
      )}
      data-state={state}
      aria-hidden={greeting ? undefined : true}
    >
      {greeting && isIntro ? (
        <SpeechBubble greeting={greeting} size={size} variant="intro" />
      ) : null}

      <div
        className={cn(
          'relative shrink-0 transition-transform duration-500',
          isIntro && !reducedMotion && state === 'thinking' && 'scale-105',
          isIntro && !reducedMotion && state === 'responding' && 'scale-[1.02]'
        )}
        style={{ width: dimension, height: dimension }}
      >
        <Lottie
          lottieRef={lottieRef}
          animationData={animationData}
          loop={!reducedMotion}
          autoplay={!reducedMotion}
          style={{ width: '100%', height: '100%' }}
        />

        {greeting && !isIntro ? (
          <SpeechBubble greeting={greeting} size={size} variant="compact" />
        ) : null}
      </div>
    </div>
  )
}
