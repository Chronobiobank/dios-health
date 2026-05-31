'use client'

import Link from 'next/link'
import {
  Activity,
  Dumbbell,
  FileText,
  Moon,
  Share2,
  Sun,
  Utensils,
  Wind,
} from 'lucide-react'
import { useState } from 'react'

import {
  DASHBOARD_BODY,
  DASHBOARD_CARD,
  MONO_DATA,
  SECTION_LABEL,
} from '@/components/dashboard/dashboard-styles'
import { PATIENT_ROUTES } from '@/lib/auth/routes'
import type { InsightsData, PatientProtocolRow, RiskSeverity } from '@/lib/dashboard/insights-data'
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

const ZEITGEBER_ICONS = {
  light: Sun,
  food: Utensils,
  movement: Dumbbell,
  darkness: Moon,
} as const

export function InsightsView({ data }: InsightsViewProps) {
  return (
    <div className="space-y-12 pb-8">
      <BodyClockHeader data={data} />

      {data.showRiskSection ? <RiskIndicators data={data} /> : null}

      <TimingWindows data={data} />
      <ZeitgeberSchedule data={data} />
      <CorrectionProtocol data={data} />
      <GpShareSection canShareReport={data.canShareReport} />
    </div>
  )
}

function SectionEyebrow({ children }: { children: string }) {
  return <p className={SECTION_LABEL}>{children}</p>
}

function BodyClockHeader({ data }: { data: InsightsData }) {
  if (!data.hasDlmoProfile) {
    return (
      <section className={DASHBOARD_CARD}>
        <p className={`${DASHBOARD_BODY} text-black/70`}>
          Your body clock reading is not ready yet. Upload a TipTraQ night or log your sleep on the
          Streams page.
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link
            href={PATIENT_ROUTES.streams}
            className="inline-flex h-11 items-center rounded-full bg-black px-5 text-sm font-medium text-white transition-transform active:scale-[0.98]"
          >
            Go to Streams →
          </Link>
        </div>
      </section>
    )
  }

  const confidence = data.confidenceScore ?? 0

  return (
    <section className={DASHBOARD_CARD}>
      <p className="font-mono text-3xl font-medium tracking-tight text-black sm:text-4xl">
        {data.dlmoTimeLabel}
      </p>
      <p className={`${MONO_DATA} mt-1`}>Proxy DLMO</p>

      {data.dominantLayerLabel ? (
        <span className="mt-4 inline-flex rounded-full bg-teal-50 px-3 py-1 text-xs font-medium text-teal-800">
          {data.dominantLayerLabel}
        </span>
      ) : null}

      <div className="mt-6">
        <div className="flex items-center justify-between gap-3">
          <p className={`${MONO_DATA} text-black/50`}>Confidence</p>
          <p className={`${MONO_DATA} text-black/70`}>
            {confidence}% · {data.confidenceLabel ?? '—'}
          </p>
        </div>
        <div className="mt-2 h-2 overflow-hidden rounded-full bg-black/5">
          <div
            className="h-full rounded-full bg-teal-600 transition-all duration-300"
            style={{ width: `${Math.min(100, Math.max(0, confidence))}%` }}
          />
        </div>
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        {data.layerPills.map((pill) => (
          <span
            key={pill.id}
            className={cn(
              'rounded-full px-3 py-1 font-mono text-[11px] font-medium',
              pill.active ? 'bg-teal-600 text-white' : 'bg-black/10 text-black/40'
            )}
          >
            {pill.label}
          </span>
        ))}
      </div>
    </section>
  )
}

function RiskIndicators({ data }: { data: InsightsData }) {
  return (
    <section>
      <SectionEyebrow>Your circadian risk flags</SectionEyebrow>

      <div className="mt-4 space-y-3">
        {data.riskFlags.length === 0 ? (
          <article className={`${DASHBOARD_CARD} border-teal-100 bg-teal-50/50`}>
            <p className={`${DASHBOARD_BODY} font-medium text-teal-900`}>
              No significant circadian risk flags detected from your last TipTraQ night.
            </p>
          </article>
        ) : (
          data.riskFlags.map((flag) => <RiskFlagCard key={flag.id} flag={flag} />)
        )}
      </div>
    </section>
  )
}

function RiskFlagCard({ flag }: { flag: InsightsData['riskFlags'][number] }) {
  const Icon =
    flag.id === 'apnea_confound'
      ? Wind
      : flag.id === 'non_dipper'
        ? Activity
        : flag.id === 'rem_delay'
          ? Moon
          : Activity

  return (
    <article className={DASHBOARD_CARD}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-black/[0.04] text-black/60">
            <Icon className="h-5 w-5" strokeWidth={1.5} aria-hidden />
          </div>
          <div>
            <p className="text-lg font-medium leading-snug text-black">{flag.title}</p>
            <p className={`${DASHBOARD_BODY} mt-2 text-black/65`}>{flag.summary}</p>
          </div>
        </div>
        <span
          className={cn(
            'shrink-0 rounded-full px-3 py-1 font-mono text-[11px] font-medium uppercase tracking-wider ring-1 ring-inset',
            SEVERITY_PILL[flag.severity]
          )}
        >
          {riskSeverityLabel(flag.severity)}
        </span>
      </div>
    </article>
  )
}

