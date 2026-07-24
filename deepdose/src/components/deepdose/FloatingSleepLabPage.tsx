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

/** Brand · How · Science · Join — existing sleeplab shells only. */
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
                aria-labelledby="sleeplab-brand-head"
              >
                <SceneMedia media={scene.media} objectPosition="center top" priority={index === 0} />
                <div className="dark-sleeplab__grade" aria-hidden />
                <div className="dark-sleeplab__scrim dark-sleeplab__scrim--luxury" aria-hidden />
                <div className="dark-sleeplab__brand">
                  <DeepdoseWordmark className="dark-sleeplab__wordmark" />
                  <h1
                    id="sleeplab-brand-head"
                    className="dark-sleeplab__statement-body"
                    aria-label={`${scene.headLines[0]} ${scene.headLines[1]}`}
                  >
                    <span className="dark-sleeplab__statement-lead">{scene.headLines[0]}</span>
                    <span className="dark-sleeplab__statement-rest">{scene.headLines[1]}</span>
                  </h1>
                  <div className="dark-sleeplab__cta-stage">
                    <Link href={scene.primary.href} className="dark-sleeplab__cta dark-sleeplab__cta--solid">
                      {scene.primary.label}
                    </Link>
                    <a href={scene.secondary.href} className="dark-sleeplab__cta dark-sleeplab__cta--ghost">
                      {scene.secondary.label}
                    </a>
                  </div>
                  <p className="dark-sleeplab__authority">{scene.place}</p>
                </div>
              </section>
            )
          }

          if (scene.kind === 'includes') {
            return (
              <section
                key={scene.id}
                id={`sleeplab-scene-${scene.id}`}
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
                <SceneMedia media={scene.media} objectPosition="center 22%" quality={95} />
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
              className="dark-sleeplab__scene dark-sleeplab__scene--cta"
              aria-label={SLEEPLAB_NETWORK_CTA.label}
            >
              <SceneMedia media={scene.media} />
              <div className="dark-sleeplab__scrim dark-sleeplab__scrim--centre" aria-hidden />
              <div className="dark-sleeplab__cta-stage">
                <Link
                  href={SLEEPLAB_NETWORK_CTA.href}
                  className="dark-sleeplab__cta dark-sleeplab__cta--solid"
                >
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
