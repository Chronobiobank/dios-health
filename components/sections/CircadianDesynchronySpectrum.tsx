'use client'

import { useState } from 'react'
import {
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
} from 'recharts'

import { SPECTRUM_NODES, type SpectrumNodeSpec } from '@/lib/spectrum/spectrum-data'
import type { LayerKey, SpectrumScore } from '@/lib/spectrum/spectrum-types'
import { cn } from '@/lib/utils'

export type { LayerKey, SpectrumScore } from '@/lib/spectrum/spectrum-types'

const C = {
  highRisk: '#1A365D',
  optimal: '#ED8936',
  spotAlert: '#D53F8C',
  neutralLine: '#888880',
  nodeGuide: 'rgba(136,135,128,0.35)',
  optimalFill: 'rgba(237,137,54,0.12)',
  riskFill: 'rgba(26,54,93,0.10)',
} as const

type ChartRow = {
  node: SpectrumNodeSpec
  subject: string
  score: number
  fullScore: number
  nodeColor: string
}

type CircadianDesynchronySpectrumProps = {
  scores: SpectrumScore[]
  mluxScore: number
  patientName?: string
  isDemo?: boolean
}

const LAYER_COLOURS: Record<
  LayerKey,
  { bg: string; text: string; border: string }
> = {
  L1: { bg: 'bg-amber-50', text: 'text-amber-800', border: 'border-amber-300' },
  L2: { bg: 'bg-teal-50', text: 'text-teal-800', border: 'border-teal-300' },
  L3: {
    bg: 'bg-emerald-50',
    text: 'text-emerald-800',
    border: 'border-emerald-300',
  },
}

const LAYER_LABELS: Record<LayerKey, string> = {
  L1: 'L1 · DIOS Coach',
  L2: 'L2 · Blood panel',
  L3: 'L3 · TipTraQ',
}

