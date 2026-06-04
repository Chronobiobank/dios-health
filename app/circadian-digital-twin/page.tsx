import type { Metadata } from 'next'
import type { ReactNode } from 'react'

import { CircadianYearsIntro } from '@/components/evidence/circadian-years-intro'

interface DemoData {
  patient: { name: string; gp: string; icb: string; date: string }
  scores: { alignment: number; recovery: number }
  dlmo: { time: string; populationMedian: string; delayMinutes: number }
  mlux: { score: number; morning: 'Low' | 'Normal' | 'High'; evening: 'Low' | 'Normal' | 'High' }
  chronotype: { pattern: string; sleepOnset: string; wake: string; efficiency: number }
  sleep: { total: string; timeInBed: string; efficiency: number; start: string; end: string }
  breathing: { ahi: number; ahiStatus: string; spo2: string; snoring: number }
  autonomic: { sns: number; pns: number }
  medications: Array<{
    name: string
    current: string
    evidence: string
    action: string
    actionType: 'alert' | 'warn' | 'ok'
  }>
  tiptraq: { lastSync: string; status: string }
}

const DEMO_DATA: DemoData = {
  patient: { name: 'M.H.', gp: 'Dr J. Patel', icb: 'NHS Greater Manchester ICB', date: '03 Jun 2026' },
  scores: { alignment: 42, recovery: 38 },
  dlmo: { time: '23:05', populationMedian: '21:00–22:00', delayMinutes: 90 },
  mlux: { score: 32, morning: 'Low', evening: 'High' },
  chronotype: { pattern: 'Delayed sleep phase', sleepOnset: '03:09', wake: '07:45', efficiency: 66 },
  sleep: { total: '3h 27m', timeInBed: '5h 38m', efficiency: 66, start: '03:09', end: '07:45' },
  breathing: { ahi: 4.6, ahiStatus: 'Normal', spo2: '94–98%', snoring: 31 },
  autonomic: { sns: 83, pns: 17 },
  medications: [
    {
      name: 'Ramipril 5 mg',
      current: 'Morning',
      evidence: 'Bedtime',
      action: 'Retiming indicated',
      actionType: 'alert',
    },
    {
      name: 'Atorvastatin 20 mg',
      current: 'Morning',
      evidence: 'Evening',
      action: 'Retiming indicated',
      actionType: 'alert',
    },
    {
      name: 'Omeprazole 20 mg',
      current: 'As needed',
      evidence: '30 min before breakfast',
      action: 'Timing to confirm',
      actionType: 'warn',
    },
    {
      name: 'Melatonin 2 mg MR',
      current: 'Fixed 22:00',
      evidence: 'DLMO-adjusted 21:00',
      action: 'Phase mismatch',
      actionType: 'alert',
    },
  ],
  tiptraq: { lastSync: '03 Jun 2026 07:52', status: 'Active' },
}

export const metadata: Metadata = {
  title: 'Circadian model — Calendar vs circadian years | DIOS',
  description:
    'How DIOS compares calendar years and circadian years on your dashboard — and the clinical signals behind the digital twin.',
}

const TILE_CLASS = 'rounded-2xl border border-slate-100 bg-white p-4 shadow-sm'
const TILE_LABEL = 'mb-1 text-xs uppercase tracking-wide text-slate-400'
const BIG_NUMBER = 'text-2xl font-medium text-slate-900'
const SUB_TEXT = 'mt-1 text-xs leading-relaxed text-slate-500'

const LAYERS = [
  {
    label: 'L1 — Vaya',
    desc: 'Camera · conversation · melanopic proxy',
    dot: 'bg-purple-300',
    pill: 'border-purple-200 bg-purple-50 text-purple-700',
    status: 'Not connected',
    statusColor: 'text-slate-400',
  },
  {
    label: 'L2 — Gominak panel',
    desc: 'D3 · B12 · ferritin · PTH blood assay',
    dot: 'bg-teal-300',
    pill: 'border-teal-200 bg-teal-50 text-teal-700',
    status: 'Not connected',
    statusColor: 'text-slate-400',
  },
  {
    label: 'L3 — TipTraQ',
    desc: 'PPG · HRV · sleep staging · autonomic balance',
    dot: 'bg-green-400',
    pill: 'border-green-200 bg-green-50 text-green-700',
    status: 'Active · synced 07:52',
    statusColor: 'text-green-600',
  },
] as const

