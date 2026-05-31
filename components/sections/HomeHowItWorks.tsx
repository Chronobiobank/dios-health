import { CONTAINER, LIST_LINE, SECTION, SECTION_TITLE } from './layout'
import { SectionLabel } from './SectionLabel'

const STEPS = [
  'Patient wears TipTraQ for three nights.',
  'DIOS calculates their personal body clock.',
  'Clinician receives a one-page dose timing report.',
  'Patient gets daily reminders. Timed to their biology.',
] as const

export function HomeHowItWorks() {
  return (
    <section id="how-it-works" className={`${SECTION} ${CONTAINER}`}>
      <SectionLabel title="How it works" />
      <h2 className={`${SECTION_TITLE} mt-4 max-w-2xl`}>Three nights. One reading. Better outcomes.</h2>
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
