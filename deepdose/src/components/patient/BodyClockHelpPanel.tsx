'use client'

import Link from 'next/link'

import {
  BODY_CLOCK_LAYERS,
  layerReached,
  resolveActiveBodyClockLayer,
} from '@/lib/circadian/body-clock-measurement'
import type { DlmoSource } from '@/lib/patient/dose-dash-types'
import { cn } from '@/lib/utils/cn'

type BodyClockHelpPanelProps = {
  open: boolean
  onToggle: () => void
  dlmoSource: DlmoSource | null
  tiptraqComplete: boolean
  tiptraqNights: number
}

export function BodyClockHelpPanel({
  open,
  onToggle,
  dlmoSource,
  tiptraqComplete,
  tiptraqNights,
}: BodyClockHelpPanelProps) {
  const active = resolveActiveBodyClockLayer(dlmoSource, tiptraqComplete)
  const showUpgrade = active !== 'clinical'

  return (
    <div className="body-clock-help">
      <button
        type="button"
        className="body-clock-help__trigger"
        onClick={onToggle}
        aria-expanded={open}
      >
        How this is calculated
        <span className="body-clock-help__chevron" aria-hidden>
          {open ? '−' : '+'}
        </span>
      </button>

      {open && (
        <div className="body-clock-help__panel">
          <p className="body-clock-help__lede">
            Your body-clock anchor sets when each dose cue fires. We build it in layers — each step
            sharpens timing.
          </p>

          {dlmoSource && (
            <p className="body-clock-help__current">
              <span className="font-medium text-ink">Your read today:</span> {dlmoSource.detail}
            </p>
          )}

          <ol className="body-clock-help__layers">
            {BODY_CLOCK_LAYERS.map((layer) => {
              const reached = layerReached(layer.id, active)
              const isActive = layer.id === active

              return (
                <li
                  key={layer.id}
                  className={cn(
                    'body-clock-help__layer',
                    reached && 'body-clock-help__layer--reached',
                    isActive && 'body-clock-help__layer--active'
                  )}
                >
                  <div className="body-clock-help__layer-head">
                    <span className="body-clock-help__layer-step" aria-hidden>
                      {reached ? '✓' : '○'}
                    </span>
                    <span className="body-clock-help__layer-title">{layer.title}</span>
                    {layer.badge ? (
                      <span className="body-clock-help__layer-badge">{layer.badge}</span>
                    ) : null}
                    {isActive ? (
                      <span className="body-clock-help__layer-now">Current</span>
                    ) : null}
                  </div>
                  <p className="body-clock-help__layer-body">{layer.body}</p>
                  {layer.id === 'clinical' && tiptraqNights > 0 && !tiptraqComplete && (
                    <p className="body-clock-help__layer-note">
                      {tiptraqNights}/3 nights recorded — finish the block to validate your anchor.
                    </p>
                  )}
                </li>
              )
            })}
          </ol>

          {showUpgrade && (
            <p className="body-clock-help__upgrade">
              Want a clinical read?{' '}
              <Link href="/home-test" className="body-clock-help__link">
                Order a TipTraQ home test ↗
              </Link>
            </p>
          )}
        </div>
      )}
    </div>
  )
}