function SourceRow({ children }: { children: ReactNode }) {
  return (
    <div className="mt-2 flex items-center gap-1.5 border-t border-slate-100 pt-2 text-xs text-slate-400">
      <span className="font-medium text-slate-500">Source:</span>
      {children}
    </div>
  )
}

function ProxyBadge() {
  return (
    <span className="rounded border border-amber-100 bg-amber-50 px-1.5 py-0.5 text-xs font-medium text-amber-600">
      proxy
    </span>
  )
}

function MedActionBadge({ type, label }: { type: 'alert' | 'warn' | 'ok'; label: string }) {
  const styles = {
    alert: 'border-red-100 bg-red-50 text-red-700',
    warn: 'border-amber-100 bg-amber-50 text-amber-700',
    ok: 'border-green-100 bg-green-50 text-green-700',
  } as const
  return (
    <span className={`shrink-0 rounded border px-2 py-0.5 text-xs ${styles[type]}`}>{label}</span>
  )
}

function DashboardHeader({ data }: { data: DemoData }) {
  const { patient, scores, dlmo, tiptraq } = data
  return (
    <header className={`${TILE_CLASS} mb-3 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between`}>
      <div>
        <h1 className="text-base font-medium text-slate-900">DIʘS — Circadian Digital Twin</h1>
        <p className="mt-1 text-xs text-slate-500">
          Patient: {patient.name} · GP: {patient.gp} · {patient.icb} · {patient.date}
        </p>
        <div className="mt-1 flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-3 py-0.5 text-xs text-slate-600">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-green-400" />
            Layer 3 — TipTraQ · PranaQ · Last sync: {tiptraq.lastSync}
          </span>
          <span className="text-xs text-slate-400">Proxy pipeline active</span>
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-4">
          <div className="text-center">
            <p className="text-xl font-medium text-red-500">
              {scores.alignment}
              <span className="text-sm font-normal text-slate-400">/100</span>
            </p>
            <p className="text-xs text-slate-400">Circadian alignment</p>
          </div>
          <div className="h-10 w-px bg-slate-200" aria-hidden />
          <div className="text-center">
            <p className="text-xl font-medium text-amber-500">
              {scores.recovery}
              <span className="text-sm font-normal text-slate-400">/100</span>
            </p>
            <p className="text-xs text-slate-400">Recovery readiness</p>
          </div>
        </div>
        <span className="rounded-full border border-red-100 bg-red-50 px-3 py-1 text-xs text-red-700">
          Late chronotype · DLMO {dlmo.time} (proxy)
        </span>
      </div>
    </header>
  )
}

function DataLayerLegend() {
  return (
    <div className="mb-3 flex flex-col gap-3 sm:flex-row">
      {LAYERS.map((layer) => (
        <div
          key={layer.label}
          className={`flex flex-1 items-start gap-2.5 rounded-xl border px-3 py-2.5 ${layer.pill}`}
        >
          <span className={`mt-1 h-2 w-2 shrink-0 rounded-full ${layer.dot}`} aria-hidden />
          <div>
            <p className="text-xs font-medium">{layer.label}</p>
            <p className="mt-0.5 text-xs opacity-70">{layer.desc}</p>
            <p className={`mt-1 text-xs font-medium ${layer.statusColor}`}>{layer.status}</p>
          </div>
        </div>
      ))}
    </div>
  )
}

function DLMOTile({ data }: { data: DemoData }) {
  return (
    <article className={TILE_CLASS}>
      <p className={TILE_LABEL}>Tile 1 — Circadian phase</p>
      <div className="flex items-baseline gap-2">
        <span className={BIG_NUMBER}>{data.dlmo.time}</span>
        <ProxyBadge />
      </div>
      <p className={SUB_TEXT}>
        Internal night begins ~23:00. Population median {data.dlmo.populationMedian}. Patient is ~{' '}
        {data.dlmo.delayMinutes} min delayed.
      </p>
      <svg viewBox="0 0 180 48" className="mt-3 w-full" aria-hidden>
        <rect x="0" y="12" width="180" height="24" rx="4" fill="#E2E8F0" />
        <rect x="0" y="12" width="72" height="24" rx="4" fill="#3B8BD4" opacity="0.3" />
        <rect x="72" y="12" width="108" height="24" rx="4" fill="#E24B4A" opacity="0.25" />
        <line x1="118" y1="12" x2="118" y2="36" stroke="#E24B4A" strokeWidth="2" strokeLinecap="round" />
        <text x="118" y="46" textAnchor="middle" fontSize="10" fill="#94A3B8">
          {data.dlmo.time}
        </text>
        <text x="4" y="13" fontSize="9" fill="#94A3B8">
          18:00
        </text>
        <text x="150" y="13" fontSize="9" fill="#94A3B8" textAnchor="end">
          02:00
        </text>
      </svg>
      <SourceRow>TipTraQ PPG · HRV inflection · Solar zenith · Fitzpatrick correction</SourceRow>
    </article>
  )
}

