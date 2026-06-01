'use client'

import { useEffect, useState, type CSSProperties } from 'react'

import { cn } from '@/lib/utils'

export type VayaOrbState = 'idle' | 'thinking' | 'responding'

type VayaOrbProps = {
  state: VayaOrbState
  volume?: number
  className?: string
}

export function VayaOrb({ state, volume = 0, className }: VayaOrbProps) {
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
    '--vaya-orb-scale': scale,
    '--vaya-orb-glow': glow,
  } as CSSProperties

  return (
    <div
      className={cn(
        'vaya-orb',
        `vaya-orb--${state}`,
        reducedMotion && 'vaya-orb--reduced-motion',
        className
      )}
      data-state={state}
      style={style}
      aria-hidden
    >
      <div className="vaya-orb__halo" />
      <span className="vaya-orb__ring" />
      <span className="vaya-orb__ring" />
      <span className="vaya-orb__ring" />
      <div className="vaya-orb__core">
        <span className="vaya-orb__highlight" />
      </div>
    </div>
  )
}
