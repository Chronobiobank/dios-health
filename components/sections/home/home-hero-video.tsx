'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

import { HOME_HERO } from '@/lib/pitch/home-landing-content'
import { cn } from '@/lib/utils'

export function HomeHeroVideo() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [ready, setReady] = useState(false)
  const [staticOnly, setStaticOnly] = useState(false)

  const startPlayback = useCallback(() => {
    const el = videoRef.current
    if (!el || staticOnly) return
    el.defaultMuted = true
    el.muted = true
    void el.play()
      .then(() => setReady(true))
      .catch(() => setStaticOnly(true))
  }, [staticOnly])

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setStaticOnly(true)
      return
    }
    startPlayback()
  }, [startPlayback])

  if (staticOnly) {
    return (
      <div className="home-landing__hero-media">
        <div className="home-landing__hero-video home-landing__hero-video--static" aria-hidden />
      </div>
    )
  }

  return (
    <div className="home-landing__hero-media">
      <video
        ref={videoRef}
        className={cn('home-landing__hero-video', ready && 'is-ready')}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        poster={HOME_HERO.poster}
        aria-hidden
        onCanPlay={() => {
          setReady(true)
          startPlayback()
        }}
        onError={() => setStaticOnly(true)}
      >
        <source src={HOME_HERO.video} type="video/mp4" />
      </video>
    </div>
  )
}
