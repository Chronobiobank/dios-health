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
  /** Only paint the <video> while it is actually playing — paused videos show iOS play chrome. */
  const [playing, setPlaying] = useState(false)
  const reduceMotion = usePrefersReducedMotion()

  const armInlinePlayback = useCallback((el: HTMLVideoElement) => {
    el.defaultMuted = true
    el.muted = true
    el.volume = 0
    el.setAttribute('muted', '')
    el.playsInline = true
    el.setAttribute('playsinline', 'true')
    el.setAttribute('webkit-playsinline', 'true')
    el.setAttribute('x-webkit-airplay', 'deny')
    el.disablePictureInPicture = true
    el.controls = false
  }, [])

  const tryPlay = useCallback(() => {
    const el = videoRef.current
    if (!el || reduceMotion) return
    armInlinePlayback(el)
    el.playbackRate = playbackRate
    void el.play().then(() => setPlaying(true)).catch(() => setPlaying(false))
  }, [armInlinePlayback, playbackRate, reduceMotion])

  useEffect(() => {
    const el = videoRef.current
    if (!el) return
    armInlinePlayback(el)

    if (reduceMotion) {
      el.pause()
      setPlaying(false)
      return
    }

    tryPlay()

    const onPlaying = () => setPlaying(true)
    const onPause = () => {
      // Loop can briefly pause — resume without flashing a paused frame (iOS play icon).
      if (document.hidden) {
        setPlaying(false)
        return
      }
      tryPlay()
    }

    el.addEventListener('playing', onPlaying)
    el.addEventListener('pause', onPause)
    el.addEventListener('loadeddata', tryPlay)
    el.addEventListener('canplay', tryPlay)

    const onGesture = () => tryPlay()
    window.addEventListener('touchstart', onGesture, { passive: true })
    window.addEventListener('click', onGesture)

    return () => {
      el.removeEventListener('playing', onPlaying)
      el.removeEventListener('pause', onPause)
      el.removeEventListener('loadeddata', tryPlay)
      el.removeEventListener('canplay', tryPlay)
      window.removeEventListener('touchstart', onGesture)
      window.removeEventListener('click', onGesture)
    }
  }, [armInlinePlayback, reduceMotion, src, tryPlay])

  return (
    <div className="dark-sleeplab__media-shell">
      <video
        ref={videoRef}
        className={cn('dark-sleeplab__media', className, playing && 'is-playing')}
        src={`${src}#t=0.001`}
        autoPlay={!reduceMotion}
        muted
        loop={!reduceMotion}
        playsInline
        controls={false}
        controlsList="nodownload nofullscreen noremoteplayback noplaybackrate"
        disablePictureInPicture
        disableRemotePlayback
        preload="auto"
        aria-label={alt}
        tabIndex={-1}
      />
    </div>
  )
}

type SceneMediaSource =
  | { type: 'image'; src: string; alt: string }
  | { type: 'video'; src: string; alt: string; playbackRate?: number }

function SceneMedia({
  media,
  objectPosition,
  priority,
  quality = 85,
}: {
  media: SceneMediaSource
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
                <SceneMedia media={scene.media} objectPosition="center center" priority={index === 0} />
                <div className="dark-sleeplab__grade" aria-hidden />
                <div className="dark-sleeplab__scrim dark-sleeplab__scrim--luxury" aria-hidden />
                <div className="dark-sleeplab__brand">
                  <DeepdoseWordmark className="dark-sleeplab__wordmark" />
                  <div className="dark-sleeplab__brand-cluster">
                    <h1 id="sleeplab-brand-head" className="dark-sleeplab__statement-body">
                      {scene.headLines.map((line, i) => (
                        <span
                          key={line}
                          className={
                            i === 0 && scene.headLines.length > 1
                              ? 'dark-sleeplab__statement-lead'
                              : 'dark-sleeplab__statement-rest'
                          }
                        >
                          {line}
                        </span>
                      ))}
                    </h1>
                    <p className="dark-sleeplab__brand-sub">{scene.sub}</p>
                    <div className="dark-sleeplab__cta-stage">
                      <Link href={scene.primary.href} className="dark-sleeplab__cta dark-sleeplab__cta--solid">
                        {scene.primary.label}
                      </Link>
                      <a href={scene.secondary.href} className="dark-sleeplab__cta dark-sleeplab__cta--ghost">
                        {scene.secondary.label}
                      </a>
                    </div>
                  </div>
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
                {'media' in scene && scene.media ? (
                  <>
                    <SceneMedia media={scene.media} objectPosition="center 20%" />
                    <div className="dark-sleeplab__scrim dark-sleeplab__scrim--centre" aria-hidden />
                  </>
                ) : null}
                <div className="dark-sleeplab__includes">
                  <h2 id={`sleeplab-${scene.id}`} className="dark-sleeplab__benefit-body">
                    {scene.label}
                  </h2>
                  {'sub' in scene && scene.sub ? (
                    <p className="dark-sleeplab__includes-title">{scene.sub}</p>
                  ) : null}
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
              aria-labelledby="sleeplab-network-head"
            >
              <SceneMedia media={scene.media} />
              <div className="dark-sleeplab__scrim dark-sleeplab__scrim--centre" aria-hidden />
              <div className="dark-sleeplab__cta-stage">
                <h2 id="sleeplab-network-head" className="dark-sleeplab__network-head">
                  {SLEEPLAB_NETWORK_CTA.head}
                </h2>
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
