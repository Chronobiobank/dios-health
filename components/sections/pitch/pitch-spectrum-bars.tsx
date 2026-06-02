'use client'

import Link from 'next/link'

import { PITCH_CONFIDENCE_LAYERS, PITCH_SPECTRUM_PAGE } from '@/lib/pitch/landing-content'
import { pitchSpectrumBarColor } from '@/lib/pitch/pitch-palette'
import { DEMO_SPECTRUM_SCORES } from '@/lib/spectrum/spectrum-builder'
import { SPECTRUM_NODES } from '@/lib/spectrum/spectrum-data'

export function PitchSpectrumBars() {
  const scoreByNode = Object.fromEntries(
    DEMO_SPECTRUM_SCORES.map((s) => [s.nodeId, s])
  )

  return (
    <div className="flex w-full max-w-3xl flex-col gap-2.5 sm:gap-3">
      {SPECTRUM_NODES.map((node) => {
        const score = scoreByNode[node.id]?.score ?? 0.5
        const pct = Math.round(score * 100)
        const barColor = pitchSpectrumBarColor(score)

        return (
          <Link
            key={node.id}
            href={PITCH_SPECTRUM_PAGE}
            className="pitch-spectrum-row block transition-colors hover:border-[rgb(201_151_58/0.28)]"
          >
            <div className="flex flex-wrap items-baseline justify-between gap-1.5">
              <p className="text-[13px] font-medium text-white sm:text-sm">{node.shortLabel}</p>
              <div className="flex items-center gap-3">
                <span className="font-mono text-[12px] text-[var(--calm-brand)]/80">{pct}</span>
                <span className="font-mono text-[10px] text-[var(--calm-brand)]/90">Spectrum →</span>
              </div>
            </div>
            <div
              className="mt-2 h-2 w-full overflow-hidden rounded-full bg-white/[0.08]"
              role="img"
              aria-label={`${node.label} score ${pct} out of 100`}
            >
              <div
                className="h-full rounded-full transition-all"
                style={{ width: `${pct}%`, backgroundColor: barColor }}
              />
            </div>
          </Link>
        )
      })}

      <div className="grid grid-cols-3 gap-2">
        {PITCH_CONFIDENCE_LAYERS.map((layer) => (
          <Link
            key={layer.key}
            href={PITCH_SPECTRUM_PAGE}
            className="pitch-spectrum-row pitch-spectrum-row--layer block transition-colors hover:border-[rgb(201_151_58/0.28)]"
          >
            <p className="font-mono text-[9px] uppercase tracking-wider text-[var(--calm-brand)]/70 sm:text-[10px]">
              {layer.key}
            </p>
            <p className="mt-0.5 font-mono text-[10px] font-medium text-white/90 sm:text-[11px]">{layer.title}</p>
            <p className="mt-0.5 font-mono text-[9px] text-white/45 sm:text-[10px]">{layer.body}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}
