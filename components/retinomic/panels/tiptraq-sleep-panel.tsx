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
    <section className="retinomic-panel retinomic-panel--sleep" aria-labelledby="sleep-panel-title">
      <p id="sleep-panel-title" className="retinomic-panel__label">
        Clinical output · TipTraQ sleep verification
      </p>

      {isFree ? (
        <>
          <div className="retinomic-teaser-device">
            <div className="retinomic-teaser-device__visual" aria-hidden />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-[#e0e7ff]">TipTraQ ring · webhook stream</p>
              <p className="mt-1 text-xs text-[rgb(250_250_247/0.55)]">
                PranaQ hardware staging REM architecture + autonomic load.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {MOCK_TEASER_STATS.map((stat) => (
              <div key={stat.label} className="retinomic-stat-chip text-center">
                <p className="retinomic-stat-chip__label">{stat.label}</p>
                <p className="retinomic-stat-chip__value">{stat.value}</p>
              </div>
            ))}
          </div>
          <SleepHypnogram />
          <div className="mt-4 flex justify-center">
            <Link href="/tiptraq" className="retinomic-upgrade-cta retinomic-upgrade-cta--sleep">
              Activate TipTraQ Premium Stream
            </Link>
          </div>
        </>
      ) : (
        <>
          <SleepHypnogram />
          <div className="retinomic-stat-pair">
            <div className="retinomic-stat-chip">
              <p className="retinomic-stat-chip__label">REM cycle efficiency</p>
              <p className="retinomic-stat-chip__value">{remDisplay}</p>
            </div>
            <div className="retinomic-stat-chip">
              <p className="retinomic-stat-chip__label">Autonomic strain</p>
              <p className="retinomic-stat-chip__value">{strainDisplay}</p>
            </div>
          </div>
          <p className="mt-3 text-xs text-[rgb(250_250_247/0.5)]">
            Source: PranaQ TipTraQ webhook · last verified night on file.
          </p>
          <div className="mt-3">
            <Link
              href={PATIENT_ROUTES.insights}
              className="text-xs font-medium text-[#a5b4fc] underline-offset-2 hover:underline"
            >
              Open full sleep verification ↗
            </Link>
          </div>
        </>
      )}
    </section>
  )
}
