import Image from 'next/image'
import Link from 'next/link'
import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  HeartPulse,
  Moon,
  ShieldAlert,
  Wind,
} from 'lucide-react'

import { InsightsGpActions } from '@/components/dashboard/insights-gp-actions'
import {
  BODY,
  TILE_BODY,
  TILE_CARD,
  TILE_GRID,
  TILE_HEADER,
  TILE_IMAGE,
} from '@/components/sections/layout'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { PATIENT_ROUTES } from '@/lib/auth/routes'
import type { CircadianRiskFlag, InsightsData, RiskSeverity } from '@/lib/dashboard/insights-data'
import { riskSeverityLabel } from '@/lib/dashboard/insights-data'
import { cn } from '@/lib/utils'

type InsightsViewProps = {
  data: InsightsData
}

const SEVERITY_PILL: Record<RiskSeverity, string> = {
  watch: 'bg-amber-100 text-amber-900 ring-amber-200/80',
  moderate: 'bg-orange-100 text-orange-900 ring-orange-200/80',
  act: 'bg-red-100 text-red-900 ring-red-200/80',
}

const RISK_ICONS: Record<string, typeof Wind> = {
  apnea_confound: Wind,
  non_dipper: HeartPulse,
  high_sympathetic: Activity,
  rem_delay: Moon,
}

export function InsightsView({ data }: InsightsViewProps) {
  return (
    <div className="pb-6">
      <header className="pt-2">
        <p className="font-mono text-xs uppercase tracking-[0.14em] text-black/45">Insights</p>
        <h1 className="type-section mt-3 text-[1.75rem] leading-[1.15] tracking-tight sm:text-[2rem]">
          Your circadian timing plan
        </h1>
        <p className="type-body mt-4 max-w-md text-black/60">
          {data.hasTipTraqData
            ? `Personalised from your proxy DLMO at ${data.dlmoTimeLabel}.`
            : `Estimated from your onboarding answers until TipTraQ refines your DLMO.`}
        </p>
      </header>

      {/* Section 1 — Risk indicators */}
      <section className="mt-12">
        <p className="font-mono text-xs uppercase tracking-[0.14em] text-black/45">
          Your circadian risk indicators
        </p>

        <div className={TILE_GRID}>
          {data.riskFlags.length === 0 ? (
            <RiskClearCard hasTipTraqData={data.hasTipTraqData} />
          ) : (
            data.riskFlags.map((flag) => <RiskFlagCard key={flag.id} flag={flag} />)
          )}
        </div>
      </section>

      {/* Section 2 — Daily cues */}
      <section className="mt-14">
        <p className="font-mono text-xs uppercase tracking-[0.14em] text-black/45">
          Lifestyle interventions
        </p>
        <p className="mt-3 text-lg font-medium leading-snug text-black">
          Four daily cues timed to your body clock
        </p>

        <div className={TILE_GRID}>
          {data.zeitgebers.map((card) => (
            <ZeitgeberCard key={card.id} card={card} />
          ))}
        </div>
      </section>

      {/* Section 3 — GP */}
      <section className="mt-14">
        <p className="font-mono text-xs uppercase tracking-[0.14em] text-black/45">Talk to your GP</p>
        <h2 className="mt-3 text-xl font-medium leading-snug text-black sm:text-2xl">
          Bring your clinician into the loop
        </h2>

        <div className={cn(TILE_GRID, 'mt-6')}>
          <Card className={cn(TILE_CARD, 'bg-[#FAFAFA]')}>
            <CardContent className={cn(TILE_BODY, 'pt-6')}>
              <InsightsGpActions canShareReport={data.canShareReport} />
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}

function RiskClearCard({ hasTipTraqData }: { hasTipTraqData: boolean }) {
  return (
    <Card className={TILE_CARD}>
      <CardHeader className={cn(TILE_HEADER, 'sm:flex-row sm:items-center')}>
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-teal-600/10 text-teal-700">
          <CheckCircle2 className="h-7 w-7" strokeWidth={1.5} aria-hidden />
        </div>
        <p className="type-tile-title">
          {hasTipTraqData ? 'No circadian risk flags raised' : 'Upload TipTraQ to scan for risk flags'}
        </p>
      </CardHeader>
      <CardContent className={TILE_BODY}>
        <p className={BODY}>
          {hasTipTraqData
            ? 'Your recent sleep recordings show no elevated circadian strain signals in our proxy model.'
            : 'Once you upload nightly recordings, DIOS checks for apnea confounds, REM delay, sympathetic load, and non-dipping patterns.'}
        </p>
        {!hasTipTraqData ? (
          <Link
            href={PATIENT_ROUTES.streams}
            className="inline-flex h-11 items-center rounded-full bg-black px-5 text-sm font-medium text-white transition-transform active:scale-[0.98]"
          >
            Connect TipTraQ →
          </Link>
        ) : null}
      </CardContent>
    </Card>
  )
}

function RiskFlagCard({ flag }: { flag: CircadianRiskFlag }) {
  const Icon = RISK_ICONS[flag.id] ?? ShieldAlert

  return (
    <Card className={TILE_CARD}>
      <CardHeader className={cn(TILE_HEADER, 'flex-row items-start justify-between')}>
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-black/[0.04] text-black/70">
          <Icon className="h-6 w-6" strokeWidth={1.5} aria-hidden />
        </div>
        <span
          className={cn(
            'shrink-0 rounded-full px-3 py-1 font-mono text-[11px] font-medium uppercase tracking-wider ring-1 ring-inset',
            SEVERITY_PILL[flag.severity]
          )}
        >
          {riskSeverityLabel(flag.severity)}
        </span>
      </CardHeader>
      <CardContent className={TILE_BODY}>
        <p className="type-tile-title">{flag.headline}</p>
        <p className={BODY}>{flag.summary}</p>
        {flag.severity === 'act' ? (
          <p className="flex items-center gap-2 font-mono text-xs text-red-800/80">
            <AlertTriangle className="h-3.5 w-3.5" aria-hidden />
            Discuss with your GP
          </p>
        ) : null}
      </CardContent>
    </Card>
  )
}

function ZeitgeberCard({
  card,
}: {
  card: InsightsData['zeitgebers'][number]
}) {
  return (
    <Card className={TILE_CARD}>
      <Image
        src={card.imageUrl}
        alt={card.imageAlt}
        width={1200}
        height={800}
        className={TILE_IMAGE}
      />
      <CardHeader className={TILE_HEADER}>
        <p className="type-tile-title">
          {card.title} at {card.timeLabel}
        </p>
      </CardHeader>
      <CardContent className={TILE_BODY}>
        <p className={BODY}>{card.instruction}</p>
        <p className="type-caption">Timed to your body clock</p>
      </CardContent>
    </Card>
  )
}
