'use client'

import { CircadianDesynchronyTree } from '@/components/patient-dashboard/circadian-desynchrony-tree'
import {
  ALL_DESYNCHRONY_BRANCH_NODES,
  SEAN_JAMES_ACTIVE_DESYNCHRONY_NODES,
} from '@/lib/spectrum/desynchrony-tree'

export type { LayerKey, SpectrumScore } from '@/lib/spectrum/spectrum-types'

type CircadianDesynchronySpectrumProps = {
  mluxScore: number
  patientName?: string
  isDemo?: boolean
  activeNodeIds?: readonly string[]
}

export function CircadianDesynchronySpectrum({
  mluxScore,
  patientName,
  isDemo = false,
  activeNodeIds,
}: CircadianDesynchronySpectrumProps) {
  const active =
    activeNodeIds ??
    (isDemo ? SEAN_JAMES_ACTIVE_DESYNCHRONY_NODES : [])

  return (
    <section className="w-full">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-widest text-black/40">
            {isDemo
              ? 'Demo profile · overlapping metabolic and immune branches'
              : patientName
                ? `${patientName} · Circadian profile`
                : 'Circadian Desynchrony Spectrum'}
          </p>
          <h2 className="mt-1 text-[20px] font-semibold leading-snug text-black lg:text-[24px]">
            Circadian Desynchrony Spectrum
          </h2>
          <p className="mt-1 text-[13px] leading-relaxed text-black/55">
            Root and trunk — upstream regulatory failure. Three branches — disease expression patterns.
            Node colour reflects typical indication zone, not branch position.
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

      <div className="mt-6">
        <CircadianDesynchronyTree activeNodeIds={active} showAxisNote={!isDemo} />
      </div>

      <div className="mt-6 rounded-xl border border-black/[0.06] bg-neutral-50 px-5 py-4">
        <p className="font-mono text-[10px] uppercase tracking-widest text-black/35">
          Population validation
        </p>
        <p className="mt-2 text-[13px] leading-relaxed text-black/60">
          UK Biobank — 89,000 participants, 13 million hours of personal light sensor data.
          Metabolic, immune, and neurological conditions are increasingly reclassified as circadian
          immune expression downstream of NLRP3 inflammasome dysregulation. DIOS measures amplitude
          dampening at the root and assigns protocol intensity through the Chronoimmune zones
          separately.
        </p>
      </div>

      {isDemo ? (
        <p className="mt-4 text-center font-mono text-[11px] text-black/25">
          Demo — {active.length} active nodes on {ALL_DESYNCHRONY_BRANCH_NODES.length} branch
          conditions · sign in for your personal tree
        </p>
      ) : null}
    </section>
  )
}
