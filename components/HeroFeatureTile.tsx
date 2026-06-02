'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useCallback, useEffect, useRef, useState } from 'react'

import { cn } from '@/lib/utils'

export interface HeroFeatureTileProps {
  href: string
  poster: string
  alt: string
  title: string
  meta: string
  cta?: string
  /** MP4 URL or site-relative path e.g. /hero.mp4 */
  videoSrc?: string
  className?: string
}

/**
 * openai.com hero tile — contained rounded card, centered white copy, looped background video.
 */
export function HeroFeatureTile({
  href,
  poster,
  alt,
  title,
  meta,
  cta = 'Read the story',
  videoSrc,
  className,
}: HeroFeatureTileProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [videoActive, setVideoActive] = useState(false)
  const [usePosterOnly, setUsePosterOnly] = useState(!videoSrc)

  const startPlayback = useCallback(() => {
    const video = videoRef.current
    if (!video) return
    video.defaultMuted = true
    video.muted = true
    void video.play().then(() => setVideoActive(true)).catch(() => setUsePosterOnly(true))
  }, [])

  useEffect(() => {
    if (!videoSrc) return
    startPlayback()
  }, [videoSrc, startPlayback])

  return (
    <article
      className={cn(
        'relative w-full overflow-hidden rounded-[var(--calm-radius-card,8px)] bg-[#0D0D0D]',
        className
      )}
    >
      <div className="relative aspect-[16/10] w-full min-h-[min(52vw,280px)] sm:min-h-[360px] md:min-h-[420px] lg:min-h-[480px]">
        <div className="absolute inset-0">
          {/* Poster still — visible until video plays or if video fails */}
          <Image
            src={poster}
            alt={alt}
            fill
            priority
            sizes="(max-width: 76rem) 100vw, 76rem"
            className={cn(
              'object-cover object-center transition-opacity duration-700',
              videoActive ? 'opacity-0' : 'brightness-[0.55] saturate-[0.9]'
            )}
          />

          {videoSrc && !usePosterOnly ? (
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
                'absolute inset-0 z-[1] h-full w-full object-cover transition-opacity duration-700',
                videoActive ? 'opacity-100' : 'opacity-0'
              )}
            >
              <source src={videoSrc} type="video/mp4" />
            </video>
          ) : null}
        </div>

        <div
          className="pointer-events-none absolute inset-0 z-[2] bg-[#0D0D0D]/30"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-0 z-[2] bg-gradient-to-b from-[#0D0D0D]/20 via-[#0D0D0D]/45 to-[#0D0D0D]/55"
          aria-hidden
        />

        <div className="absolute inset-0 z-[3] flex flex-col items-center justify-center px-6 py-10 text-center sm:px-12 sm:py-14">
          <h1 className="type-hero-overlay max-w-3xl text-white">{title}</h1>
          <p className="type-hero-meta mt-4 max-w-xl text-white/80">{meta}</p>
          <Link
            href={href}
            className="type-button mt-8 inline-flex items-center justify-center rounded-full bg-white px-6 py-2.5 text-black shadow-sm transition-colors hover:bg-white/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            {cta}
          </Link>
        </div>
      </div>
    </article>
  )
}
