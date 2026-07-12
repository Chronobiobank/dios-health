'use client'

import Image from 'next/image'
import { useCallback, useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react'

import { MARKETING_SCENE_TILE_CLASS } from '@/lib/design/marketing-system'
import { usePrefersReducedMotion } from '@/lib/react/use-prefers-reduced-motion'
import { cn } from '@/lib/utils/cn'

type SceneImage = { type?: 'image'; src: string; alt: string }
type SceneVideo = { type: 'video'; src: string; alt: string; playbackRate?: number }

type MarketingSceneTileProps = {
  image: SceneImage | SceneVideo
  /** CSS object-position for the media crop */
  objectPosition?: string
  /** No border / radius / shadow — media as open background, not a card */
  flush?: boolean
  /** Soft dark grade over the media — off when the video should stay full color */
  scrim?: boolean
  className?: string
  children: ReactNode
}

function SceneVideo({
  src,
  alt,
  playbackRate = 0.35,
  className,
}: {
  src: string
  alt: string
  playbackRate?: number
  className?: string
}) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [ready, setReady] = useState(false)
  const reduceMotion = usePrefersReducedMotion()

  const startPlayback = useCallback(() => {
    const el = videoRef.current
    if (!el || reduceMotion) return
    el.muted = true
    el.playbackRate = playbackRate
    void el.play().then(() => setReady(true))
  }, [playbackRate, reduceMotion])

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
    <video
      ref={videoRef}
      className={cn(className, (ready || reduceMotion) && 'is-ready')}
      autoPlay={!reduceMotion}
      muted
      loop={!reduceMotion}
      playsInline
      preload="auto"
      aria-label={alt}
      onLoadedData={() => {
        const el = videoRef.current
        if (el) el.playbackRate = playbackRate
        setReady(true)
      }}
      onCanPlay={() => {
        const el = videoRef.current
        if (el) el.playbackRate = playbackRate
        setReady(true)
        startPlayback()
      }}
      onRateChange={() => {
        const el = videoRef.current
        if (el && el.playbackRate !== playbackRate) el.playbackRate = playbackRate
      }}
    >
      <source src={src} type="video/mp4" />
    </video>
  )
}

/**
 * Scene tile — image or looping video fills the card; children (e.g. How loop) layer on top.
 * Use `flush` only when you want the media without card chrome.
 */
export function MarketingSceneTile({
  image,
  objectPosition = 'center center',
  flush = false,
  scrim = true,
  className,
  children,
}: MarketingSceneTileProps) {
  const isVideo = image.type === 'video'

  return (
    <article
      className={cn(
        MARKETING_SCENE_TILE_CLASS,
        flush && 'seco-marketing-scene-tile--flush',
        className,
      )}
      style={{ '--scene-img-pos': objectPosition } as CSSProperties}
    >
      {isVideo ? (
        <SceneVideo
          src={image.src}
          alt={image.alt}
          playbackRate={image.playbackRate}
          className="seco-marketing-scene-tile__img seco-marketing-scene-tile__video"
        />
      ) : (
        <Image
          src={image.src}
          alt={image.alt}
          fill
          sizes="(min-width: 640px) 26rem, 100vw"
          className="seco-marketing-scene-tile__img"
          priority
        />
      )}
      {scrim ? <div className="seco-marketing-scene-tile__scrim" aria-hidden /> : null}
      <div className="seco-marketing-scene-tile__stage">{children}</div>
    </article>
  )
}