function MLuxTile({ data }: { data: DemoData }) {
  return (
    <article className={TILE_CLASS}>
      <p className={TILE_LABEL}>Tile 2 — Light exposure</p>
      <div className="flex items-baseline gap-2">
        <span className={BIG_NUMBER}>{data.mlux.score}</span>
        <span className="text-sm text-slate-400">/ 100</span>
        <ProxyBadge />
      </div>
      <p className="mt-2 text-xs text-slate-600">
        Morning: <span className="font-medium text-red-500">{data.mlux.morning}</span> · Evening:{' '}
        <span className="font-medium text-red-500">{data.mlux.evening}</span>
      </p>
      <div className="mt-2 h-1.5 w-full rounded-full bg-slate-100">
        <div
          className="h-full rounded-full bg-red-400"
          style={{ width: `${data.mlux.score}%` }}
        />
      </div>
      <p className={SUB_TEXT}>
        Evening light suppressing melatonin onset. Primary upstream zeitgeber misaligned.
      </p>
      <SourceRow>TipTraQ sleep architecture · REM suppression · Autonomic wake signal</SourceRow>
    </article>
  )
}

function ChronotypeTile({ data }: { data: DemoData }) {
  return (
    <article className={TILE_CLASS}>
      <p className={TILE_LABEL}>Tile 3 — Chronotype pattern</p>
      <span className="inline-block rounded-full border border-red-100 bg-red-50 px-2.5 py-0.5 text-xs text-red-700">
        {data.chronotype.pattern}
      </span>
      <p className={SUB_TEXT}>
        Sleep onset: {data.chronotype.sleepOnset} · Wake: {data.chronotype.wake} · Efficiency:{' '}
        {data.chronotype.efficiency}%
      </p>
      <div className="my-2 border-t border-slate-100" />
      <p className="text-xs leading-relaxed text-slate-500">
        78% of ADHD patients share this phenotype (DLMO delay ≥45 min). Non-dipping hypertension risk
        elevated.
      </p>
      <SourceRow>TipTraQ sleep staging · DLMO proxy anchor</SourceRow>
    </article>
  )
}

function CircadianRingSVG({ data }: { data: DemoData }) {
  return (
    <div className="flex items-center justify-center rounded-2xl border border-slate-100 bg-slate-50 p-4">
      <svg viewBox="0 0 220 220" className="w-full max-w-xs" aria-hidden>
        <circle cx="110" cy="110" r="100" fill="none" stroke="#E2E8F0" strokeWidth="10" />
        <circle
          cx="110"
          cy="110"
          r="100"
          fill="none"
          stroke="#E24B4A"
          strokeWidth="10"
          strokeOpacity="0.7"
          strokeDasharray="201 430"
          strokeDashoffset="108"
          strokeLinecap="round"
          transform="rotate(-90 110 110)"
        />
        <text x="110" y="16" fontSize="10" fill="#94A3B8" textAnchor="middle">
          Light exposure
        </text>
        <circle cx="110" cy="110" r="82" fill="none" stroke="#E2E8F0" strokeWidth="10" />
        <circle
          cx="110"
          cy="110"
          r="82"
          fill="none"
          stroke="#EF9F27"
          strokeWidth="10"
          strokeOpacity="0.8"
          strokeDasharray="432 515"
          strokeDashoffset="108"
          strokeLinecap="round"
          transform="rotate(-90 110 110)"
        />
        <circle cx="110" cy="110" r="64" fill="none" stroke="#E2E8F0" strokeWidth="10" />
        <circle
          cx="110"
          cy="110"
          r="64"
          fill="none"
          stroke="#3B8BD4"
          strokeWidth="10"
          strokeOpacity="0.6"
          strokeDasharray="201 402"
          strokeDashoffset="108"
          strokeLinecap="round"
          transform="rotate(-90 110 110)"
        />
        <circle cx="110" cy="54" r="10" fill="#94A3B8" opacity="0.2" />
        <rect x="96" y="62" width="28" height="42" rx="8" fill="#94A3B8" opacity="0.18" />
        <rect x="88" y="104" width="14" height="28" rx="4" fill="#94A3B8" opacity="0.14" />
        <rect x="118" y="104" width="14" height="28" rx="4" fill="#94A3B8" opacity="0.14" />
        <rect x="97" y="132" width="10" height="26" rx="4" fill="#94A3B8" opacity="0.14" />
        <rect x="113" y="132" width="10" height="26" rx="4" fill="#94A3B8" opacity="0.14" />
        <text x="22" y="108" fontSize="9" fill="#EF9F27" textAnchor="middle">
          SNS
        </text>
        <text x="22" y="120" fontSize="10" fill="#EF9F27" textAnchor="middle" fontWeight="500">
          {data.autonomic.sns}%
        </text>
        <text x="198" y="108" fontSize="9" fill="#3B8BD4" textAnchor="middle">
          PNS
        </text>
        <text x="198" y="120" fontSize="10" fill="#3B8BD4" textAnchor="middle" fontWeight="500">
          {data.autonomic.pns}%
        </text>
      </svg>
    </div>
  )
}

