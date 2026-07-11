'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

import { usePrefersReducedMotion } from '@/lib/react/use-prefers-reduced-motion'
import { cn } from '@/lib/utils/cn'

type PlaneTileVideoBackgroundProps = {
  src: string
}

/** Muted looping fill video for marketing plane tiles (e.g. Mission “How matching works”). */
export function PlaneTileVideoBackground({ src }: PlaneTileVideoBackgroundProps) {
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
    <>
      <video
        ref={videoRef}
        className={cn(
          'seco-chronobiobank__plane-visual__video',
          (videoReady || reduceMotion) && 'is-ready',
        )}
        autoPlay={!reduceMotion}
        muted
        loop={!reduceMotion}
        playsInline
        preload="auto"
        aria-hidden
        onLoadedData={() => setVideoReady(true)}
        onCanPlay={() => {
          setVideoReady(true)
          startPlayback()
        }}
      >
        <source src={src} type="video/mp4" />
      </video>
      <div className="seco-chronobiobank__plane-visual__scrim" aria-hidden />
    </>
  )
}
