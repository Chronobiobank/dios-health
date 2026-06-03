'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'

import { CONTAINER, SECTION } from './layout'

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

const DRIFT_PCT = { low: 0.45, medium: 0.33, high: 0.22 } as const

const STAT_PILLS = [
  'Mean social jetlag is 2.1 hours in shift cohorts',
  'Vitamin D deficiency affects fifty-five percent of night workers',
  'Each misaligned employee costs about £1,545 per year',
] as const

const inputClassName =
  'mt-2 w-full rounded-lg border border-black/10 bg-white px-4 py-3 font-sans text-sm text-black outline-none focus:border-black focus:ring-1 focus:ring-black/10'

function formatGBP(value: number) {
  return `£${Math.round(value).toLocaleString('en-GB')}`
}

function MetricRow({
  label,
  value,
  dark,
}: {
  label: string
  value: string | number
  dark?: boolean
}) {
  return (
    <div
      className={cn(
        'flex justify-between gap-4 border-b py-2.5 text-sm last:border-b-0',
        dark ? 'border-white/15' : 'border-black/10'
      )}
    >
      <span className={dark ? 'text-white/70' : 'text-black/60'}>{label}</span>
      <span className={cn('font-medium tabular-nums', dark ? 'text-white' : 'text-black')}>
        {value}
      </span>
    </div>
  )
}

function DriftBar({
  label,
  count,
  widthClass,
  highlight,
}: {
  label: string
  count: number
  widthClass: string
  highlight?: boolean
}) {
  return (
    <div className="mb-4">
      <div className="mb-1.5 flex justify-between text-xs font-medium text-black/60">
        <span>{label}</span>
        <span className="tabular-nums">{count.toLocaleString()}</span>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-black/10">
        <div
          className={cn(
            'h-full rounded-full',
            widthClass,
            highlight ? 'bg-[#C9973A]' : 'bg-[#3B1F35]'
          )}
        />
      </div>
    </div>
  )
}