function ClinicalInsightBox() {
  return (
    <div className="rounded-xl border border-blue-100 bg-blue-50 p-3 text-xs leading-relaxed text-slate-700">
      Late DLMO + evening light overload + SNS dominance = non-dipping pattern. Bedtime antihypertensive
      dosing indicated per Hygia protocol. Current morning ramipril timing suboptimal for this
      phenotype.
    </div>
  )
}

function MedicationRecommendationsPanel({ data }: { data: DemoData }) {
  return (
    <article className={TILE_CLASS}>
      <p className="mb-2 text-xs uppercase tracking-wide text-slate-400">
        Chronotherapy recommendations — for GP review
      </p>
      <div className="mb-2 flex items-center gap-1.5 border-b border-slate-100 pb-2 text-xs text-slate-400">
        <span className="font-medium text-slate-500">Derived from:</span>
        Proxy DLMO {data.dlmo.time} · mLux {data.mlux.score}/100 · SNS load {data.autonomic.sns}% ·
        TipTraQ Layer 3
      </div>
      {data.medications.map((med) => (
        <div
          key={med.name}
          className="flex items-center gap-3 border-b border-slate-100 py-2 last:border-0"
        >
          <div className="min-w-0 flex-1">
            <p className="text-xs font-medium text-slate-800">{med.name}</p>
            <p className="text-xs text-slate-400">
              Current: {med.current} · Evidence: {med.evidence}
            </p>
          </div>
          <MedActionBadge type={med.actionType} label={med.action} />
        </div>
      ))}
    </article>
  )
}

function SleepSummaryTile({ data }: { data: DemoData }) {
  const rows = [
    { label: 'Total sleep', value: data.sleep.total },
    { label: 'Time in bed', value: data.sleep.timeInBed },
    { label: 'Efficiency', value: `${data.sleep.efficiency}%`, warn: true },
    { label: 'Sleep start', value: data.sleep.start },
    { label: 'Sleep end', value: data.sleep.end },
  ]
  return (
    <article className={TILE_CLASS}>
      <p className={TILE_LABEL}>Tile 4 — Sleep summary</p>
      <dl className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1.5">
        {rows.map((row) => (
          <div key={row.label} className="contents">
            <dt className="text-xs text-slate-400">{row.label}</dt>
            <dd
              className={`text-xs font-medium ${row.warn ? 'text-red-500' : 'text-slate-800'}`}
            >
              {row.value}
            </dd>
          </div>
        ))}
      </dl>
      <SourceRow>TipTraQ PPG · accelerometry · sleep staging algorithm</SourceRow>
    </article>
  )
}

function BreathingTile({ data }: { data: DemoData }) {
  const rows = [
    { label: 'AHI', value: data.breathing.ahi, badge: data.breathing.ahiStatus },
    { label: 'SpO₂', value: data.breathing.spo2 },
    { label: 'Snoring', value: `${data.breathing.snoring} min` },
  ]
  return (
    <article className={TILE_CLASS}>
      <p className={TILE_LABEL}>Tile 5 — Breathing</p>
      <dl className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1.5">
        {rows.map((row) => (
          <div key={row.label} className="contents">
            <dt className="text-xs text-slate-400">{row.label}</dt>
            <dd className="text-xs font-medium text-slate-800">
              {row.value}
              {'badge' in row && row.badge ? (
                <span className="ml-1.5 inline-block rounded border border-green-100 bg-green-50 px-1.5 py-0.5 text-xs text-green-700">
                  {row.badge}
                </span>
              ) : null}
            </dd>
          </div>
        ))}
      </dl>
      <SourceRow>TipTraQ PPG · respiratory rate variability</SourceRow>
    </article>
  )
}

