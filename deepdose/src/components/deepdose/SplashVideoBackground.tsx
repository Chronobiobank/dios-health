'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

import { cn } from '@/lib/utils/cn'

const SPLASH_VIDEO_SRC = '/first-light.mp4'

export function SplashVideoBackground() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [videoReady, setVideoReady] = useState(false)
  const [reduceMotion, setReduceMotion] = useState(false)

  const startPlayback = useCallback(() => {
    const el = videoRef.current
    if (!el || reduceMotion) return
    el.muted = true
    void el.play().then(() => setVideoReady(true))
  }, [reduceMotion])

  useEffect(() => {
    const prefersReduced =
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    setReduceMotion(prefersReduced)
    if (prefersReduced) {
      const el = videoRef.current
      if (el) {
        el.pause()
        el.currentTime = 0
        setVideoReady(true)
      }
      return
    }
    startPlayback()
  }, [startPlayback])

  return (
    <div className="seco-splash__media" aria-hidden>
      <video
        ref={videoRef}
        className={cn('seco-splash__video', videoReady && 'is-ready')}
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