function TimingWindows({ data }: { data: InsightsData }) {
  return (
    <section>
      <SectionEyebrow>Your personal dose windows</SectionEyebrow>

      <div className="mt-4 space-y-3">
        {!data.hasMedicationSelection ? (
          <article className={DASHBOARD_CARD}>
            <p className={`${DASHBOARD_BODY} text-black/70`}>
              Add your medications in Settings to see your personal dose windows.
            </p>
            <Link
              href={PATIENT_ROUTES.profile}
              className={`${MONO_DATA} mt-3 inline-block hover:text-black/70`}
            >
              Open Settings →
            </Link>
          </article>
        ) : data.medicationWindows.length === 0 ? (
          <article className={DASHBOARD_CARD}>
            <p className={`${DASHBOARD_BODY} text-black/70`}>
              We could not match your selected medications to timing modules yet.
            </p>
          </article>
        ) : (
          data.medicationWindows.map((med) => (
            <article key={med.id} className={DASHBOARD_CARD}>
              <p className="text-xl font-medium text-black">{med.name}</p>
              <p className={`${MONO_DATA} mt-2 text-black/50`}>{med.standardGuidance}</p>
              <p className="mt-3 text-base font-semibold text-teal-800">{med.diosWindow}</p>
              <p className={`${DASHBOARD_BODY} mt-2 text-black/65`}>{med.explanation}</p>
              {med.showCaveat ? (
                <p className={`${MONO_DATA} mt-2 text-black/50`}>Add more data to increase precision</p>
              ) : null}
            </article>
          ))
        )}
      </div>
    </section>
  )
}

function ZeitgeberSchedule({ data }: { data: InsightsData }) {
  return (
    <section>
      <SectionEyebrow>Your zeitgeber schedule</SectionEyebrow>

      <div className="mt-4 space-y-3">
        {data.zeitgebers.map((card) => {
          const Icon = ZEITGEBER_ICONS[card.id]
          return (
            <article key={card.id} className={DASHBOARD_CARD}>
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-black/[0.04] text-black/60">
                  <Icon className="h-5 w-5" strokeWidth={1.5} aria-hidden />
                </div>
                <div>
                  <p className="font-mono text-2xl font-medium tracking-tight text-black">
                    {card.timeLabel}
                  </p>
                  <p className="mt-1 text-sm font-medium text-black">{card.title}</p>
                  <p className={`${DASHBOARD_BODY} mt-2 text-black/65`}>{card.instruction}</p>
                </div>
              </div>
            </article>
          )
        })}
      </div>
    </section>
  )
}

function CorrectionProtocol({ data }: { data: InsightsData }) {
  const gominakD3 = data.activeProtocols.find((p) => p.protocol_type === 'gominak_d3')
  const coimbraD3 = data.activeProtocols.find((p) => p.protocol_type === 'coimbra_d3')
  const gominakB = data.activeProtocols.find((p) => p.protocol_type === 'gominak_b_vitamins')

  return (
    <section>
      <SectionEyebrow>Your body clock correction</SectionEyebrow>

      <div className="mt-4 space-y-3">
        {gominakD3 ? <D3ProtocolCard protocol={gominakD3} supervised={false} /> : null}
        {coimbraD3 ? <D3ProtocolCard protocol={coimbraD3} supervised /> : null}
        {gominakB ? (
          <BVitaminProtocolCard protocol={gominakB} blood={data.latestBloodPanel} />
        ) : null}

        {!gominakD3 && !coimbraD3 && !gominakB ? (
          <article className={DASHBOARD_CARD}>
            <p className={`${DASHBOARD_BODY} text-black/70`}>{data.protocolIdleMessage}</p>
            <Link
              href={`${PATIENT_ROUTES.report}?print=1`}
              className={`${MONO_DATA} mt-4 inline-block hover:text-black/70`}
            >
              Discuss with your GP →
            </Link>
          </article>
        ) : null}
      </div>
    </section>
  )
}

function D3ProtocolCard({
  protocol,
  supervised,
}: {
  protocol: PatientProtocolRow
  supervised: boolean
}) {
  return (
    <article className={DASHBOARD_CARD}>
      <div className="flex flex-wrap items-center gap-2">
        <p className="text-lg font-medium text-black">
          {supervised ? 'Coimbra high-dose D3' : 'Gominak D3 protocol'}
        </p>
        {supervised ? (
          <span className="rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-medium text-amber-900">
            Clinician supervision
          </span>
        ) : null}
      </div>
      <dl className="mt-4 space-y-2">
        <div className="flex justify-between gap-4">
          <dt className={MONO_DATA}>Current D3</dt>
          <dd className="font-mono text-sm text-black">
            {protocol.current_d3_nmoll ?? '—'} nmol/L
          </dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className={MONO_DATA}>Target</dt>
          <dd className="font-mono text-sm text-black">
            {protocol.target_d3_nmoll ?? '—'} nmol/L
          </dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className={MONO_DATA}>Daily dose</dt>
          <dd className="font-mono text-sm text-black">
            {protocol.d3_dose_iu != null ? `${protocol.d3_dose_iu.toLocaleString('en-GB')} IU` : '—'}
          </dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className={MONO_DATA}>Next review</dt>
          <dd className="font-mono text-sm text-black">{formatReviewDate(protocol.review_at)}</dd>
        </div>
      </dl>
      {protocol.cofactors && Object.keys(protocol.cofactors).length > 0 ? (
        <p className={`${DASHBOARD_BODY} mt-4 text-black/65`}>
          Cofactors: {formatCofactors(protocol.cofactors)}
        </p>
      ) : null}
    </article>
  )
}

