'use client'

import { useEffect, useState, type CSSProperties } from 'react'

import { cn } from '@/lib/utils'

export type CoachOrbState = 'idle' | 'thinking' | 'responding'

type CoachOrbProps = {
  state: CoachOrbState
  volume?: number
  /** Pixel width/height of the orb (default 168). */
  size?: number
  className?: string
}

export function CoachOrb({ state, volume = 0, size, className }: CoachOrbProps) {
  const [reducedMotion, setReducedMotion] = useState(false)
  const level = Math.max(0, Math.min(volume, 1))
  const scale = 1 + level * 0.14
  const glow = 0.32 + level * 0.55

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setReducedMotion(media.matches)
    update()
    media.addEventListener('change', update)
    return () => media.removeEventListener('change', update)
  }, [])

  const style = {
    '--coach-orb-scale': scale,
    '--coach-orb-glow': glow,
    ...(size != null ? { width: size, height: size } : {}),
  } as CSSProperties

  return (
    <div
      className={cn(
        'coach-orb',
        `coach-orb--${state}`,
        reducedMotion && 'coach-orb--reduced-motion',
        className
      )}
      data-state={state}
      style={style}
      aria-hidden
    >
      <div className="coach-orb__halo" />
      <span className="coach-orb__ring" />
      <span className="coach-orb__ring" />
      <span className="coach-orb__ring" />
      <div className="coach-orb__core">
        <span className="coach-orb__highlight" />
      </div>
    </div>
  )
}
