'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useCallback, useEffect, useRef, useState } from 'react'

import { DeepdoseWordmark } from '@/components/brand/DeepdoseWordmark'
import { DeepDoseShell } from '@/components/deepdose/DeepDoseShell'
import {
  SLEEPLAB_COMMERCIAL,
  SLEEPLAB_CTAS,
  SLEEPLAB_SCENES,
} from '@/lib/deepdose-marketing/sleeplab-content'
import { usePrefersReducedMotion } from '@/lib/react/use-prefers-reduced-motion'
import { cn } from '@/lib/utils/cn'

import '@/styles/deepdose-sleeplab.css'

function ChamberVideo({
  src,
  alt,
  playbackRate = 0.35,
  className,
}: {
  src: string
  alt: string
  playbackRate?: number
  className?: string
  priority?: boolean
}) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [ready, setReady] = useState(false)
  const reduceMotion = usePrefersReducedMotion()

  const reveal = useCallback(() => setReady(true), [])

  const start = useCallback(() => {
    const el = videoRef.current
    if (!el) return
    if (el.readyState >= 2) reveal()
    if (reduceMotion) {
      el.pause()
      reveal()
      return
    }
    el.muted = true
    el.playbackRate = playbackRate
    void el.play().then(reveal).catch(reveal)
  }, [playbackRate, reduceMotion, reveal])

  useEffect(() => {
    start()
  }, [start])

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
      onLoadedData={start}
      onCanPlay={start}
      onPlaying={reveal}
    >
      <source src={src} type="video/mp4" />
    </video>
  )
}

function SceneMedia({
  media,
  objectPosition,
  priority,
}: {
  media: Extract<(typeof SLEEPLAB_SCENES)[number], { media: unknown }>['media']
  objectPosition?: string
  priority?: boolean
}) {
  if (media.type === 'video') {
    return (
      <ChamberVideo
        src={media.src}
        alt={media.alt}
        playbackRate={media.playbackRate}
        className="dark-sleeplab__media"
        priority={priority}
      />
    )
  }

  return (
    <Image
      src={media.src}
      alt={media.alt}
      fill
      sizes="100vw"
      priority={priority}
      className="dark-sleeplab__media dark-sleeplab__media--img"
      style={{ objectPosition: objectPosition ?? 'center center' }}
    />
  )
}

function BookFloatLink({ className }: { className?: string }) {
  const book = SLEEPLAB_CTAS[0]
  return (
    <a
      href={book.href}
      className={cn('dark-sleeplab__cta dark-sleeplab__cta--solid', className)}
      target="_blank"
      rel="noopener noreferrer"
    >
      {book.label}
    </a>
  )
}

function PlaceLine({
  className,
  onMedia = false,
  children = SLEEPLAB_COMMERCIAL.place,
}: {
  className?: string
  onMedia?: boolean
  children?: string
}) {
  return (
    <p
      className={cn(
        'dark-sleeplab__place',
        onMedia && 'dark-sleeplab__place--on-media',
        className,
      )}
    >
      {children}
    </p>
  )
}

function OffersTicker() {
  const sequence = Array.from({ length: 8 }, () => [...SLEEPLAB_COMMERCIAL.offers]).flat()
  const track = [...sequence, ...sequence]

  return (
    <div className="dark-sleeplab__ticker" aria-label={SLEEPLAB_COMMERCIAL.line}>
      <div className="dark-sleeplab__ticker-track" aria-hidden>
        {track.map((offer, i) => (
          <span key={`${offer}-${i}`} className="dark-sleeplab__ticker-item">
            <span className="dark-sleeplab__ticker-offer">{offer}</span>
            <span className="dark-sleeplab__ticker-sep">·</span>
          </span>
        ))}
      </div>
    </div>
  )
}

