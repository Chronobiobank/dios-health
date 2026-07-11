'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

import { usePrefersReducedMotion } from '@/lib/react/use-prefers-reduced-motion'
import { cn } from '@/lib/utils/cn'

const SPLASH_VIDEO_SRC = '/first-light.mp4'

export function SplashVideoBackground() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [videoReady, setVideoReady] = useState(false)
  const reduceMotion = usePrefersReducedMotion()

  const startPlayback = useCallback(() => {
    const el = videoRef.current
    if (!el || reduceMotion) return
    el.muted = true
    void el.play().then(() => setVideoReady(true))
  }, [reduceMotion])

  useEffect(() => {
    if (reduceMotion) {
      const el = videoRef.current
      if (el) {
        el.pause()
        el.currentTime = 0
      }
      return
    }
    startPlayback()
  }, [reduceMotion, startPlayback])

  return (
    <div className="seco-splash__media" aria-hidden>
      <video
        ref={videoRef}
        className={cn('seco-splash__video', (videoReady || reduceMotion) && 'is-ready')}
        autoPlay={!reduceMotion}
        muted
        loop={!reduceMotion}
        playsInline
        preload="auto"
        onLoadedData={() => setVideoReady(true)}
        onCanPlay={() => {
          setVideoReady(true)
          startPlayback()
        }}
      >
        <source src={SPLASH_VIDEO_SRC} type="video/mp4" />
      </video>
      <div className="seco-splash__scrim" />
    </div>
  )
}