function BVitaminProtocolCard({
  protocol,
  blood,
}: {
  protocol: PatientProtocolRow
  blood: InsightsData['latestBloodPanel']
}) {
  const targets = protocol.b_vitamin_targets ?? {}

  return (
    <article className={DASHBOARD_CARD}>
      <p className="text-lg font-medium text-black">Gominak B vitamins</p>
      <ul className="mt-4 space-y-2">
        <VitaminRow label="B12" current={blood?.vitamin_b12_pmoll} target={targets.b12_pmoll} unit="pmol/L" />
        <VitaminRow label="Ferritin" current={blood?.ferritin_ugl} target={targets.ferritin_ugl} unit="μg/L" />
        <VitaminRow label="B5" current={blood?.vitamin_b5_umoll} target={targets.b5_umoll} unit="μmol/L" />
      </ul>
      <p className={`${MONO_DATA} mt-4`}>
        Next review: {formatReviewDate(protocol.review_at)}
      </p>
    </article>
  )
}

function VitaminRow({
  label,
  current,
  target,
  unit,
}: {
  label: string
  current: number | null | undefined
  target: unknown
  unit: string
}) {
  const targetLabel = formatTargetLabel(target, unit)

  return (
    <li className="flex justify-between gap-4">
      <span className={MONO_DATA}>{label}</span>
      <span className="font-mono text-sm text-black">
        {current ?? '—'} / {targetLabel}
      </span>
    </li>
  )
}

function GpShareSection({ canShareReport }: { canShareReport: boolean }) {
  const [shareMessage, setShareMessage] = useState<string | null>(null)

  async function handleShare() {
    const reportUrl = `${window.location.origin}${PATIENT_ROUTES.report}`

    try {
      await navigator.clipboard.writeText(reportUrl)
      setShareMessage('Report link copied — paste into a message for your GP.')
    } catch {
      setShareMessage('Could not copy link. Open the GP report and share from your browser.')
    }
  }

  return (
    <section>
      <SectionEyebrow>Share with your clinician</SectionEyebrow>

      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <Link
          href={`${PATIENT_ROUTES.report}?print=1`}
          className={`${DASHBOARD_CARD} flex min-h-[5.5rem] flex-col justify-center gap-2 transition-transform active:scale-[0.99] hover:bg-black/[0.02]`}
        >
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-black/50" strokeWidth={1.5} aria-hidden />
            <p className="text-base font-medium text-black">Print GP report</p>
          </div>
          <p className={`${DASHBOARD_BODY} text-black/60`}>
            A one-page summary of your body clock, risk flags, and dose windows.
          </p>
        </Link>

        <button
          type="button"
          disabled={!canShareReport}
          onClick={() => void handleShare()}
          className={`${DASHBOARD_CARD} flex min-h-[5.5rem] flex-col justify-center gap-2 text-left transition-transform active:scale-[0.99] hover:bg-black/[0.02] disabled:cursor-not-allowed disabled:opacity-45`}
        >
          <div className="flex items-center gap-2">
            <Share2 className="h-5 w-5 text-black/50" strokeWidth={1.5} aria-hidden />
            <p className="text-base font-medium text-black">Share results</p>
          </div>
          <p className={`${DASHBOARD_BODY} text-black/60`}>
            Send your clinician a link to your body clock report.
          </p>
        </button>
      </div>

      <p className={`${MONO_DATA} mt-6 text-center leading-relaxed`}>
        Your GP can order a full DLMO blood test to confirm these results.
      </p>

      {shareMessage ? (
        <p role="status" className="mt-3 text-center text-sm text-black/60">
          {shareMessage}
        </p>
      ) : null}
    </section>
  )
}

function formatTargetLabel(target: unknown, unit: string): string {
  if (target && typeof target === 'object' && target !== null && 'min' in target && 'max' in target) {
    const range = target as { min: number; max: number }
    return `${range.min}–${range.max} ${unit}`
  }

  if (target != null) return String(target)
  return '—'
}

function formatReviewDate(value: string | null): string {
  if (!value) return '—'
  return new Date(value).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

function formatCofactors(cofactors: Record<string, unknown>): string {
  return Object.entries(cofactors)
    .map(([key, value]) => `${key.replace(/_/g, ' ')}: ${String(value)}`)
    .join(' · ')
}
