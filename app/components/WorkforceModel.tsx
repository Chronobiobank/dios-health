'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'
import { cn } from '@/lib/utils'

const INDUSTRIES = [
  { label: 'Healthcare (nursing/clinical)', slug: 'heal' },
  { label: 'Mining & resources', slug: 'mining' },
  { label: 'Aviation & transport', slug: 'aviation' },
  { label: 'Logistics & supply chain', slug: 'logistics' },
  { label: 'Emergency services', slug: 'emergency' },
  { label: 'Manufacturing', slug: 'mfg' },
] as const

const GEOGRAPHIES = [
  'United Kingdom',
  'New Zealand',
  'Australia',
  'Germany',
  'Netherlands',
  'Japan',
  'Canada',
] as const

const DRIFT_SPLIT = { low: 0.52, medium: 0.26, high: 0.22 }

function formatGBP(value: number) {
  return `£${Math.round(value).toLocaleString('en-GB')}`
}

function MetricRow({
  label,
  value,
  light,
}: {
  label: string
  value: string | number
  light?: boolean
}) {
  return (
    <div
      className={cn(
        'flex justify-between gap-4 border-b py-2.5 text-sm',
        light ? 'border-white/15' : 'border-dios-border',
      )}
    >
      <span className={light ? 'text-dios-lilac' : 'text-dios-muted'}>{label}</span>
      <span className={cn('font-semibold tabular-nums', light ? 'text-white' : 'text-dios-aubergine')}>
        {value}
      </span>
    </div>
  )
}

