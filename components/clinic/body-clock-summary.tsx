import { CARD } from '@/components/sections/layout'
import type { DemoPatientTwin } from '@/lib/clinic/demo-patient-twin'

type BodyClockSummaryProps = {
  summary: DemoPatientTwin['bodyClockSummary']
}

export function BodyClockSummary({ summary }: BodyClockSummaryProps) {
  return (
    <section className="mt-10">
      <h2 className="type-caption font-mono uppercase tracking-widest text-black/45">Body clock summary</h2>

      <dl className={`${CARD} mt-4 grid gap-4 rounded-2xl p-5 sm:grid-cols-2 sm:p-6`}>
        <SummaryItem label="Chronotype" value={summary.chronotype} />
        <SummaryItem label="MSFsc estimate" value={summary.msfsc} />
        <SummaryItem label="Non-dipper status" value={summary.nonDipper} />
        <SummaryItem label="Confidence band" value={summary.confidenceBand} />
      </dl>
    </section>
  )
}

function SummaryItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="type-caption font-mono uppercase tracking-wider text-black/45">{label}</dt>
      <dd className="type-body mt-1 text-sm font-medium capitalize text-black">{value}</dd>
    </div>
  )
}
