import { Badge } from '@/components/ui/badge'

import { HashLink } from '@/components/sections/HashLink'

import { BODY, CONTAINER, SECTION, SECTION_ALT, SECTION_TITLE } from './layout'
import { SectionLabel } from './SectionLabel'

const MEDICATIONS = [
  'Atorvastatin',
  'Ramipril',
  'Amlodipine',
  'Sertraline',
  'Metformin',
  'Prednisolone',
  'Salmeterol',
  'Levothyroxine',
] as const

export function HomeMedicationCoverage() {
  return (
    <section className={`${SECTION} ${SECTION_ALT}`}>
      <div className={CONTAINER}>
        <SectionLabel title="Medication coverage" />
        <h2 className={`${SECTION_TITLE} mt-4 max-w-2xl`}>Eight medications. Expanding quarterly.</h2>
        <div className="mt-8 flex flex-wrap gap-2">
          {MEDICATIONS.map((name) => (
            <Badge
              key={name}
              variant="outline"
              className="h-auto rounded-full border-black/10 px-4 py-2 text-sm font-medium text-black"
            >
              {name}
            </Badge>
          ))}
        </div>
        <p className={`${BODY} mt-8`}>
          Your patient&apos;s medication not listed?{' '}
          <HashLink href="#demo" className="font-medium text-black underline-offset-4 hover:underline">
            Tell us. →
          </HashLink>
        </p>
      </div>
    </section>
  )
}