export function WorkforceModel() {
  const [industryIndex, setIndustryIndex] = useState(0)
  const [workforce, setWorkforce] = useState(500)
  const [geography, setGeography] = useState<string>(GEOGRAPHIES[0])

  const industry = INDUSTRIES[industryIndex]

  const derived = useMemo(() => {
    const low = Math.round(workforce * DRIFT_PCT.low)
    const medium = Math.round(workforce * DRIFT_PCT.medium)
    const high = Math.round(workforce * DRIFT_PCT.high)
    const requiringReview = Math.round(workforce * 0.22)
    const exposure = workforce * 244
    const saving = workforce * 75
    const diosCost = workforce * 375
    const net = workforce * (75 - 375)

    return { low, medium, high, requiringReview, exposure, saving, diosCost, net }
  }, [workforce])

  const workforceRef = `workforce_proj_${industry.slug}`

  return (
    <section id="model" className={`${SECTION} bg-[#FAFAFA] py-16 sm:py-20`}>
      <div className={CONTAINER}>
        <p className="font-mono text-xs uppercase tracking-widest text-black/50">Explore</p>
        <h2 className="type-section mt-4">Model chronotype drift and risk across your shift-work workforce</h2>
        <p className="type-body mt-4 max-w-2xl">
          Tertiary workforce intelligence uses published epidemiology for demonstration — your institution needs its own data and insurers are excluded by design
        </p>

        <div className="mt-8 flex flex-wrap gap-2 sm:gap-3">
          {STAT_PILLS.map((pill) => (
            <span
              key={pill}
              className="rounded-full border border-black/10 bg-white px-4 py-2 font-sans text-xs font-medium text-black/80"
            >
              {pill}
            </span>
          ))}
        </div>

        <div className="mt-10 space-y-6 rounded-xl border border-black/10 bg-white p-6 sm:p-8">
          <div>
            <label htmlFor="industry" className="type-label mb-2 block">
              Industry
            </label>
            <select
              id="industry"
              value={industryIndex}
              onChange={(e) => setIndustryIndex(Number(e.target.value))}
              className={inputClassName}
            >
              {INDUSTRIES.map((ind, i) => (
                <option key={ind.slug} value={i}>
                  {ind.label}
                </option>
              ))}
            </select>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <label htmlFor="workforce-size" className="type-label mb-2 block">
                Workforce size —{' '}
                <span className="font-medium text-[#C9973A]">{workforce.toLocaleString()}</span>
              </label>
              <input
                id="workforce-size"
                type="range"
                min={50}
                max={5000}
                step={50}
                value={workforce}
                onChange={(e) => setWorkforce(Number(e.target.value))}
                className="mt-3 w-full accent-[#C9973A]"
              />
              <div className="mt-1 flex justify-between font-sans text-xs text-black/50">
                <span>50</span>
                <span>5,000</span>
              </div>
            </div>
            <div>
              <label htmlFor="geography" className="type-label mb-2 block">
                Geography
              </label>
              <select
                id="geography"
                value={geography}
                onChange={(e) => setGeography(e.target.value)}
                className={inputClassName}
              >
                {GEOGRAPHIES.map((geo) => (
                  <option key={geo} value={geo}>
                    {geo}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-3">
          <Card className="gap-0 border border-black/10 bg-[#EDE8F7]/40 py-0 shadow-none ring-0">
            <CardHeader className="gap-1 px-6 pt-6">
              <p className="font-mono text-xs uppercase tracking-wider text-[#C9973A]">
                Clinical lens
              </p>
              <CardTitle className="font-sans text-lg font-semibold text-black">
                Population chronotype distribution across your workforce
              </CardTitle>
            </CardHeader>
            <CardContent className="px-6 pb-6">
              <DriftBar label="Low Drift" count={derived.low} widthClass="w-[45%]" />
              <DriftBar label="Medium Drift" count={derived.medium} widthClass="w-[33%]" />
              <DriftBar label="High Drift" count={derived.high} widthClass="w-[22%]" highlight />
              <div className="mt-4 border-t border-black/10 pt-2">
                <MetricRow
                  label="Requiring review"
                  value={derived.requiringReview.toLocaleString()}
                />
                <MetricRow label="Mean drift index" value={44} />
              </div>
              <p className="mt-4 font-mono text-xs uppercase tracking-wider text-black/50">
                Shift pattern risk
              </p>
              <MetricRow label="Fixed night" value="DI 56" />
              <MetricRow label="Rotating" value="DI 48" />
              <MetricRow label="Early morning" value="DI 38" />
            </CardContent>
          </Card>

          <Card className="gap-0 border border-black/10 bg-white py-0 shadow-none ring-0">
            <CardHeader className="gap-1 px-6 pt-6">
              <p className="font-mono text-xs uppercase tracking-wider text-[#C9973A]">
                Institution lens
              </p>
              <CardTitle className="font-sans text-lg font-semibold text-black">
                Shift-work workforce risk in aggregate view
              </CardTitle>
            </CardHeader>
            <CardContent className="px-6 pb-6">
              <MetricRow label="Active population" value={workforce.toLocaleString()} />
              <MetricRow label="At elevated drift risk" value="22%" />
              <MetricRow label="Mean drift index" value={44} />
              <MetricRow label="Estimated annual exposure" value={formatGBP(derived.exposure)} />
              <MetricRow label="Projected saving with DIOS" value={formatGBP(derived.saving)} />
              <MetricRow label="DIOS annual cost" value={formatGBP(derived.diosCost)} />
              <MetricRow label="Net projection" value={formatGBP(derived.net)} />
              <p className="mt-4 font-sans text-xs italic text-black/50">
                NHS reference costs 2025/26. Model estimates only.
              </p>
            </CardContent>
          </Card>

          <Card className="gap-0 border border-black/10 bg-[#3B1F35] py-0 text-white shadow-none ring-0">
            <CardHeader className="gap-1 px-6 pt-6">
              <p className="font-mono text-xs uppercase tracking-wider text-[#C9973A]">
                Research lens
              </p>
              <CardTitle className="font-sans text-lg font-semibold text-white">
                Consented chronotype stratification for research only
              </CardTitle>
            </CardHeader>
            <CardContent className="px-6 pb-6">
              <MetricRow dark label="Cohort ref" value={workforceRef} />
              <MetricRow dark label="Fitzpatrick-adjusted" value="enabled" />
              <MetricRow dark label="MSFsc source" value="wearable" />
              <MetricRow dark label="Location-corrected" value="yes" />
              <MetricRow dark label="Insurer access" value="excluded" />
              <p className="mt-4 font-sans text-sm leading-relaxed text-white/75">
                Anonymised, consented chronotype-stratified data for pharma and academic research
                — not underwriting.
              </p>
            </CardContent>
          </Card>
        </div>

        <p className="type-body mt-10 text-center">
          Projections come from published distributions until your institution connects its own workforce data
        </p>
        <div className="mt-8 text-center">
          <Link
            href="#demo"
            className="btn-primary type-button inline-flex items-center justify-center rounded-full bg-black py-3 text-white transition-colors hover:bg-black/80"
          >
            Talk to us about your institution →
          </Link>
        </div>
      </div>
    </section>
  )
}
