'use client'

import type { DailyIntervention, InterventionPillar, InterventionTask } from '@/src/lib/engine/types'
import { cn } from '@/lib/utils'

const PILLAR_STYLES: Record<
  InterventionPillar,
  { dot: string; border: string; label: string }
> = {
  photic: {
    dot: 'bg-photic-core',
    border: 'border-photic-muted/40',
    label: 'text-photic-core',
  },
  fuel: {
    dot: 'bg-fuel-core',
    border: 'border-fuel-muted/40',
    label: 'text-fuel-core',
  },
  telemetry: {
    dot: 'bg-telemetry-core',
    border: 'border-telemetry-muted/40',
    label: 'text-telemetry-core',
  },
}

function PriorityBadge({ priority }: { priority: InterventionTask['priority'] }) {
  const label =
    priority === 'required' ? 'Required' : priority === 'adjustment' ? 'Adjust' : 'Verify'
  return (
    <span className="font-mono text-[10px] uppercase tracking-widest text-[rgb(250_250_247/0.45)]">
      {label}
    </span>
  )
}

type InterventionGuideProps = {
  intervention: DailyIntervention
}

export function InterventionGuide({ intervention }: InterventionGuideProps) {
  return (
    <section
      className="retinomic-panel border border-[rgb(255_255_255/0.1)]"
      aria-labelledby="intervention-guide-title"
    >
      <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <div>
          <p id="intervention-guide-title" className="font-mono text-[10px] uppercase tracking-[0.14em] text-[rgb(250_250_247/0.55)]">
            Daily intervention · Panda × Gominak
          </p>
          <p className="mt-1 text-sm text-[rgb(250_250_247/0.65)]">
            TRE {intervention.treWindowHours}h · first bite {intervention.firstMealTime}
            {intervention.firstBiteBComplexSync ? ' · B-Complex locked to meal' : ''}
          </p>
        </div>
        {intervention.clinicalFlags.length > 0 ? (
          <ul className="flex flex-wrap gap-2">
            {intervention.clinicalFlags.map((flag) => (
              <li
                key={flag}
                className="rounded-full border border-telemetry-muted/50 bg-telemetry-deep/40 px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-wide text-telemetry-core"
              >
                {flag}
              </li>
            ))}
          </ul>
        ) : null}
      </div>

      {intervention.acetylcholineShortageFlag ? (
        <p className="type-medical-dense mb-4 rounded-lg border border-telemetry-muted/35 bg-telemetry-deep/25 px-3 py-2 text-xs text-telemetry-core">
          Acetylcholine bottleneck: REM fragmentation with disciplined evening light — biochemistry
          override suspected. Verify B5; refresh D3 labs if out of band.
        </p>
      ) : null}

      <ol className="relative space-y-0 border-l border-[rgb(255_255_255/0.12)] pl-5">
        {intervention.tasks.map((task, index) => {
          const style = PILLAR_STYLES[task.pillar]
          return (
            <li
              key={task.id}
              className={cn(
                'relative pb-6 last:pb-0',
                index < intervention.tasks.length - 1 && 'border-b border-[rgb(255_255_255/0.06)]'
              )}
            >
              <span
                className={cn(
                  'absolute -left-[1.35rem] top-1.5 h-2.5 w-2.5 rounded-full ring-2 ring-[#0f0f0f]',
                  style.dot
                )}
                aria-hidden
              />
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <time className="font-mono text-xs tabular-nums text-[rgb(250_250_247/0.5)]">
                  {task.timeLabel}
                </time>
                <PriorityBadge priority={task.priority} />
              </div>
              <p className={cn('mt-1 text-sm font-medium', style.label)}>{task.title}</p>
              <p className="type-medical-dense mt-1 text-xs leading-relaxed text-[rgb(250_250_247/0.72)]">
                {task.directive}
              </p>
            </li>
          )
        })}
      </ol>
    </section>
  )
}
