'use client'

import { DEMO_SPECTRUM_SCORES } from '@/lib/spectrum/spectrum-builder'
import { SPECTRUM_NODES } from '@/lib/spectrum/spectrum-data'
import {
  PITCH_CONFIDENCE_LAYERS,
  PITCH_SPECTRUM_NODE_CITATIONS,
} from '@/lib/pitch/landing-content'

const C = {
  highRisk: '#1A365D',
  optimal: '#ED8936',
  spotAlert: '#D53F8C',
} as const

export function PitchSpectrumBars() {
  const scoreByNode = Object.fromEntries(
    DEMO_SPECTRUM_SCORES.map((s) => [s.nodeId, s])
  )

  return (
    <div className="flex w-full max-w-3xl flex-col gap-2.5 sm:gap-3">
      {SPECTRUM_NODES.map((node) => {
        const score = scoreByNode[node.id]?.score ?? 0.5
        const pct = Math.round(score * 100)
        const isAlert = score < 0.35
        const isOptimal = score >= 0.7
        const barColor = isAlert ? C.spotAlert : isOptimal ? C.optimal : C.highRisk
        const cite = PITCH_SPECTRUM_NODE_CITATIONS[node.id]

        return (
          <div key={node.id} className="pitch-spectrum-row">
            <div className="flex flex-wrap items-baseline justify-between gap-1.5">
              <p className="text-[13px] font-medium text-white sm:text-sm">{node.shortLabel}</p>
              <div className="flex items-center gap-3">
                <span className="font-mono text-[12px] text-white/50">{pct}</span>
                {cite ? (
                  <a
                    href={cite.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-mono text-[10px] text-white/55 underline underline-offset-2 hover:text-white/80"
                  >
                    {cite.label}
                  </a>
                ) : null}
              </div>
            </div>
            <div
              className="mt-2 h-2 w-full overflow-hidden rounded-full bg-white/8"
              role="img"
              aria-label={`${node.label} score ${pct} out of 100`}
            >
              <div
                className="h-full rounded-full transition-all"
                style={{ width: `${pct}%`, backgroundColor: barColor }}
              />
            </div>
          </div>
        )
      })}

      <div className="grid grid-cols-3 gap-2">
        {PITCH_CONFIDENCE_LAYERS.map((layer) => (
          <div key={layer.key} className="pitch-spectrum-row px-2 py-2 sm:px-3 sm:py-3">
            <p className="font-mono text-[9px] uppercase tracking-wider text-white/40 sm:text-[10px]">
              {layer.key}
            </p>
            <p className="mt-0.5 font-mono text-[10px] font-medium text-white/90 sm:text-[11px]">{layer.title}</p>
            <p className="mt-0.5 font-mono text-[9px] text-white/45 sm:text-[10px]">{layer.body}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
