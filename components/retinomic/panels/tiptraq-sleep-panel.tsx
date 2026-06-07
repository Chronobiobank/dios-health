'use client'

import Link from 'next/link'

import { SleepHypnogram } from '@/components/retinomic/sleep-hypnogram'
import type { RetinomicTier } from '@/lib/retinomic/types'
import { PATIENT_ROUTES } from '@/lib/auth/routes'

type TipTraqSleepPanelProps = {
  tier: RetinomicTier
  remCycleEfficiency: number | null
  autonomicStrain: number | null
  lockedTitle?: string
  lockedBody?: string
  lockedHref?: string
  lockedCta?: string
}

function LockIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M7 10V8a5 5 0 0 1 10 0v2"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <rect x="5" y="10" width="14" height="11" rx="2" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  )
}

export function TipTraqSleepPanel({
  tier,
  remCycleEfficiency,
  autonomicStrain,
  lockedTitle,
  lockedBody,
  lockedHref = '/tiptraq',
  lockedCta,
}: TipTraqSleepPanelProps) {
  const isFree = tier === 'FREE_SCREENING'
  const remDisplay = remCycleEfficiency != null ? `${remCycleEfficiency}%` : '—'
  const strainDisplay = autonomicStrain != null ? autonomicStrain.toFixed(2) : '—'

  return (
    <section
      className="dios-glass-outer retinomic-panel retinomic-panel--sleep"
      aria-labelledby="sleep-panel-title"
    >
      <p id="sleep-panel-title" className="retinomic-panel__label">
        Sleep check
      </p>

      {isFree ? (
        <div className="premium-locked">
          <div className="premium-locked__content">
            <div className="dios-glass-inner retinomic-teaser-device opacity-80">
              <div className="retinomic-teaser-device__visual" aria-hidden />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-[var(--text-primary)]">TipTraQ calibration block</p>
                <p className="dash-sub mt-1 text-xs">REM stages and autonomic strain from your ring.</p>
              </div>
            </div>
            <SleepHypnogram />
          </div>
          <div className="premium-locked__overlay premium-locked__glass retinomic-locked-overlay">
            <LockIcon />
            <p className="retinomic-locked-overlay__title">
              {lockedTitle ?? 'Overnight sleep check'}
            </p>
            <p className="retinomic-locked-overlay__body">
              {lockedBody ?? 'Unlocks if DIOS flags circadian risk.'}
            </p>
            <Link href={lockedHref} className="dios-btn-on-light--secondary">
              {lockedCta ?? 'About TipTraQ'}
            </Link>
          </div>
        </div>
      ) : (
        <>
          <SleepHypnogram />
          <div className="retinomic-stat-pair">
            <div className="dios-glass-inner retinomic-stat-chip">
              <p className="retinomic-stat-chip__label">REM cycle efficiency</p>
              <p className="retinomic-stat-chip__value">{remDisplay}</p>
            </div>
            <div className="dios-glass-inner retinomic-stat-chip">
              <p className="retinomic-stat-chip__label">Autonomic strain</p>
              <p className="retinomic-stat-chip__value">{strainDisplay}</p>
            </div>
          </div>
          <p className="dash-sub mt-3 text-xs">
            Source: PranaQ TipTraQ · last three-night block on file (every six months).
          </p>
          <div className="mt-3">
            <Link
              href={PATIENT_ROUTES.insights}
              className="calm-auth-link text-xs font-medium"
            >
              Open full sleep verification ↗
            </Link>
          </div>
        </>
      )}
    </section>
  )
}
