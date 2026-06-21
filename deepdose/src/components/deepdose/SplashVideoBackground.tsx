'use client'

import Image from 'next/image'
import { useCallback, useEffect, useRef, useState } from 'react'

import { marketingImages } from '@/lib/marketing/images'
import { cn } from '@/lib/utils/cn'

const SPLASH_VIDEO_SRC = '/first-light.mp4'
const SPLASH_POSTER = marketingImages.hero.src

export function SplashVideoBackground() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [videoReady, setVideoReady] = useState(false)
  const [posterOnly, setPosterOnly] = useState(false)

  const startPlayback = useCallback(() => {
    const el = videoRef.current
    if (!el || posterOnly) return
    el.muted = true
    void el
      .play()
      .then(() => setVideoReady(true))
      .catch(() => setPosterOnly(true))
  }, [posterOnly])

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setPosterOnly(true)
      return
    }
    startPlayback()
  }, [startPlayback])

  return (
    <div className="seco-splash__media" aria-hidden>
      {posterOnly ? (
        <Image
          src={SPLASH_POSTER}
          alt=""
          fill
          sizes="100vw"
          className="seco-splash__poster"
          priority
        />
      ) : (
        <video
          ref={videoRef}
          className={cn('seco-splash__video', videoReady && 'is-ready')}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster={SPLASH_POSTER}
          onCanPlay={() => {
            setVideoReady(true)
            startPlayback()
          }}
          onError={() => setPosterOnly(true)}
        >
          <source src={SPLASH_VIDEO_SRC} type="video/mp4" />
        </video>
      )}
      <div className="seco-splash__scrim" />
    </div>
  )
}