/** Brand · Day I–III · Includes · Inspired · CTA. */
export function FloatingSleepLabPage() {
  return (
    <DeepDoseShell variant="dark" className="dark-sleeplab" nav={null}>
      <OffersTicker />
      <article className="dark-sleeplab__page">
        {SLEEPLAB_SCENES.map((scene, index) => {
          if (scene.kind === 'brand') {
            return (
              <section
                key={scene.id}
                className="dark-sleeplab__scene dark-sleeplab__scene--brand"
                aria-label={scene.headline}
              >
                <SceneMedia media={scene.media} priority={index === 0} />
                <div className="dark-sleeplab__grade" aria-hidden />
                <div className="dark-sleeplab__scrim dark-sleeplab__scrim--luxury" aria-hidden />
                <div className="dark-sleeplab__brand">
                  <div className="dark-sleeplab__brand-top">
                    <DeepdoseWordmark className="dark-sleeplab__wordmark" />
                  </div>
                  <div className="dark-sleeplab__brand-centre">
                    <h1 className="dark-sleeplab__brand-headline">{scene.headline}</h1>
                    <p className="dark-sleeplab__outcome">{scene.outcome}</p>
                  </div>
                  <div className="dark-sleeplab__brand-foot">
                    <BookFloatLink />
                    <PlaceLine />
                  </div>
                </div>
              </section>
            )
          }

          if (scene.kind === 'benefit') {
            return (
              <section
                key={scene.id}
                className={cn(
                  'dark-sleeplab__scene dark-sleeplab__scene--benefit',
                  scene.id === 'diagnose' && 'dark-sleeplab__scene--media-zoom',
                  scene.id === 'perform' && 'dark-sleeplab__scene--day-iii',
                )}
                aria-labelledby={`sleeplab-${scene.id}`}
              >
                <SceneMedia
                  media={scene.media}
                  objectPosition={
                    'objectPosition' in scene && typeof scene.objectPosition === 'string'
                      ? scene.objectPosition
                      : undefined
                  }
                />
                <div
                  className={cn(
                    'dark-sleeplab__scrim',
                    scene.id === 'diagnose' && 'dark-sleeplab__scrim--day-i',
                  )}
                  aria-hidden
                />
                <div className="dark-sleeplab__benefit">
                  <h2 id={`sleeplab-${scene.id}`} className="dark-sleeplab__benefit-label">
                    {scene.label}
                  </h2>
                  <p className="dark-sleeplab__benefit-body">{scene.body}</p>
                </div>
              </section>
            )
          }

          if (scene.kind === 'includes') {
            return (
              <section
                key={scene.id}
                className="dark-sleeplab__scene dark-sleeplab__scene--includes"
                aria-labelledby={`sleeplab-${scene.id}`}
              >
                <div className="dark-sleeplab__includes">
                  <h2 id={`sleeplab-${scene.id}`} className="dark-sleeplab__includes-label">
                    {scene.label}
                  </h2>
                  <ul className="dark-sleeplab__includes-list">
                    {scene.items.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                  <BookFloatLink className="dark-sleeplab__includes-cta" />
                </div>
              </section>
            )
          }

          if (scene.kind === 'inspired') {
            return (
              <section
                key={scene.id}
                className="dark-sleeplab__scene dark-sleeplab__scene--inspired"
                aria-labelledby={`sleeplab-${scene.id}`}
              >
                <div className="dark-sleeplab__inspired">
                  <p className="dark-sleeplab__inspired-label">{scene.label}</p>
                  <h2 id={`sleeplab-${scene.id}`} className="dark-sleeplab__inspired-name">
                    {scene.name}
                  </h2>
                  <p className="dark-sleeplab__inspired-role">{scene.role}</p>
                  <p className="dark-sleeplab__inspired-body">{scene.body}</p>
                  <a
                    href={scene.href}
                    className="dark-sleeplab__inspired-link"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {scene.linkLabel}
                  </a>
                </div>
              </section>
            )
          }

          return (
            <section
              key={scene.id}
              className="dark-sleeplab__scene dark-sleeplab__scene--cta dark-sleeplab__scene--media-zoom"
              aria-label="Book the Sleep Lab"
            >
              <SceneMedia media={scene.media} />
              <div className="dark-sleeplab__scrim dark-sleeplab__scrim--centre" aria-hidden />
              <div className="dark-sleeplab__cta-stage">
                <div className="dark-sleeplab__cta-actions">
                  <BookFloatLink />
                  <Link
                    href={SLEEPLAB_CTAS[1].href}
                    className="dark-sleeplab__cta dark-sleeplab__cta--ghost"
                  >
                    {SLEEPLAB_CTAS[1].label}
                  </Link>
                </div>
                <PlaceLine onMedia>{SLEEPLAB_COMMERCIAL.ctaLine}</PlaceLine>
              </div>
            </section>
          )
        })}
      </article>
    </DeepDoseShell>
  )
}
