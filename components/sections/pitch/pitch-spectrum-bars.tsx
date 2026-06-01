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
    <div className="mt-8 flex w-full max-w-3xl flex-col gap-4 lg:mt-10">
      {SPECTRUM_NODES.map((node) => {
        const score = scoreByNode[node.id]?.score ?? 0.5
        const pct = Math.round(score * 100)
        const isAlert = score < 0.35
        const isOptimal = score >= 0.7
        const barColor = isAlert ? C.spotAlert : isOptimal ? C.optimal : C.highRisk
        const cite = PITCH_SPECTRUM_NODE_CITATIONS[node.id]

        return (
          <div key={node.id} className="calm-spectrum-card border border-white/10 bg-[rgb(15_15_15/0.72)] px-4 py-3">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <p className="calm-headline text-sm">{node.label}</p>
              <div className="flex items-center gap-3">
                <span className="font-mono text-[12px] text-white/50">{pct}</span>
                {cite ? (
                  <a
                    href={cite.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-mono text-[10px] text-calm-brand underline underline-offset-2"
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

      <div className="mt-4 grid grid-cols-1 gap-3 xs:grid-cols-3">
        {PITCH_CONFIDENCE_LAYERS.map((layer) => (
          <div
            key={layer.key}
            className="calm-card border border-white/10 px-3 py-3"
          >
            <p className="calm-eyebrow text-[10px]">{layer.key}</p>
            <p className="mt-1 font-mono text-[11px] font-medium text-white/90">{layer.title}</p>
            <p className="mt-1 font-mono text-[10px] leading-relaxed text-white/45">{layer.body}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
