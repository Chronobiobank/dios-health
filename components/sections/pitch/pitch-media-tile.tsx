'use client'

import Image from 'next/image'
import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react'

import { PITCH_TILE_TINT_GRADIENT } from '@/lib/pitch/pitch-palette'
import { cn } from '@/lib/utils'

export type PitchMediaTileSize = 'hero' | 'card' | 'metric' | 'feature'

const FRAME_CLASS: Record<PitchMediaTileSize, string> = {
  hero: 'pitch-media-tile__frame h-full min-h-0 w-full',
  card: 'min-h-[200px] aspect-[4/3] sm:min-h-[220px]',
  metric: 'min-h-[140px] aspect-square sm:min-h-[168px]',
  feature: 'min-h-[min(52dvh,420px)] aspect-[16/10] sm:min-h-[380px]',
}

type PitchMediaTileProps = {
  image: string
  imageAlt: string
  /** MP4 path e.g. /pills.mp4 — hero-sized tiles only */
  videoSrc?: string
  size?: PitchMediaTileSize
  priority?: boolean
  className?: string
  children?: ReactNode
}

/**
 * OpenAI calm hero tile (see HeroFeatureTile / PitchHookTile): image or video fill,
 * 35% brand tint, calm scrim, copy overlaid at the bottom of the card.
 */
export function PitchMediaTile({
  image,
  imageAlt,
  videoSrc,
  size = 'card',
  priority = false,
  className,
  children,
}: PitchMediaTileProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [videoActive, setVideoActive] = useState(false)
  const [usePosterOnly, setUsePosterOnly] = useState(!videoSrc)

  const startPlayback = useCallback(() => {
    const video = videoRef.current
    if (!video) return
    video.defaultMuted = true
    video.muted = true
    void video.play().then(() => setVideoActive(true)).catch(() => setUsePosterOnly(true))
  }, [])

  useEffect(() => {
    if (!videoSrc) return
    startPlayback()
  }, [videoSrc, startPlayback])

  const sizes =
    size === 'hero'
      ? '(max-width: 76rem) 100vw, 76rem'
      : size === 'metric'
        ? '(max-width: 640px) 50vw, 25vw'
        : '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw'

  return (
    <article
      className={cn(
        'pitch-media-tile relative w-full overflow-hidden rounded-[var(--pitch-radius,var(--calm-radius-card,8px))]',
        'border border-white/[0.05] bg-[#0D0D0D] shadow-[0_8px_28px_rgb(0_0_0/0.14)]',
        size === 'hero' && 'h-full min-h-0',
        className
      )}
    >
      <div className={cn('relative w-full', FRAME_CLASS[size])}>
        <div className="absolute inset-0">
          {!videoSrc || usePosterOnly ? (
            <Image
              src={image}
              alt={imageAlt}
              fill
              priority={priority}
              sizes={sizes}
              className="object-cover object-center brightness-[0.55] saturate-[0.9]"
            />
          ) : null}

          {videoSrc && !usePosterOnly ? (
            <video
              ref={videoRef}
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
              aria-label={imageAlt}
              onCanPlay={() => {
                setVideoActive(true)
                startPlayback()
              }}
              onError={() => setUsePosterOnly(true)}
              className={cn(
                'absolute inset-0 z-[1] h-full w-full object-cover transition-opacity duration-700',
                videoActive ? 'opacity-100' : 'opacity-0'
              )}
            >
              <source src={videoSrc} type="video/mp4" />
            </video>
          ) : null}
        </div>

        <div
          className="pointer-events-none absolute inset-0 z-[2] opacity-[0.35]"
          style={{ background: PITCH_TILE_TINT_GRADIENT }}
          aria-hidden
        />
        <div className="pointer-events-none absolute inset-0 z-[2] bg-[#0D0D0D]/30" aria-hidden />
        <div
          className="pointer-events-none absolute inset-0 z-[2] bg-gradient-to-b from-[#0D0D0D]/10 via-[#080808]/35 to-[#080808]/70"
          aria-hidden
        />

        {children ? (
          <div
            className={cn(
              'absolute inset-0 z-[3] flex flex-col justify-end',
              size === 'metric'
                ? 'px-3.5 pb-3.5 pt-10 sm:px-4 sm:pb-4 md:px-5 md:pb-5'
                : 'px-4 pb-4 pt-12 sm:px-5 sm:pb-5 sm:pt-14 md:px-7 md:pb-7 md:pt-16'
            )}
          >
            {children}
          </div>
        ) : null}

        {size === 'hero' ? (
          <div
            className="pointer-events-none absolute inset-0 z-[4] rounded-[var(--pitch-radius,var(--calm-radius-card,8px))] ring-1 ring-white/[0.07]"
            style={{ boxShadow: 'inset 0 1px 0 rgb(255 255 255 / 0.1)' }}
            aria-hidden
          />
        ) : null}
      </div>
    </article>
  )
}
