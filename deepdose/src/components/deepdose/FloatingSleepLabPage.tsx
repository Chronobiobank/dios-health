'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useCallback, useEffect, useRef, useState } from 'react'

import { DeepdoseWordmark } from '@/components/brand/DeepdoseWordmark'
import { DeepDoseShell } from '@/components/deepdose/DeepDoseShell'
import { SleepLabFeatureIcon } from '@/components/deepdose/SleepLabFeatureIcon'
import {
  SLEEPLAB_COMMERCIAL,
  SLEEPLAB_NETWORK_CTA,
  SLEEPLAB_SCENES,
  SLEEPLAB_STAY_OFFERS,
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
  quality = 85,
}: {
  media: Extract<(typeof SLEEPLAB_SCENES)[number], { media: unknown }>['media']
  objectPosition?: string
  priority?: boolean
  quality?: number
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
      quality={quality}
      priority={priority}
      className="dark-sleeplab__media dark-sleeplab__media--img"
      style={{ objectPosition: objectPosition ?? 'center center' }}
    />
  )
}

function OffersTicker() {
  /** One half of the loop — duplicated so -50% translate is seamless */
  const half = Array.from({ length: 5 }, () => [...SLEEPLAB_COMMERCIAL.offers]).flat()
  const track = [...half, ...half]

  return (
    <div className="dark-sleeplab__ticker" aria-label={SLEEPLAB_COMMERCIAL.line}>
      <div className="dark-sleeplab__ticker-track" aria-hidden>
        {track.map((offer, i) => (
          <span key={`${offer}-${i}`} className="dark-sleeplab__ticker-item">
            <span className="dark-sleeplab__ticker-offer">{offer}</span>
            <span className="dark-sleeplab__ticker-sep" aria-hidden>
              ·
            </span>
          </span>
        ))}
      </div>
    </div>
  )
}

/** Brand · Statement · Day I–III · Includes · Inspired · CTA. */
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
                aria-labelledby="sleeplab-brand-outcome"
              >
                <SceneMedia media={scene.media} priority={index === 0} />
                <div className="dark-sleeplab__grade" aria-hidden />
                <div className="dark-sleeplab__scrim dark-sleeplab__scrim--luxury" aria-hidden />
                <div className="dark-sleeplab__brand">
                  <DeepdoseWordmark className="dark-sleeplab__wordmark" />
                  <h1 id="sleeplab-brand-outcome" className="dark-sleeplab__outcome">
                    {scene.outcome}
                  </h1>
                </div>
              </section>
            )
          }

          if (scene.kind === 'statement') {
            return (
              <section
                key={scene.id}
                className="dark-sleeplab__scene dark-sleeplab__scene--statement"
                aria-labelledby={`sleeplab-${scene.id}`}
              >
                <SceneMedia media={scene.media} />
                <div className="dark-sleeplab__scrim dark-sleeplab__scrim--statement" aria-hidden />
                <div className="dark-sleeplab__statement">
                  <h2
                    id={`sleeplab-${scene.id}`}
                    className="dark-sleeplab__statement-body"
                    aria-label={scene.body}
                  >
                    <span className="dark-sleeplab__statement-lead">{scene.lead}</span>{' '}
                    <span className="dark-sleeplab__statement-rest">{scene.rest}</span>
                  </h2>
                </div>
              </section>
            )
          }

          if (scene.kind === 'benefit') {
            return (
              <section
                key={scene.id}
                id={`sleeplab-scene-${scene.id}`}
                className={cn(
                  'dark-sleeplab__scene dark-sleeplab__scene--benefit',
                  scene.id === 'diagnose' && 'dark-sleeplab__scene--media-zoom',
                  scene.id === 'optimise' && 'dark-sleeplab__scene--day-ii',
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
                  <h2 id={`sleeplab-${scene.id}`} className="dark-sleeplab__eyebrow">
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
                  <h2 id={`sleeplab-${scene.id}`} className="dark-sleeplab__eyebrow">
                    {scene.label}
                  </h2>
                  <ul className="dark-sleeplab__includes-list">
                    {scene.items.map((item) => (
                      <li key={item.title}>
                        <div className="dark-sleeplab__includes-head">
                          <SleepLabFeatureIcon name={item.icon} />
                          <span className="dark-sleeplab__includes-title">{item.title}</span>
                        </div>
                        <span className="dark-sleeplab__includes-body">{item.body}</span>
                      </li>
                    ))}
                  </ul>
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
                <SceneMedia
                  media={scene.media}
                  objectPosition="center 22%"
                  quality={95}
                />
                <div className="dark-sleeplab__scrim dark-sleeplab__scrim--inspired" aria-hidden />
                <div className="dark-sleeplab__inspired">
                  <p className="dark-sleeplab__eyebrow">{scene.label}</p>
                  <h2 id={`sleeplab-${scene.id}`} className="dark-sleeplab__inspired-name">
                    {scene.name}
                  </h2>
                  <p className="dark-sleeplab__inspired-body">{scene.body}</p>
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
                <div className="dark-sleeplab__offer-row">
                  {SLEEPLAB_STAY_OFFERS.map((offer) => (
                    <a
                      key={offer.label}
                      href={offer.href}
                      className="dark-sleeplab__offer"
                      aria-label={offer.label}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <span className="dark-sleeplab__offer-line">{offer.lines[0]}</span>
                      <span className="dark-sleeplab__offer-line dark-sleeplab__offer-line--strong">
                        {offer.lines[1]}
                      </span>
                    </a>
                  ))}
                </div>
                <Link href={SLEEPLAB_NETWORK_CTA.href} className="dark-sleeplab__cta dark-sleeplab__cta--ghost">
                  {SLEEPLAB_NETWORK_CTA.label}
                </Link>
              </div>
            </section>
          )
        })}
      </article>
    </DeepDoseShell>
  )
}