function SpectrumTooltip({
  active,
  payload,
}: {
  active?: boolean
  payload?: Array<{ payload: ChartRow }>
}) {
  if (!active || !payload?.[0]) return null
  const { node, score } = payload[0].payload
  const isAlert = score < 0.35
  const isOptimal = score >= 0.7

  return (
    <div className="max-w-[280px] rounded-xl border border-black/[0.08] bg-white p-4 shadow-lg">
      <div className="flex items-center gap-2">
        <div
          className="h-3 w-3 rounded-full"
          style={{ backgroundColor: node.nodeColor }}
        />
        <p className="text-[13px] font-semibold text-black">{node.label}</p>
        {isAlert ? (
          <span className="rounded-full bg-[#D53F8C]/10 px-2 py-0.5 font-mono text-[9px] font-bold uppercase tracking-wide text-[#D53F8C]">
            ★ Critical
          </span>
        ) : null}
      </div>
      <div className="mt-2 flex items-center gap-2">
        <div
          className="h-2 flex-1 rounded-full"
          style={{
            backgroundColor: isAlert ? C.spotAlert : isOptimal ? C.optimal : C.highRisk,
          }}
        />
        <p className="font-mono text-[12px] font-medium text-black">
          {Math.round(score * 100)}
        </p>
      </div>
      <p className="mt-3 text-[11px] font-semibold uppercase tracking-wide text-black/40">
        Differentials
      </p>
      <p className="mt-1 text-[12px] leading-relaxed text-black/70">
        {node.differentials.join(' · ')}
      </p>
      <p className="mt-3 text-[11px] font-semibold uppercase tracking-wide text-black/40">
        Clinical note
      </p>
      <p className="mt-1 text-[12px] leading-relaxed text-black/60">
        {node.clinicalScript}
      </p>
      <div className="mt-3 flex flex-col gap-1">
        {[
          { label: 'L1 · DIOS Coach', value: node.layer1Signal },
          { label: 'L2 · Blood', value: node.layer2Signal },
          { label: 'L3 · TipTraQ', value: node.layer3Signal },
        ].map(({ label, value }) => (
          <div key={label} className="flex gap-1.5">
            <span className="shrink-0 pt-0.5 font-mono text-[9px] uppercase tracking-wide text-black/30">
              {label}
            </span>
            <span className="text-[11px] text-black/50">{value}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

type RadarDotProps = {
  cx?: number
  cy?: number
  payload?: ChartRow
}

function RadarScoreDot({ cx, cy, payload }: RadarDotProps) {
  if (cx == null || cy == null || !payload) return null
  const score = payload.score
  const isAlert = score < 0.35
  const isOptimal = score >= 0.7
  const colour = isAlert ? C.spotAlert : isOptimal ? C.optimal : C.highRisk

  if (isAlert) {
    return (
      <text
        x={cx}
        y={cy}
        textAnchor="middle"
        dominantBaseline="middle"
        fontSize={14}
        fill={colour}
      >
        ★
      </text>
    )
  }

  return (
    <circle cx={cx} cy={cy} r={4} fill={colour} stroke="white" strokeWidth={1.5} />
  )
}

export function CircadianDesynchronySpectrum({
  scores,
  mluxScore,
  patientName,
  isDemo = false,
}: CircadianDesynchronySpectrumProps) {
  const [activeLayers, setActiveLayers] = useState<Set<LayerKey>>(
    new Set(['L1', 'L2', 'L3'])
  )
  const [activeNode, setActiveNode] = useState<string | null>(null)

  const chartData: ChartRow[] = SPECTRUM_NODES.map((node) => {
    const scoreEntry = scores.find((s) => s.nodeId === node.id)
    const value = scoreEntry?.score ?? 0.5
    const layer = scoreEntry?.layer ?? 'L1'
    const isActive = activeLayers.has(layer)
    return {
      node,
      subject: node.shortLabel,
      score: isActive ? value : 0.5,
      fullScore: value,
      nodeColor: node.nodeColor,
    }
  })

  const activeScores = chartData.map((d) => d.score)
  const avgScore =
    activeScores.reduce((a, b) => a + b, 0) / Math.max(activeScores.length, 1)
  const criticalCount = activeScores.filter((s) => s < 0.35).length
  const optimalCount = activeScores.filter((s) => s >= 0.7).length

  function toggleLayer(layer: LayerKey) {
    setActiveLayers((prev) => {
      const next = new Set(prev)
      if (next.has(layer)) {
        if (next.size > 1) next.delete(layer)
      } else {
        next.add(layer)
      }
      return next
    })
  }

  function renderAxisTick(props: {
    x?: string | number
    y?: string | number
    payload?: { value?: string }
  }) {
    const x = Number(props.x ?? 0)
    const y = Number(props.y ?? 0)
    const label = props.payload?.value ?? ''
    const node = SPECTRUM_NODES.find((n) => n.shortLabel === label)
    const score = chartData.find((d) => d.subject === label)?.score ?? 0.5
    const isAlert = score < 0.35

    return (
      <g>
        <circle cx={x} cy={y} r={5} fill={node?.nodeColor ?? '#888880'} />
        <text
          x={x}
          y={y + 14}
          textAnchor="middle"
          fill={isAlert ? C.spotAlert : '#0d0d0d'}
          fontSize={11}
          fontFamily="var(--font-family-mono, monospace)"
          fontWeight={isAlert ? 700 : 400}
        >
          {label}
          {isAlert ? ' ★' : ''}
        </text>
      </g>
    )
  }

  return (
    <section className="w-full">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-widest text-black/40">
            {isDemo
              ? 'Demo profile · Evening type patient'
              : patientName
                ? `${patientName} · Circadian profile`
                : 'Circadian Desynchrony Spectrum'}
          </p>
          <h2 className="mt-1 text-[20px] font-semibold leading-snug text-black lg:text-[24px]">
            Circadian Desynchrony Spectrum
          </h2>
          <p className="mt-1 text-[13px] leading-relaxed text-black/55">
            Seven nodes. Three input layers. Every node is a clinical intervention point.
          </p>
        </div>
        <div className="rounded-xl border border-black/[0.08] bg-black px-4 py-3 text-right">
          <p className="font-mono text-[10px] uppercase tracking-widest text-white/40">
            MLux score
          </p>
          <p className="font-mono text-[20px] font-semibold text-white">
            {mluxScore}
            <span className="ml-1 text-[11px] font-normal text-white/40">m-EDI</span>
          </p>
          <p className="font-mono text-[10px] text-white/30">
            {mluxScore >= 250
              ? 'On target'
              : mluxScore >= 100
                ? 'Below target'
                : 'Critical — get outside'}
          </p>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-3 xs:grid-cols-3">
        <div className="calm-spectrum-card border border-black/[0.08] bg-white px-4 py-3">
          <p className="font-mono text-[10px] uppercase tracking-widest text-black/40">
            Overall score
          </p>
          <p
            className={cn(
              'mt-1 font-mono text-[20px] font-semibold',
              avgScore >= 0.7
                ? 'text-[#ED8936]'
                : avgScore >= 0.35
                  ? 'text-[#1A365D]'
                  : 'text-[#D53F8C]'
            )}
          >
            {Math.round(avgScore * 100)}
            <span className="ml-1 text-[11px] font-normal text-black/40">/ 100</span>
          </p>
        </div>
        <div className="calm-spectrum-card border border-[#D53F8C]/20 bg-[#D53F8C]/5 px-4 py-3">
          <p className="font-mono text-[10px] uppercase tracking-widest text-[#D53F8C]/60">
            ★ Critical nodes
          </p>
          <p className="mt-1 font-mono text-[20px] font-semibold text-[#D53F8C]">
            {criticalCount}
            <span className="ml-1 text-[11px] font-normal text-[#D53F8C]/50">/ 7</span>
          </p>
        </div>
        <div className="calm-spectrum-card border border-[#ED8936]/20 bg-[#ED8936]/5 px-4 py-3">
          <p className="font-mono text-[10px] uppercase tracking-widest text-[#ED8936]/60">
            ● Optimal nodes
          </p>
          <p className="mt-1 font-mono text-[20px] font-semibold text-[#ED8936]">
            {optimalCount}
            <span className="ml-1 text-[11px] font-normal text-[#ED8936]/50">/ 7</span>
          </p>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <p className="font-mono text-[11px] text-black/40">Data layers:</p>
        {(['L1', 'L2', 'L3'] as LayerKey[]).map((layer) => {
          const active = activeLayers.has(layer)
          const colours = LAYER_COLOURS[layer]
          return (
            <button
              key={layer}
              type="button"
              onClick={() => toggleLayer(layer)}
              className={cn(
                'rounded-full border px-3 py-1 font-mono text-[11px] transition-opacity',
                active
                  ? [colours.bg, colours.text, colours.border]
                  : 'border-black/10 bg-white text-black/30 opacity-40'
              )}
            >
              {LAYER_LABELS[layer]}
            </button>
          )
        })}
      </div>

      <div className="mt-4 h-[min(340px,55vw)] min-h-[260px] w-full xs:min-h-[300px] lg:h-[340px]">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={chartData} margin={{ top: 20, right: 30, bottom: 20, left: 30 }}>
            <defs>
              <pattern
                id="riskHatch"
                patternUnits="userSpaceOnUse"
                width="6"
                height="6"
                patternTransform="rotate(45)"
              >
                <line
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="6"
                  stroke={C.highRisk}
                  strokeWidth="1.5"
                  opacity="0.4"
                />
              </pattern>
            </defs>
            <PolarGrid stroke={C.nodeGuide} strokeDasharray="4 4" />
            <PolarAngleAxis dataKey="subject" tick={renderAxisTick} />
            <Radar
              name="Circadian profile"
              dataKey="score"
              stroke={C.highRisk}
              fill={C.riskFill}
              fillOpacity={0.6}
              strokeWidth={2}
              dot={RadarScoreDot}
            />
            <Tooltip content={<SpectrumTooltip />} />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {SPECTRUM_NODES.map((node) => {
          const scoreEntry = chartData.find((d) => d.node.id === node.id)
          const score = scoreEntry?.score ?? 0.5
          const isAlert = score < 0.35
          const isOptimal = score >= 0.7
          const colour = isAlert ? C.spotAlert : isOptimal ? C.optimal : C.highRisk

          return (
            <div
              key={node.id}
              role="button"
              tabIndex={0}
              className={cn(
                'calm-spectrum-card cursor-pointer border p-4 transition-all',
                activeNode === node.id
                  ? 'border-black shadow-md'
                  : 'border-black/[0.08] hover:border-black/20',
                isAlert ? 'bg-[#D53F8C]/5' : isOptimal ? 'bg-[#ED8936]/5' : 'bg-white'
              )}
              onClick={() => setActiveNode((n) => (n === node.id ? null : node.id))}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  setActiveNode((n) => (n === node.id ? null : node.id))
                }
              }}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div
                    className="h-3 w-3 rounded-full"
                    style={{ backgroundColor: node.nodeColor }}
                  />
                  <p className="text-[13px] font-semibold text-black">{node.label}</p>
                </div>
                <span className="font-mono text-[12px] font-bold" style={{ color: colour }}>
                  {isAlert ? '★' : isOptimal ? '●' : '▲'} {Math.round(score * 100)}
                </span>
              </div>

              <div className="mt-2 h-1.5 rounded-full bg-black/[0.06]">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${score * 100}%`,
                    backgroundColor: colour,
                  }}
                />
              </div>

              <p className="mt-2 font-mono text-[10px] text-black/35">
                {node.differentials.slice(0, 2).join(' · ')}
              </p>

              {activeNode === node.id ? (
                <div className="mt-3 border-t border-black/[0.06] pt-3">
                  <p className="text-[11px] leading-relaxed text-black/60">
                    {node.clinicalScript}
                  </p>
                  <div className="mt-3 flex flex-col gap-1.5">
                    {[
                      { label: 'L1 DIOS Coach', value: node.layer1Signal },
                      { label: 'L2 Blood', value: node.layer2Signal },
                      { label: 'L3 TipTraQ', value: node.layer3Signal },
                    ].map(({ label, value }) => (
                      <div key={label} className="flex gap-2">
                        <span className="w-14 shrink-0 pt-0.5 font-mono text-[9px] uppercase tracking-wide text-black/30">
                          {label}
                        </span>
                        <span className="text-[11px] leading-relaxed text-black/55">
                          {value}
                        </span>
                      </div>
                    ))}
                  </div>
                  <p className="mt-3 font-mono text-[10px] text-black/30">
                    Drugs: {node.drugCluster.join(' · ')}
                  </p>
                  <p className="mt-1 font-mono text-[10px] text-black/30">
                    Micronutrients: {node.micronutrients.join(' · ')}
                  </p>
                </div>
              ) : null}
            </div>
          )
        })}
      </div>

      <div className="mt-6 rounded-xl border border-black/[0.06] bg-neutral-50 px-5 py-4">
        <p className="font-mono text-[10px] uppercase tracking-widest text-black/35">
          Population validation
        </p>
        <p className="mt-2 text-[13px] leading-relaxed text-black/60">
          UK Biobank — 89,000 participants, 13 million hours of personal light sensor data.
          Published in PNAS, The Lancet, and JAMA Network Open. Finding: more light by day,
          more dark by night, independently predicts lower rates of T2DM, heart failure, AF,
          stroke, and psychiatric disorders. MLux is the biomarker. DIOS measures it.
        </p>
      </div>

      {isDemo ? (
        <p className="mt-4 text-center font-mono text-[11px] text-black/25">
          Demo profile — sign in to see your personal Circadian Desynchrony Spectrum
        </p>
      ) : null}
    </section>
  )
}
