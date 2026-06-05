'use client'

import Image from 'next/image'
import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react'

import { PITCH_TILE_TINT_GRADIENT } from '@/lib/pitch/pitch-palette'
import { cn } from '@/lib/utils'

export type PitchMediaTileSize = 'hero' | 'card' | 'metric' | 'subgrid' | 'feature'

const FRAME_CLASS: Record<PitchMediaTileSize, string> = {
  hero: 'pitch-media-tile__frame h-full min-h-0 w-full',
  card: 'min-h-[200px] aspect-[4/3] sm:min-h-[220px]',
  metric: 'min-h-[140px] aspect-square sm:min-h-[168px]',
  /** Equal cells inside pitch-feature-subgrid — height comes from the grid */
  subgrid: 'pitch-media-tile__frame h-full min-h-0 w-full',
  feature: 'min-h-[min(52dvh,420px)] aspect-[16/10] sm:min-h-[380px]',
}

/** Lighter scrims on small tiles so photography reads; hero keeps a bottom read for copy */
const TILE_SCRIM: Record<
  PitchMediaTileSize,
  { image: string; tintOpacity: string; wash: string; gradient: string }
> = {
  hero: {
    image: 'brightness-[0.78] saturate-[0.94]',
    tintOpacity: 'opacity-[0.14]',
    wash: 'bg-[#0D0D0D]/15',
    gradient: 'bg-gradient-to-b from-[#0D0D0D]/5 via-[#080808]/20 to-[#080808]/58',
  },
  feature: {
    image: 'brightness-[0.82] saturate-[0.95]',
    tintOpacity: 'opacity-[0.12]',
    wash: 'bg-[#0D0D0D]/12',
    gradient: 'bg-gradient-to-b from-transparent via-[#080808]/18 to-[#080808]/52',
  },
  card: {
    image: 'brightness-[0.85] saturate-[0.96]',
    tintOpacity: 'opacity-[0.1]',
    wash: 'bg-[#0D0D0D]/10',
    gradient: 'bg-gradient-to-b from-transparent via-[#080808]/12 to-[#080808]/48',
  },
  metric: {
    image: 'brightness-[0.88] saturate-[0.97]',
    tintOpacity: 'opacity-[0.08]',
    wash: 'bg-[#0D0D0D]/8',
    gradient: 'bg-gradient-to-b from-transparent via-[#080808]/10 to-[#080808]/45',
  },
  subgrid: {
    image: 'brightness-[0.9] saturate-[0.98]',
    tintOpacity: 'opacity-[0.06]',
    wash: 'bg-[#0D0D0D]/6',
    gradient: 'bg-gradient-to-b from-transparent via-[#080808]/8 to-[#080808]/42',
  },
}

type PitchMediaTileProps = {
  image: string
  imageAlt: string
  /** MP4 path e.g. /pills.mp4 — hero-sized tiles only */
  videoSrc?: string
  size?: PitchMediaTileSize
  priority?: boolean
  /** Bypass Next optimizer — use for pre-sized local hero assets */
  unoptimized?: boolean
  className?: string
  children?: ReactNode
}

/**
 * OpenAI calm hero tile: image or video fill, light brand tint, bottom scrim for copy.
 */
export function PitchMediaTile({
  image,
  imageAlt,
  videoSrc,
  size = 'card',
  priority = false,
  unoptimized = false,
  className,
  children,
}: PitchMediaTileProps) {
  const scrim = TILE_SCRIM[size]
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
        (size === 'hero' || size === 'subgrid') && 'h-full min-h-0',
        className
      )}
    >
      <div className={cn('relative h-full w-full', FRAME_CLASS[size])}>
        <div
          data-nav-surface="dark"
          className="pointer-events-none absolute inset-x-0 top-0 z-[6] h-[var(--dios-site-nav-height)]"
          aria-hidden
        />
        <div className="absolute inset-0">
          {!videoSrc || usePosterOnly ? (
            <Image
              src={image}
              alt={imageAlt}
              fill
              priority={priority}
              unoptimized={unoptimized}
              quality={unoptimized ? undefined : 90}
              sizes={sizes}
              className={cn('object-cover object-center', scrim.image)}
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
          className={cn('pointer-events-none absolute inset-0 z-[2]', scrim.tintOpacity)}
          style={{ background: PITCH_TILE_TINT_GRADIENT }}
          aria-hidden
        />
        <div
          className={cn('pointer-events-none absolute inset-0 z-[2]', scrim.wash)}
          aria-hidden
        />
        <div className={cn('pointer-events-none absolute inset-0 z-[2]', scrim.gradient)} aria-hidden />

        {children ? (
          <div
            className={cn(
              'absolute inset-0 z-[3] flex flex-col justify-end',
              size !== 'metric' && 'items-start',
              size === 'metric' || size === 'subgrid'
                ? 'p-3 sm:p-3.5'
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
