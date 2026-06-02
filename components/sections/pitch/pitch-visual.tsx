'use client'

import Image from 'next/image'
import { useState } from 'react'

import { cn } from '@/lib/utils'

type PitchVisualProps = {
  src: string
  alt: string
  priority?: boolean
  className?: string
  aspect?: 'video' | 'square' | 'wide'
  /** When false, parent tile controls corner radius (glow tiles). */
  rounded?: boolean
  overlay?: boolean
}

const ASPECT = {
  video: 'aspect-[16/10]',
  square: 'aspect-square',
  wide: 'aspect-[21/9]',
} as const

/** OpenAI-style tile image with calm fallback gradient. */
export function PitchVisual({
  src,
  alt,
  priority = false,
  className,
  aspect = 'video',
  rounded = true,
  overlay = true,
}: PitchVisualProps) {
  const [failed, setFailed] = useState(false)

  return (
    <div
      className={cn(
        'pitch-visual relative h-full w-full overflow-hidden bg-[#0f0f0f]',
        rounded && 'rounded-[var(--pitch-radius,var(--calm-radius-card,8px))]',
        ASPECT[aspect],
        className
      )}
    >
      {!failed ? (
        <Image
          src={src}
          alt={alt}
          fill
          priority={priority}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover"
          onError={() => setFailed(true)}
        />
      ) : (
        <div
          className="absolute inset-0 bg-gradient-to-br from-[#1a1a1a] via-[#0f0f0f] to-[#1a1508]"
          aria-hidden
        />
      )}
      {overlay ? (
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#080808]/80 via-transparent to-transparent"
          aria-hidden
        />
      ) : null}
    </div>
  )
}
