'use client'

import Image from 'next/image'
import { useCallback, useEffect, useRef, useState } from 'react'

import type { KawasakiSlideMedia } from '@/lib/pitch/marketing-landing-content'
import { cn } from '@/lib/utils'

type MarketingSlideBackgroundProps = {
  media: KawasakiSlideMedia
}

export function MarketingSlideBackground({ media }: MarketingSlideBackgroundProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [videoReady, setVideoReady] = useState(false)
  const [posterOnly, setPosterOnly] = useState(!media.video)

  const startPlayback = useCallback(() => {
    const el = videoRef.current
    if (!el || posterOnly) return
    el.defaultMuted = true
    el.muted = true
    void el.play()
      .then(() => setVideoReady(true))
      .catch(() => setPosterOnly(true))
  }, [posterOnly])

  useEffect(() => {
    if (!media.video) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setPosterOnly(true)
      return
    }
    startPlayback()
  }, [media.video, startPlayback])

  return (
    <div className="kz-s__bg" aria-hidden>
      {posterOnly ? (
        <Image
          src={media.image}
          alt=""
          fill
          sizes="100vw"
          className="kz-s__bg-image"
          priority={media.priority}
        />
      ) : (
        <video
          ref={videoRef}
          className={cn('kz-s__bg-video', videoReady && 'is-ready')}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster={media.image}
          onCanPlay={() => {
            setVideoReady(true)
            startPlayback()
          }}
          onError={() => setPosterOnly(true)}
        >
          <source src={media.video} type="video/mp4" />
        </video>
      )}
      <div className={cn('kz-s__scrim', `kz-s__scrim--${media.scrim}`)} />
    </div>
  )
}
