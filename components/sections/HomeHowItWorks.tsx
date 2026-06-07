import { INTELLIGENCE_CADENCES } from '@/lib/product/intelligence-cadence'

import { CONTAINER, LIST_LINE, SECTION, SECTION_TITLE } from './layout'
import { SectionLabel } from './SectionLabel'

const STEPS = [
  `Patient completes TipTraQ — ${INTELLIGENCE_CADENCES.tiptraq.interval.toLowerCase()}, ${INTELLIGENCE_CADENCES.tiptraq.inputs[0]}.`,
  'DIOS sets personalised dose windows from the calibration read.',
  'Monthly MLux proxy maintains the estimate; 90-day bloods confirm biological response.',
  'Daily DINA dose confirmations prove adherence to the windows TipTraQ defined.',
] as const

export function HomeHowItWorks() {
  return (
    <section id="how-it-works" className={`${SECTION} ${CONTAINER}`}>
      <SectionLabel title="How it works" />
      <h2 className={`${SECTION_TITLE} mt-4 max-w-2xl`}>Three nights. Six months of precision.</h2>
      <ol className="mt-8 max-w-2xl space-y-4">
        {STEPS.map((step, index) => (
          <li key={step} className="flex gap-4">
            <span className="font-mono text-sm font-semibold tabular-nums text-black/40">
              {index + 1}.
            </span>
            <span className={LIST_LINE}>{step}</span>
          </li>
        ))}
      </ol>
    </section>
  )
}
