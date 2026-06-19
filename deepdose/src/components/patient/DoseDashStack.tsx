'use client'

import { useState } from 'react'
import type { DoseDashModel, MetabolicRiskSignal, RiskSeverity } from '@/lib/patient/dose-dash-types'
import { Badge } from '@/components/ui/Layout'

const SEVERITY_TONE: Record<RiskSeverity, 'success' | 'warning' | 'neutral'> = {
  low: 'success',
  watch: 'warning',
  action: 'warning',
}

const SEVERITY_LABEL: Record<RiskSeverity, string> = {
  low: 'Low',
  watch: 'Watch',
  action: 'Act',
}

const TRIAGE_CLASS: Record<DoseDashModel['triageLabel'], string> = {
  'On track': 'dose-dash-triage dose-dash-triage--on-track',
  'Needs attention': 'dose-dash-triage dose-dash-triage--attention',
  'Review soon': 'dose-dash-triage dose-dash-triage--review',
}

type DoseDashStackProps = {
  model: DoseDashModel
  medDetail: string | null
}

export function DoseDashStack({ model, medDetail }: DoseDashStackProps) {
  const [openRisk, setOpenRisk] = useState<string | null>(null)
  const [openCluster, setOpenCluster] = useState<string | null>(null)

  return (
    <div className="space-y-6">
      <section className="seco-app-card p-5 md:p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="seco-page__eyebrow mb-1">Metabolic risk</p>
            <h2 className="seco-app-card__title">Your body-clock spectrum</h2>
            <p className="mt-1 text-sm text-ink-muted">
              Sleep breathing, clock drift, and metabolic rhythm — from your TipTraQ block and
              chronotype.
            </p>
          </div>
          <span className={TRIAGE_CLASS[model.triageLabel]}>{model.triageLabel}</span>
        </div>

        <ul className="mt-5 space-y-2">
          {model.risks.map((risk) => (
            <RiskRow
              key={risk.id}
              risk={risk}
              open={openRisk === risk.id}
              onToggle={() => setOpenRisk((prev) => (prev === risk.id ? null : risk.id))}
            />
          ))}
        </ul>

        {model.tiptraqNights > 0 && (
          <p className="mt-4 text-xs text-ink-faint">
            {model.tiptraqComplete
              ? `${model.tiptraqNights} TipTraQ nights on file · DLMO anchor ${model.dlmoLabel}`
              : `${model.tiptraqNights}/3 nights recorded`}
          </p>
        )}
      </section>

      {model.nextSteps.length > 0 && (
        <section className="seco-app-card p-5 md:p-6">
          <p className="seco-page__eyebrow mb-1">Your next steps</p>
          <h2 className="seco-app-card__title">Today&apos;s actions</h2>
          <ol className="mt-4 space-y-3">
            {model.nextSteps.map((step, index) => (
              <li key={step.id} className="flex gap-3">
                <span
                  className="dose-dash-step-index flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-medium"
                  aria-hidden
                >
                  {index + 1}
                </span>
                <div className="min-w-0">
                  <p className="font-medium text-ink">{step.title}</p>
                  <p className="text-sm text-ink-muted">{step.detail}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>
      )}

      <section className="seco-app-card overflow-hidden !p-0">
        <div className="border-b border-border px-5 py-4 md:px-6">
          <p className="seco-page__eyebrow mb-1">Today&apos;s script</p>
          <h2 className="seco-app-card__title">Your dose cues</h2>
          <p className="mt-1 text-sm text-ink-muted">
            Body clock · <span className="font-mono text-ink">{model.dlmoLabel}</span>
            {model.clockDriftMinutes != null && model.clockDriftMinutes > 0 && (
              <span> · +{model.clockDriftMinutes}m drift</span>
            )}
          </p>
        </div>

        <ul className="divide-y divide-border">
          {model.clusters.map((cluster) => {
            const expanded = openCluster === cluster.id
            const extraDetail = cluster.id === 'meds' && medDetail ? medDetail : null

            return (
              <li key={cluster.id}>
                <button
                  type="button"
                  className="dose-dash-cluster-btn flex w-full items-start gap-4 px-5 py-4 text-left transition-colors md:px-6"
                  onClick={() =>
                    setOpenCluster((prev) => (prev === cluster.id ? null : cluster.id))
                  }
                  aria-expanded={expanded}
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-medium text-ink">{cluster.label}</span>
                      {cluster.activeNow && <Badge tone="success">Now</Badge>}
                    </div>
                    <p className="mt-0.5 font-mono text-sm tracking-tight text-ink-muted">
                      {cluster.timeLabel}
                    </p>
                    {!expanded && (
                      <p className="mt-1 text-sm text-ink-muted">{cluster.summary}</p>
                    )}
                  </div>
                  <span className="shrink-0 text-xs text-ink-faint" aria-hidden>
                    {expanded ? '−' : '+'}
                  </span>
                </button>

                {expanded && (
                  <div className="dose-dash-cluster-expand border-t px-5 py-3 md:px-6">
                    <p className="text-sm text-ink-muted">{cluster.detail}</p>
                    {extraDetail && (
                      <p className="mt-2 text-sm font-medium text-ink">{extraDetail}</p>
                    )}
                  </div>
                )}
              </li>
            )
          })}
        </ul>
      </section>
    </div>
  )
}

function RiskRow({
  risk,
  open,
  onToggle,
}: {
  risk: MetabolicRiskSignal
  open: boolean
  onToggle: () => void
}) {
  return (
    <li>
      <button
        type="button"
        className="dose-dash-risk-row flex w-full items-center gap-3 rounded-xl border border-border px-4 py-3 text-left transition-colors"
        onClick={onToggle}
        aria-expanded={open}
      >
        <span className="min-w-0 flex-1">
          <span className="text-xs font-medium uppercase tracking-wide text-ink-faint">
            {risk.label}
          </span>
          <p className="mt-0.5 text-sm font-medium text-ink">{risk.headline}</p>
        </span>
        <Badge tone={SEVERITY_TONE[risk.severity]}>{SEVERITY_LABEL[risk.severity]}</Badge>
        <span className="shrink-0 text-xs text-ink-faint" aria-hidden>
          {open ? '−' : '+'}
        </span>
      </button>
      {open && (
        <p className="px-4 pb-1 pt-2 text-sm text-ink-muted">{risk.detail}</p>
      )}
    </li>
  )
}
