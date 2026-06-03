import Link from 'next/link'
import { Bell, Lock, Search } from 'lucide-react'

import { GpReportButton } from '@/components/dashboard/gp-report-button'
import { ProfileAvatar } from '@/components/profile/profile-avatar'
import { PATIENT_ROUTES } from '@/lib/auth/routes'
import type { CommandCentreViewModel } from '@/lib/dashboard/command-centre'
import { cn } from '@/lib/utils'

const CARD = 'rounded-2xl border border-black/[0.06] bg-white/90 p-4 shadow-sm backdrop-blur-sm sm:p-5'
const LABEL = 'font-mono text-[10px] uppercase tracking-[0.14em] text-black/45'

type PatientCommandCentreProps = {
  model: CommandCentreViewModel
}

export function PatientCommandCentre({ model }: PatientCommandCentreProps) {
  const progress =
    model.alignmentTarget > model.alignmentScore
      ? ((model.alignmentScore - 30) / (model.alignmentTarget - 30)) * 100
      : 100

  return (
    <div className="command-centre mx-auto w-full max-w-[1200px]">
      <header className="mb-4 flex flex-col gap-4 sm:mb-6 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-semibold tracking-tight text-black sm:text-3xl">
          {model.greeting}
        </h1>
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="hidden min-w-[10rem] items-center gap-2 rounded-full border border-black/10 bg-white/80 px-3 py-2 text-sm text-black/40 sm:flex">
            <Search className="h-4 w-4 shrink-0" aria-hidden />
            <span className="truncate">{model.fullName}</span>
          </div>
          <button type="button" className="dios-page-actions__icon-btn" aria-label="Notifications">
            <Bell className="h-5 w-5" strokeWidth={1.75} />
          </button>
          <Link href={PATIENT_ROUTES.dataControls} aria-label="Profile and settings">
            <ProfileAvatar name={model.fullName} src={model.avatarUrl} size="sm" />
          </Link>
        </div>
      </header>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,280px)_minmax(0,1fr)_minmax(0,260px)] xl:gap-5">
        <aside className="flex flex-col gap-4">
          <article className={CARD}>
            <p className={LABEL}>DLMO score (proxy)</p>
            <p className="mt-2 text-4xl font-medium tracking-tight text-black">{model.dlmoTime}</p>
            <p className="mt-2 text-sm leading-relaxed text-black/60">{model.dlmoSummary}</p>
            <p className="mt-1 text-xs text-black/45">{model.dlmoPopulationNote}</p>
            <DlmoTimeline marker={model.dlmoTime} />
          </article>

          <article className={CARD}>
            <p className={LABEL}>mLux score (proxy)</p>
            <p className="mt-2 text-4xl font-medium tracking-tight text-black">
              {model.mluxScore}
              <span className="text-lg font-normal text-black/35">/100</span>
            </p>
            <p className="mt-2 text-sm leading-relaxed text-black/60">{model.mluxSummary}</p>
            <div className="mt-4 flex items-end gap-3">
              <ExposureBar label="Morning" level={model.mluxMorningLabel} height={28} />
              <ExposureBar label="Evening" level={model.mluxEveningLabel} height={52} warn />
            </div>
          </article>

          <article className={CARD}>
            <p className={LABEL}>Desynchrony spectrum</p>
            <DesyncFlow nodes={model.spectrumNodes} />
          </article>

          <article className={CARD}>
            <p className={LABEL}>Diagnostic layer status</p>
            <ul className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-3 xl:grid-cols-1">
              {model.layers.map((layer) => (
                <li key={layer.id}>
                  {layer.href ? (
                    <Link
                      href={layer.href}
                      className={cn(
                        'block rounded-xl border px-3 py-2.5 transition-colors hover:bg-black/[0.02]',
                        layer.connected
                          ? 'border-emerald-200/80 bg-emerald-50/50'
                          : 'border-black/[0.08] bg-black/[0.02]'
                      )}
                    >
                      <LayerCardContent layer={layer} />
                    </Link>
                  ) : (
                    <div
                      className={cn(
                        'rounded-xl border px-3 py-2.5',
                        layer.connected
                          ? 'border-emerald-200/80 bg-emerald-50/50'
                          : 'border-black/[0.08] bg-black/[0.02]'
                      )}
                    >
                      <LayerCardContent layer={layer} />
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </article>
        </aside>

        <section className="flex flex-col gap-4">
          <article className={cn(CARD, 'relative min-h-[320px] overflow-hidden p-0 sm:min-h-[420px]')}>
            <div
              className="pointer-events-none absolute inset-0 opacity-40"
              aria-hidden
              style={{
                backgroundImage:
                  'radial-gradient(circle at 50% 42%, rgb(201 151 58 / 0.12) 0%, transparent 55%)',
              }}
            />
            <BodyHub callouts={model.organCallouts} />
          </article>

          <article className={CARD}>
            <p className={LABEL}>Circadian alignment score</p>
            <p className="mt-2 text-5xl font-medium tracking-tight text-[#3B82C4]">
              {model.alignmentScore.toFixed(2)}
            </p>
            <div className="mt-4">
              <div className="h-2.5 overflow-hidden rounded-full bg-black/[0.06]">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[#7DD3FC] via-[#FDBA74] to-[#FB923C]"
                  style={{ width: `${Math.max(8, Math.min(100, progress))}%` }}
                />
              </div>
              <div className="mt-2 flex justify-between text-xs text-black/50">
                <span>
                  {model.alignmentScore}/100 {model.alignmentStateLabel}
                </span>
                <span>
                  {model.alignmentTarget}/100 {model.alignmentTargetLabel}
                </span>
              </div>
            </div>
            <p className="mt-3 text-sm text-black/55">{model.protocolNote}</p>
          </article>
        </section>

        <aside className="flex flex-col gap-4">
          <article className={CARD}>
            <p className={LABEL}>Re-entrainment protocol</p>
            <ol className="relative mt-4 space-y-0 border-l border-black/10 pl-4">
              {model.protocolSteps.map((step, index) => (
                <li key={step.id} className="relative pb-5 last:pb-0">
                  <span
                    className={cn(
                      'absolute -left-[1.3rem] top-1.5 h-2.5 w-2.5 rounded-full border-2 border-white',
                      step.state === 'active' && 'bg-emerald-500',
                      step.state === 'locked' && 'bg-amber-400',
                      step.state === 'pending' && 'bg-black/20'
                    )}
                    aria-hidden
                  />
                  <p className="font-mono text-[11px] text-black/40">{step.timeLabel}</p>
                  <div className="mt-0.5 flex items-start gap-2">
                    <p className="text-sm font-medium text-black">{step.title}</p>
                    {step.state === 'locked' ? (
                      <Lock className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-600" aria-hidden />
                    ) : null}
                  </div>
                  <p className="mt-1 text-xs leading-relaxed text-black/55">{step.detail}</p>
                  {index < model.protocolSteps.length - 1 ? (
                    <span className="sr-only">; </span>
                  ) : null}
                </li>
              ))}
            </ol>
          </article>
        </aside>
      </div>

      {model.showGpReport ? (
        <div className="mt-6">
          <GpReportButton />
        </div>
      ) : null}
    </div>
  )
}

function LayerCardContent({
  layer,
}: {
  layer: CommandCentreViewModel['layers'][number]
}) {
  return (
    <>
      <p className="text-xs font-medium text-black">
        {layer.label} — {layer.title}
      </p>
      <p
        className={cn(
          'mt-1 text-[11px]',
          layer.connected ? 'text-emerald-700' : 'text-black/45'
        )}
      >
        {layer.status}
      </p>
    </>
  )
}

function DlmoTimeline({ marker }: { marker: string }) {
  return (
    <svg viewBox="0 0 240 32" className="mt-4 w-full" aria-hidden>
      <rect x="0" y="8" width="240" height="16" rx="4" fill="rgb(0 0 0 / 0.06)" />
      <rect x="48" y="8" width="96" height="16" rx="4" fill="rgb(74 222 128 / 0.35)" />
      <rect x="144" y="8" width="96" height="16" rx="4" fill="rgb(248 113 113 / 0.25)" />
      <text x="8" y="6" fontSize="9" fill="rgb(0 0 0 / 0.35)">
        18:00
      </text>
      <text x="220" y="6" fontSize="9" fill="rgb(0 0 0 / 0.35)" textAnchor="end">
        02:00
      </text>
      <text x="168" y="22" fontSize="9" fill="rgb(0 0 0 / 0.5)" textAnchor="middle">
        {marker}
      </text>
    </svg>
  )
}

function ExposureBar({
  label,
  level,
  height,
  warn,
}: {
  label: string
  level: string
  height: number
  warn?: boolean
}) {
  return (
    <div className="flex-1">
      <div className="flex h-16 items-end rounded-lg bg-black/[0.04] px-2 pb-1">
        <div
          className={cn('w-full rounded-sm', warn ? 'bg-red-400/80' : 'bg-red-300/60')}
          style={{ height }}
        />
      </div>
      <p className="mt-1 text-[11px] text-black/50">
        {label}: <span className={warn ? 'text-red-600' : ''}>{level}</span>
      </p>
    </div>
  )
}

function DesyncFlow({ nodes }: { nodes: CommandCentreViewModel['spectrumNodes'] }) {
  const top = nodes.slice(0, 3)
  const bottom = nodes.slice(3, 6)

  return (
    <div className="mt-3 space-y-2">
      <FlowRow nodes={top} />
      {bottom.length > 0 ? <FlowRow nodes={bottom} /> : null}
    </div>
  )
}

function FlowRow({ nodes }: { nodes: { label: string; shortLabel: string }[] }) {
  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {nodes.map((node, index) => (
        <span key={node.label} className="inline-flex items-center gap-1.5">
          <span className="rounded-lg border border-black/[0.08] bg-[#FAF7F2] px-2 py-1 text-[10px] font-medium leading-tight text-black/70">
            {node.shortLabel}
          </span>
          {index < nodes.length - 1 ? (
            <span className="text-black/25" aria-hidden>
              →
            </span>
          ) : null}
        </span>
      ))}
    </div>
  )
}

const CALLOUT_POSITIONS: Record<string, string> = {
  brain: 'left-[6%] top-[8%] max-w-[38%]',
  airway: 'right-[4%] top-[22%] max-w-[40%]',
  heart: 'left-[4%] top-[38%] max-w-[38%]',
  liver: 'right-[2%] top-[52%] max-w-[42%]',
  gi: 'left-[8%] bottom-[18%] max-w-[40%]',
}

function BodyHub({ callouts }: { callouts: CommandCentreViewModel['organCallouts'] }) {
  return (
    <div className="relative aspect-[4/5] w-full min-h-[300px] sm:min-h-[380px]">
      <svg
        viewBox="0 0 200 360"
        className="absolute left-1/2 top-1/2 h-[88%] w-auto -translate-x-1/2 -translate-y-1/2 text-black/20"
        aria-hidden
      >
        <ellipse cx="100" cy="36" rx="28" ry="32" fill="currentColor" opacity="0.35" />
        <rect x="78" y="64" width="44" height="72" rx="12" fill="currentColor" opacity="0.28" />
        <rect x="58" y="72" width="18" height="56" rx="8" fill="currentColor" opacity="0.22" />
        <rect x="124" y="72" width="18" height="56" rx="8" fill="currentColor" opacity="0.22" />
        <rect x="86" y="136" width="16" height="88" rx="6" fill="currentColor" opacity="0.24" />
        <rect x="98" y="136" width="16" height="88" rx="6" fill="currentColor" opacity="0.24" />
        <ellipse cx="100" cy="248" rx="36" ry="28" fill="currentColor" opacity="0.2" />
      </svg>

      {callouts.map((callout) => (
        <div
          key={callout.id}
          className={cn(
            'absolute rounded-lg border border-black/[0.08] bg-white/95 px-2.5 py-2 shadow-sm backdrop-blur-sm',
            CALLOUT_POSITIONS[callout.id] ?? 'right-[4%] top-[10%] max-w-[42%]'
          )}
        >
          <p className="text-[10px] font-semibold uppercase tracking-wide text-black/55">
            {callout.organ}
          </p>
          <p
            className={cn(
              'mt-0.5 text-xs leading-snug',
              callout.tone === 'alert' && 'text-red-700',
              callout.tone === 'warn' && 'text-amber-800',
              callout.tone === 'neutral' && 'text-black/70'
            )}
          >
            {callout.detail}
          </p>
        </div>
      ))}
    </div>
  )
}
