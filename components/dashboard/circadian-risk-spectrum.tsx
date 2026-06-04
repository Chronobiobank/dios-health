'use client'

import { cn } from '@/lib/utils'

export type SpectrumConfidence = 'ESTIMATED' | 'PRECISION' | 'CONFIRMED'
export type RiskLevel = 'low' | 'moderate' | 'elevated' | 'high'

export type SpectrumNode = {
  id: string
  label: string
  riskLevel: RiskLevel
  confidence: SpectrumConfidence
  differentials: string[]
  description: string
}

type CircadianRiskSpectrumProps = {
  nodes: SpectrumNode[]
  overallConfidence: SpectrumConfidence
  mluxScore: number
  isFirstOpen: boolean
}

const RISK_COLOURS: Record<
  RiskLevel,
  {
    ring: string
    bg: string
    text: string
    dot: string
  }
> = {
  low: {
    ring: 'border-emerald-200',
    bg: 'bg-emerald-50',
    text: 'text-emerald-800',
    dot: 'bg-emerald-400',
  },
  moderate: {
    ring: 'border-amber-200',
    bg: 'bg-amber-50',
    text: 'text-amber-800',
    dot: 'bg-amber-400',
  },
  elevated: {
    ring: 'border-orange-200',
    bg: 'bg-orange-50',
    text: 'text-orange-800',
    dot: 'bg-orange-500',
  },
  high: {
    ring: 'border-red-200',
    bg: 'bg-red-50',
    text: 'text-red-800',
    dot: 'bg-red-500',
  },
}

const CONFIDENCE_LABEL: Record<SpectrumConfidence, string> = {
  ESTIMATED: 'Estimated',
  PRECISION: 'Precision',
  CONFIRMED: 'Confirmed',
}

const CONFIDENCE_STYLE: Record<SpectrumConfidence, string> = {
  ESTIMATED: 'bg-amber-500/10 text-amber-900',
  PRECISION: 'bg-teal-600/10 text-teal-900',
  CONFIRMED: 'bg-emerald-600/10 text-emerald-900',
}

function ConfidenceRing({
  confidence,
  riskLevel,
}: {
  confidence: SpectrumConfidence
  riskLevel: RiskLevel
}) {
  const fill =
    confidence === 'ESTIMATED' ? '33%' : confidence === 'PRECISION' ? '66%' : '100%'

  const colours = RISK_COLOURS[riskLevel]

  return (
    <div className="relative h-8 w-8 shrink-0">
      <svg viewBox="0 0 32 32" className="h-full w-full -rotate-90">
        <circle
          cx="16"
          cy="16"
          r="12"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          className="text-black/[0.06]"
        />
        <circle
          cx="16"
          cy="16"
          r="12"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeDasharray={`${parseFloat(fill) * 0.75} 100`}
          strokeLinecap="round"
          className={
            riskLevel === 'low'
              ? 'text-emerald-400'
              : riskLevel === 'moderate'
                ? 'text-amber-400'
                : riskLevel === 'elevated'
                  ? 'text-orange-500'
                  : 'text-red-500'
          }
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className={cn('h-2 w-2 rounded-full', colours.dot)} />
      </div>
    </div>
  )
}

function SpectrumNodeCard({ node }: { node: SpectrumNode }) {
  const colours = RISK_COLOURS[node.riskLevel]

  return (
    <div
      className={cn(
        'flex items-start gap-3 rounded-2xl border p-4 transition-colors',
        colours.ring,
        colours.bg
      )}
    >
      <ConfidenceRing confidence={node.confidence} riskLevel={node.riskLevel} />
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <p className={cn('text-[14px] font-semibold', colours.text)}>{node.label}</p>
          <span
            className={cn(
              'rounded-full px-2 py-0.5 font-mono text-[9px] uppercase tracking-wide',
              CONFIDENCE_STYLE[node.confidence]
            )}
          >
            {CONFIDENCE_LABEL[node.confidence]}
          </span>
        </div>
        <p className="mt-1 text-[12px] leading-relaxed text-black/55">{node.description}</p>
        {node.differentials.length > 0 ? (
          <p className="mt-1.5 font-mono text-[10px] text-black/35">
            {node.differentials.join(' · ')}
          </p>
        ) : null}
      </div>
      <div
        className={cn(
          'shrink-0 rounded-full px-2 py-0.5 font-mono text-[10px] font-semibold uppercase',
          colours.bg,
          colours.text
        )}
      >
        {node.riskLevel === 'low'
          ? 'Low'
          : node.riskLevel === 'moderate'
            ? 'Moderate'
            : node.riskLevel === 'elevated'
              ? 'Elevated'
              : 'High'}
      </div>
    </div>
  )
}

export function CircadianRiskSpectrum({
  nodes,
  overallConfidence,
  mluxScore,
  isFirstOpen,
}: CircadianRiskSpectrumProps) {
  return (
    <section>
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-[15px] font-semibold text-black">Circadian Risk Profile</h2>
          <p className="mt-0.5 text-[12px] text-black/50">
            {overallConfidence === 'ESTIMATED'
              ? 'Based on DIOS Coach session · Add data layers to sharpen'
              : overallConfidence === 'PRECISION'
                ? 'Blood panel data included'
                : 'All data layers confirmed'}
          </p>
        </div>
        <span
          className={cn(
            'shrink-0 rounded-full px-2.5 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-[0.08em]',
            CONFIDENCE_STYLE[overallConfidence]
          )}
        >
          {CONFIDENCE_LABEL[overallConfidence]}
        </span>
      </div>

      <div className="mt-3 rounded-xl bg-black px-4 py-3 text-white">
        <div className="flex items-center justify-between">
          <p className="font-mono text-[11px] uppercase tracking-widest text-white/40">
            Melanopic Lux · Today
          </p>
          <p className="font-mono text-[13px] font-semibold text-white">{mluxScore} m-EDI</p>
        </div>
        <div className="mt-2 h-1.5 rounded-full bg-white/10">
          <div
            className="h-full rounded-full bg-[var(--color-brand)] transition-all duration-700"
            style={{ width: `${Math.min((mluxScore / 500) * 100, 100)}%` }}
          />
        </div>
        <div className="mt-1 flex justify-between">
          <p className="font-mono text-[9px] text-white/25">0</p>
          <p className="font-mono text-[9px] text-white/25">Target 250</p>
          <p className="font-mono text-[9px] text-white/25">500</p>
        </div>
      </div>

      <div className="mt-4 flex flex-col gap-2">
        {nodes.map((node) => (
          <SpectrumNodeCard key={node.id} node={node} />
        ))}
      </div>

      {isFirstOpen ? (
        <p className="mt-4 text-center font-mono text-[11px] text-black/30">
          Confidence grows with each DIOS Coach session and data layer
        </p>
      ) : null}
    </section>
  )
}
