'use client'

import Image from 'next/image'
import { useCallback, useEffect, useRef, useState } from 'react'

import { cn } from '@/lib/utils'

type HeroBackgroundProps = {
  poster: string
  video: string
  alt: string
}

export function HeroBackground({ poster, video, alt }: HeroBackgroundProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [videoActive, setVideoActive] = useState(false)
  const [usePosterOnly, setUsePosterOnly] = useState(false)

  const startPlayback = useCallback(() => {
    const el = videoRef.current
    if (!el) return
    el.defaultMuted = true
    el.muted = true
    void el.play().then(() => setVideoActive(true)).catch(() => setUsePosterOnly(true))
  }, [])

  useEffect(() => {
    startPlayback()
  }, [startPlayback])

  return (
    <>
      <Image
        src={poster}
        alt={alt}
        fill
        priority
        sizes="100vw"
        className={cn(
          'pointer-events-none object-cover',
          videoActive && !usePosterOnly ? 'opacity-0' : 'opacity-100'
        )}
      />
      {!usePosterOnly ? (
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          poster={poster}
          aria-hidden
          onCanPlay={() => {
            setVideoActive(true)
            startPlayback()
          }}
          onError={() => setUsePosterOnly(true)}
          className={cn(
            'pointer-events-none absolute inset-0 z-[1] h-full w-full object-cover transition-opacity duration-700',
            videoActive ? 'opacity-100' : 'opacity-0'
          )}
        >
          <source src={video} type="video/mp4" />
        </video>
      ) : null}
    </>
  )
}
