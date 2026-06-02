'use client'

import { useEffect, useState, type CSSProperties } from 'react'

import { cn } from '@/lib/utils'

export type MelOrbState = 'idle' | 'thinking' | 'responding'

type MelOrbProps = {
  state: MelOrbState
  volume?: number
  /** Pixel width/height of the orb (default 168). */
  size?: number
  className?: string
}

export function MelOrb({ state, volume = 0, size, className }: MelOrbProps) {
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
    '--mel-orb-scale': scale,
    '--mel-orb-glow': glow,
    ...(size != null ? { width: size, height: size } : {}),
  } as CSSProperties

  return (
    <div
      className={cn(
        'mel-orb',
        `mel-orb--${state}`,
        reducedMotion && 'mel-orb--reduced-motion',
        className
      )}
      data-state={state}
      style={style}
      aria-hidden
    >
      <div className="mel-orb__halo" />
      <span className="mel-orb__ring" />
      <span className="mel-orb__ring" />
      <span className="mel-orb__ring" />
      <div className="mel-orb__core">
        <span className="mel-orb__highlight" />
      </div>
    </div>
  )
}

/** @deprecated Use {@link MelOrb}. */
export const VayaOrb = MelOrb

/** @deprecated Use {@link MelOrbState}. */
export type VayaOrbState = MelOrbState