function AutonomicBalanceTile({ data }: { data: DemoData }) {
  return (
    <article className={TILE_CLASS}>
      <p className={TILE_LABEL}>Tile 6 — Autonomic balance</p>
      <div className="mt-2 flex gap-2">
        <div className="flex-1 rounded-xl border border-amber-100 bg-amber-50 p-3 text-center">
          <div className="text-xl font-medium text-amber-700">{data.autonomic.sns}%</div>
          <div className="mt-0.5 text-xs text-amber-600">SNS</div>
        </div>
        <div className="flex-1 rounded-xl border border-blue-100 bg-blue-50 p-3 text-center">
          <div className="text-xl font-medium text-blue-700">{data.autonomic.pns}%</div>
          <div className="mt-0.5 text-xs text-blue-600">PNS</div>
        </div>
      </div>
      <p className={SUB_TEXT}>
        High nocturnal sympathetic load — consistent with non-dipping BP pattern. Supports bedtime
        antihypertensive protocol.
      </p>
      <SourceRow>TipTraQ HRV · LF/HF ratio · nocturnal sympathovagal balance</SourceRow>
    </article>
  )
}

function EvidenceGroundingTile() {
  const rows = [
    {
      title: 'Hygia trial',
      detail: 'n=19,084 · 45% ↓ CV events bedtime dosing',
    },
    {
      title: 'TIME Chronotype',
      detail: 'n=21,104 · chronotype-matched dosing',
    },
    {
      title: 'Lévi et al.',
      detail: '· 500 meds ± 5× timing sensitivity',
    },
    {
      title: 'Munro 2026',
      detail: '· DIʘS Evidence Report 001',
    },
  ]
  return (
    <article className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
      <p className={TILE_LABEL}>Evidence grounding</p>
      <ul className="mt-2 space-y-2">
        {rows.map((row) => (
          <li key={row.title} className="text-xs leading-relaxed">
            <span className="font-medium text-slate-700">{row.title}</span>
            <span className="text-slate-400"> {row.detail}</span>
          </li>
        ))}
      </ul>
      <div className="my-2 border-t border-slate-100" />
      <p className="text-xs leading-relaxed">
        <span className="font-medium text-slate-600">TipTraQ proxy pipeline</span>
        <span className="text-slate-400">
          {' '}
          · PPG → HRV → DLMO/mLux inference · PranaQ · validation pending
        </span>
      </p>
    </article>
  )
}

function PageFooter() {
  return (
    <footer className="mt-6 pb-4 text-center text-xs text-slate-400">
      This dashboard is for clinical decision support only and does not constitute medical advice.{' '}
      DIʘS · The Circadian Foundation · dios.health
    </footer>
  )
}

export default function CircadianDigitalTwinPage() {
  return (
    <main
      className="mx-auto max-w-6xl px-6 pb-8 pt-20 sm:pt-24"
      style={{ backgroundColor: '#F7FAFC' }}
    >
      <CircadianYearsIntro />

      <p className="mb-4 font-mono text-[10px] uppercase tracking-wider text-slate-400">
        Clinical digital twin · signal breakdown
      </p>
      <DashboardHeader data={DEMO_DATA} />
      <DataLayerLegend />

      <div className="grid grid-cols-1 gap-3 lg:grid-cols-[220px_1fr_200px]">
        <div className="flex flex-col gap-3">
          <DLMOTile data={DEMO_DATA} />
          <MLuxTile data={DEMO_DATA} />
          <ChronotypeTile data={DEMO_DATA} />
        </div>

        <div className="flex flex-col gap-3">
          <CircadianRingSVG data={DEMO_DATA} />
          <ClinicalInsightBox />
          <MedicationRecommendationsPanel data={DEMO_DATA} />
        </div>

        <div className="flex flex-col gap-3">
          <SleepSummaryTile data={DEMO_DATA} />
          <BreathingTile data={DEMO_DATA} />
          <AutonomicBalanceTile data={DEMO_DATA} />
          <EvidenceGroundingTile />
        </div>
      </div>

      <PageFooter />
    </main>
  )
}
