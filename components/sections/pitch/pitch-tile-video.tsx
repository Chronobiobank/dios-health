'use client'

import { useEffect, useRef, useState } from 'react'

import { cn } from '@/lib/utils'

type PitchTileVideoProps = {
  src: string
  poster: string
  className?: string
  /** Accessible label when video is decorative inside a tile with visible headline nearby */
  ariaLabel?: string
}

/** Looping video contained inside a pitch glow tile (not full-bleed). */
export function PitchTileVideo({ src, poster, className, ariaLabel }: PitchTileVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [reducedMotion, setReducedMotion] = useState(false)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setReducedMotion(media.matches)
    update()
    media.addEventListener('change', update)
    return () => media.removeEventListener('change', update)
  }, [])

  useEffect(() => {
    const video = videoRef.current
    if (!video || reducedMotion) return
    video.load()
    void video.play().catch(() => {
      /* Autoplay blocked — keep poster frame visible */
    })
  }, [reducedMotion, src])

  const showPosterOnly = reducedMotion || failed

  return (
    <div className={cn('pitch-tile-video relative h-full min-h-[200px] w-full', className)}>
      {showPosterOnly ? (
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${poster})` }}
          role={ariaLabel ? 'img' : undefined}
          aria-label={ariaLabel}
        />
      ) : (
        <video
          ref={videoRef}
          className="absolute inset-0 h-full w-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          poster={poster}
          src={src}
          aria-label={ariaLabel}
          onError={() => setFailed(true)}
          onLoadedData={(e) => {
            void e.currentTarget.play().catch(() => {})
          }}
        />
      )}
    </div>
  )
}
