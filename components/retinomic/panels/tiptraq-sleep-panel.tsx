'use client'

import Link from 'next/link'

import { SleepHypnogram } from '@/components/retinomic/sleep-hypnogram'
import type { RetinomicTier } from '@/lib/retinomic/types'
import { PATIENT_ROUTES } from '@/lib/auth/routes'

type TipTraqSleepPanelProps = {
  tier: RetinomicTier
  remCycleEfficiency: number | null
  autonomicStrain: number | null
}

const MOCK_TEASER_STATS = [
  { label: 'AHI index', value: '4.2' },
  { label: 'SpO₂ nadir', value: '91%' },
  { label: 'HRV strain', value: '0.38' },
] as const

export function TipTraqSleepPanel({
  tier,
  remCycleEfficiency,
  autonomicStrain,
}: TipTraqSleepPanelProps) {
  const isFree = tier === 'FREE_SCREENING'
  const remDisplay = remCycleEfficiency != null ? `${remCycleEfficiency}%` : '82%'
  const strainDisplay = autonomicStrain != null ? autonomicStrain.toFixed(2) : '0.41'

  return (
    <section
      className="dios-glass-outer retinomic-panel retinomic-panel--sleep"
      aria-labelledby="sleep-panel-title"
    >
      <p id="sleep-panel-title" className="retinomic-panel__label">
        Sleep check
      </p>

      {isFree ? (
        <>
          <div className="dios-glass-inner retinomic-teaser-device">
            <div className="retinomic-teaser-device__visual" aria-hidden />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-[var(--text-primary)]">TipTraQ ring · webhook stream</p>
              <p className="dash-sub mt-1 text-xs">REM stages and overnight strain from your ring.</p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {MOCK_TEASER_STATS.map((stat) => (
              <div key={stat.label} className="dios-glass-inner retinomic-stat-chip text-center">
                <p className="retinomic-stat-chip__label">{stat.label}</p>
                <p className="retinomic-stat-chip__value">{stat.value}</p>
              </div>
            ))}
          </div>
          <SleepHypnogram />
          <div className="mt-4 flex justify-center">
            <Link href="/tiptraq" className="dios-btn-on-light">
              Add TipTraQ
            </Link>
          </div>
        </>
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
            Source: PranaQ TipTraQ webhook · last verified night on file.
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
