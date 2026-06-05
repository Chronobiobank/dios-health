'use client'

import type { DailyIntervention, InterventionPillar, InterventionTask } from '@/src/lib/engine/types'
import { cn } from '@/lib/utils'

const PILLAR_STYLES: Record<
  InterventionPillar,
  { dot: string; border: string; label: string }
> = {
  photic: {
    dot: 'bg-photic-core',
    border: 'border-photic-muted/30',
    label: 'text-photic-muted',
  },
  fuel: {
    dot: 'bg-fuel-core',
    border: 'border-fuel-muted/30',
    label: 'text-fuel-muted',
  },
  telemetry: {
    dot: 'bg-telemetry-core',
    border: 'border-telemetry-muted/30',
    label: 'text-telemetry-muted',
  },
}

function PriorityBadge({ priority }: { priority: InterventionTask['priority'] }) {
  const label =
    priority === 'required' ? 'Required' : priority === 'adjustment' ? 'Adjust' : 'Verify'
  return (
    <span className="dash-sub font-mono text-[10px] uppercase tracking-widest">
      {label}
    </span>
  )
}

type InterventionGuideProps = {
  intervention: DailyIntervention
  dayOneIntro?: string | null
  returnVisitIntro?: string | null
}

export function InterventionGuide({
  intervention,
  dayOneIntro,
  returnVisitIntro,
}: InterventionGuideProps) {
  const visitIntro = returnVisitIntro ?? dayOneIntro
  return (
    <section
      className="dios-glass-outer retinomic-panel"
      aria-labelledby="intervention-guide-title"
    >
      <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <div>
          <p id="intervention-guide-title" className="dashboard-section-label">
            Today&apos;s plan
          </p>
          {visitIntro ? (
            <p className="type-body mt-2 text-sm leading-relaxed text-[var(--text-secondary)]">
              {visitIntro}
            </p>
          ) : null}
          <p className={cn('dash-sub text-sm', visitIntro ? 'mt-2' : 'mt-1')}>
            Eat within {intervention.treWindowHours}h · first meal {intervention.firstMealTime}
            {intervention.firstBiteBComplexSync ? ' · B-vitamins with food' : ''}
          </p>
        </div>
        {intervention.clinicalFlags.length > 0 ? (
          <ul className="flex flex-wrap gap-2">
            {intervention.clinicalFlags.map((flag) => (
              <li
                key={flag}
                className="rounded-full border border-telemetry-muted/25 bg-telemetry-core/10 px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-wide text-telemetry-muted"
              >
                {flag}
              </li>
            ))}
          </ul>
        ) : null}
      </div>

      {intervention.acetylcholineShortageFlag ? (
        <p className="type-medical-dense mb-4 rounded-lg border border-telemetry-muted/25 bg-telemetry-core/8 px-3 py-2 text-xs text-telemetry-deep">
          Acetylcholine bottleneck: REM fragmentation with disciplined evening light — biochemistry
          override suspected. Verify B5; refresh D3 labs if out of band.
        </p>
      ) : null}

      <ol className="relative space-y-0 border-l border-black/10 pl-5">
        {intervention.tasks.map((task, index) => {
          const style = PILLAR_STYLES[task.pillar]
          return (
            <li
              key={task.id}
              className={cn(
                'relative pb-6 last:pb-0',
                index < intervention.tasks.length - 1 && 'border-b border-black/[0.06]'
              )}
            >
              <span
                className={cn(
                  'absolute -left-[1.35rem] top-1.5 h-2.5 w-2.5 rounded-full ring-2 ring-white',
                  style.dot
                )}
                aria-hidden
              />
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <time className="dash-sub font-mono text-xs tabular-nums">
                  {task.timeLabel}
                </time>
                <PriorityBadge priority={task.priority} />
              </div>
              <p className={cn('mt-1 text-sm font-medium', style.label)}>{task.title}</p>
              <p className="type-medical-dense dash-sub mt-1 text-xs leading-relaxed">
                {task.directive}
              </p>
            </li>
          )
        })}
      </ol>
    </section>
  )
}