export function WorkforceModel() {
  const [industryIndex, setIndustryIndex] = useState(0)
  const [workforce, setWorkforce] = useState(500)
  const [geography, setGeography] = useState<string>(GEOGRAPHIES[0])

  const industry = INDUSTRIES[industryIndex]

  const derived = useMemo(() => {
    const low = Math.round(workforce * DRIFT_SPLIT.low)
    const medium = Math.round(workforce * DRIFT_SPLIT.medium)
    const high = Math.round(workforce * DRIFT_SPLIT.high)
    const requiringReview = Math.round(workforce * 0.22)
    const exposure = workforce * 244.2
    const saving = workforce * 75.7
    const diosCost = workforce * 375
    const net = Math.round(workforce * (75.7 - 375))

    return { low, medium, high, requiringReview, exposure, saving, diosCost, net }
  }, [workforce])

  const workforceRef = `workforce_proj_${industry.slug}`

  return (
    <section id="model" className="dios-section border-y border-dios-border bg-white">
      <div className="dios-container">
        <p className="dios-eyebrow">Explore</p>
        <h2 className="dios-display-lg mb-3">Model your workforce.</h2>
        <p className="dios-lead mb-8">
          Published epidemiology for shift-worker populations. Projections only — not your data.
        </p>

        <div className="mb-10 flex flex-wrap gap-2">
          {['2.1h Mean social jetlag', '55% Vitamin D deficiency', '£1,545 Employee loss p/a'].map((pill) => (
            <span
              key={pill}
              className="rounded-full border border-dios-border bg-dios-lilac-light px-4 py-2 text-xs font-semibold text-dios-aubergine"
            >
              {pill}
            </span>
          ))}
        </div>

        <div className="mb-12 grid gap-6 rounded-2xl border border-dios-border bg-dios-cream p-6 md:grid-cols-3 md:p-8">
          <div>
            <label className="label">Industry</label>
            <select
              value={industryIndex}
              onChange={(e) => setIndustryIndex(Number(e.target.value))}
              className="input"
            >
              {INDUSTRIES.map((ind, i) => (
                <option key={ind.slug} value={i}>
                  {ind.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="label">
              Workforce size — <span className="text-dios-gold">{workforce.toLocaleString()}</span>
            </label>
            <input
              type="range"
              min={50}
              max={5000}
              step={50}
              value={workforce}
              onChange={(e) => setWorkforce(Number(e.target.value))}
              className="mt-2 w-full accent-dios-gold"
            />
            <div className="mt-1 flex justify-between text-xs text-dios-muted">
              <span>50</span>
              <span>5,000</span>
            </div>
          </div>
          <div>
            <label className="label">Geography</label>
            <select value={geography} onChange={(e) => setGeography(e.target.value)} className="input">
              {GEOGRAPHIES.map((geo) => (
                <option key={geo} value={geo}>
                  {geo}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mb-10 grid gap-6 lg:grid-cols-3">
          <div className="rounded-2xl bg-dios-lilac-light p-8">
            <p className="dios-tag mb-2 text-dios-gold">Clinical lens</p>
            <h3 className="dios-display mb-6 text-xl text-dios-aubergine">Population drift distribution</h3>
            {(
              [
                ['Low Drift', derived.low, DRIFT_SPLIT.low],
                ['Medium Drift', derived.medium, DRIFT_SPLIT.medium],
                ['High Drift', derived.high, DRIFT_SPLIT.high],
              ] as const
            ).map(([label, count, pct]) => (
              <div key={label} className="mb-4">
                <div className="mb-1 flex justify-between text-xs font-medium text-dios-muted">
                  <span>{label}</span>
                  <span>
                    {count.toLocaleString()} ({Math.round(pct * 100)}%)
                  </span>
                </div>
                <div className="h-1 overflow-hidden rounded-full bg-dios-border">
                  <div
                    className={cn('h-full rounded-full', label === 'High Drift' ? 'bg-dios-gold' : 'bg-dios-aubergine')}
                    style={{ width: `${pct * 100}%` }}
                  />
                </div>
              </div>
            ))}
            <MetricRow label="Requiring review" value={derived.requiringReview.toLocaleString()} />
            <MetricRow label="Mean drift index" value={44} />
            <p className="dios-tag mt-4 mb-2 text-dios-muted">Shift pattern risk</p>
            <MetricRow label="Fixed night" value="DI 56" />
            <MetricRow label="Rotating" value="DI 48" />
            <MetricRow label="Early morning" value="DI 38" />
          </div>

          <div className="rounded-2xl border border-dios-border bg-dios-cream p-8">
            <p className="dios-tag mb-2 text-dios-gold">Employer lens</p>
            <h3 className="dios-display mb-6 text-xl text-dios-aubergine">Workforce exposure aggregate</h3>
            <MetricRow label="Active population" value={workforce.toLocaleString()} />
            <MetricRow label="At elevated drift risk" value="22%" />
            <MetricRow label="Mean drift index" value={44} />
            <MetricRow label="Estimated annual exposure" value={formatGBP(derived.exposure)} />
            <MetricRow label="Projected saving with DIOS" value={formatGBP(derived.saving)} />
            <MetricRow label="DIOS annual cost" value={formatGBP(derived.diosCost)} />
            <MetricRow label="Net projection" value={formatGBP(derived.net)} />
            <p className="mt-4 text-xs italic text-dios-muted">NHS reference costs 2025/26. Model estimates only.</p>
          </div>

          <div className="rounded-2xl bg-dios-aubergine p-8 text-white">
            <p className="dios-tag mb-2 text-dios-gold">Insurer lens</p>
            <h3 className="dios-display mb-6 text-xl text-white">Anonymised population signals</h3>
            <MetricRow light label="Workforce ref" value={workforceRef} />
            <MetricRow light label="Exposure class" value="moderate" />
            <MetricRow light label="Unmodelled exposure" value="42%" />
            <MetricRow light label="Wearable coverage" value="58%" />
            <MetricRow light label="High-risk share" value="22%" />
            <p className="mt-4 text-sm leading-relaxed text-dios-lilac">
              Longitudinal deterioration signal:{' '}
              <strong className="text-white">+0.040 mean population velocity</strong> — stable in current window.
            </p>
            <p className="mt-3 text-xs text-dios-aubergine-mid">Geography: {geography}</p>
          </div>
        </div>

        <p className="mb-8 text-center text-sm text-dios-muted">
          Projections from published distributions. Your numbers require your data.
        </p>
        <div className="text-center">
          <Link href="#demo" className="dios-btn-primary">
            Talk to us about your institution →
          </Link>
        </div>
      </div>
    </section>
  )
}
