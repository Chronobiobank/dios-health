'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'

import { DIOS_DASHBOARD_WELCOME_KEY } from '@/lib/auth/onboarding-bridge'
import {
  returnVisitBaselineCopy,
  type FeedFreshness,
} from '@/lib/retinomic/feed-retention'
import { PITCH_IMAGES } from '@/lib/pitch/landing-images'
import type { BaselineScanSummary } from '@/lib/retinomic/baseline-scan-summary'
import { cn } from '@/lib/utils'

type BaselineScanPanelProps = {
  baseline: BaselineScanSummary
  firstName: string
  isReturnVisit?: boolean
  feedFreshness?: FeedFreshness
}

export function BaselineScanPanel({
  baseline,
  firstName,
  isReturnVisit = false,
  feedFreshness = 'none',
}: BaselineScanPanelProps) {
  const [isWelcome, setIsWelcome] = useState(false)

  useEffect(() => {
    if (sessionStorage.getItem(DIOS_DASHBOARD_WELCOME_KEY)) {
      setIsWelcome(true)
      sessionStorage.removeItem(DIOS_DASHBOARD_WELCOME_KEY)
    }
  }, [])

  const returnCopy =
    isReturnVisit && !isWelcome
      ? returnVisitBaselineCopy(firstName, feedFreshness)
      : null

  return (
    <section
      className={cn(
        'dios-glass-outer retinomic-panel retinomic-panel--baseline',
        isWelcome && 'retinomic-panel--baseline-welcome'
      )}
      aria-labelledby="baseline-panel-title"
    >
      <div className="retinomic-baseline__layout">
        <div className="retinomic-baseline__media dios-glass-inner relative min-h-[7.5rem] overflow-hidden sm:min-h-[9rem]">
          <Image
            src={PITCH_IMAGES.hook}
            alt="Your retinomic eye scan baseline"
            fill
            sizes="(max-width: 768px) 100vw, 18rem"
            className="object-cover object-center"
          />
          <div className="retinomic-baseline__scrim pointer-events-none absolute inset-0" aria-hidden />
        </div>

        <div className="retinomic-baseline__copy min-w-0 flex-1">
          <p id="baseline-panel-title" className="type-pitch-eyebrow">
            {isWelcome ? 'Baseline saved' : returnCopy?.eyebrow ?? 'Your eye baseline'}
          </p>
          <h2 className="type-pitch-title mt-2 text-[length:var(--text-heading-section)]">
            {isWelcome
              ? `${firstName}, your dose window is anchored.`
              : returnCopy?.title ?? 'Retinomic scan on file'}
          </h2>
          <p className="type-body mt-2 text-sm leading-relaxed text-[var(--text-secondary)]">
            {isWelcome
              ? 'Light and eye signals from onboarding are live below. Blood and sleep panels unlock if DIOS flags elevated risk.'
              : returnCopy?.body ??
                'Your phone eye scan sets the light dose ceiling and personal timing anchor for today’s panels.'}
          </p>

          <dl className="retinomic-baseline__stats mt-4 grid grid-cols-2 gap-x-4 gap-y-3 sm:grid-cols-3">
            <div>
              <dt className="font-mono text-[10px] uppercase tracking-widest text-black/45">Iris</dt>
              <dd className="mt-0.5 text-sm font-medium text-[var(--text-primary)]">
                {baseline.irisPigment === 'LIGHT' ? 'Light pigment' : 'Dark pigment'}
              </dd>
            </div>
            <div>
              <dt className="font-mono text-[10px] uppercase tracking-widest text-black/45">Skin ITA</dt>
              <dd className="mt-0.5 text-sm font-medium text-[var(--text-primary)]">{baseline.skinITA}°</dd>
            </div>
            <div>
              <dt className="font-mono text-[10px] uppercase tracking-widest text-black/45">Fitzpatrick</dt>
              <dd className="mt-0.5 text-sm font-medium text-[var(--text-primary)]">
                Type {baseline.fitzpatrickRoman}
              </dd>
            </div>
            <div className="col-span-2 sm:col-span-1">
              <dt className="font-mono text-[10px] uppercase tracking-widest text-black/45">Location</dt>
              <dd className="mt-0.5 text-sm font-medium text-[var(--text-primary)]">{baseline.locationLabel}</dd>
            </div>
            {baseline.solarZenithDegrees != null ? (
              <div>
                <dt className="font-mono text-[10px] uppercase tracking-widest text-black/45">Solar zenith</dt>
                <dd className="mt-0.5 text-sm font-medium text-[var(--text-primary)]">
                  {Math.round(baseline.solarZenithDegrees)}°
                </dd>
              </div>
            ) : null}
          </dl>

          <p className="calm-auth-muted mt-4 font-mono text-[10px]">
            {baseline.lat.toFixed(2)}, {baseline.lng.toFixed(2)} · dose intelligence anchor
          </p>

          {isWelcome ? (
            <Link href="/onboarding" className="calm-auth-link mt-3 inline-block text-xs">
              Rescan eye baseline
            </Link>
          ) : null}
        </div>
      </div>
    </section>
  )
}
