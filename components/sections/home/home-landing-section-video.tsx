'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

import { cn } from '@/lib/utils'

type HomeLandingSectionVideoProps = {
  video: string
  poster: string
  mediaClassName?: string
  videoClassName?: string
}

export function HomeLandingSectionVideo({
  video,
  poster,
  mediaClassName = 'home-landing__hero-media',
  videoClassName = 'home-landing__hero-video',
}: HomeLandingSectionVideoProps) {
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
      <div className={mediaClassName}>
        <div
          className={cn(videoClassName, 'home-landing__hero-video--static')}
          style={{
            backgroundImage: `url(${poster})`,
            backgroundPosition: 'center',
            backgroundSize: 'cover',
          }}
          aria-hidden
        />
      </div>
    )
  }

  return (
    <div className={mediaClassName}>
      <video
        ref={videoRef}
        className={cn(videoClassName, ready && 'is-ready')}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        poster={poster}
        aria-hidden
        onCanPlay={() => {
          setReady(true)
          startPlayback()
        }}
        onError={() => setStaticOnly(true)}
      >
        <source src={video} type="video/mp4" />
      </video>
    </div>
  )
}
