import { Card, CardContent, CardHeader } from '@/components/ui/card'

import { MatchedLines } from './MatchedLines'
import { BODY, CARD, CONTAINER, SECTION, SECTION_ALT, SECTION_TITLE } from './layout'
import { SectionLabel } from './SectionLabel'

const PROOFS = [
  {
    headline: ['Night is right', 'for blood pressure.'],
    body: [
      'For patients whose pressure doesn\'t drop',
      'during sleep, bedtime beats morning.',
    ],
    drugs: ['Ramipril · Lisinopril ·', 'Amlodipine'],
  },
  {
    headline: ['The liver works', 'at midnight.'],
    body: ['A morning statin misses the window.', 'An evening one doesn\'t.'],
    drugs: ['Simvastatin', ''],
  },
  {
    headline: ['Pain peaks before', 'you wake.'],
    body: [
      'Standard morning dosing arrives too late.',
      'DIOS finds your patient\'s actual peak.',
    ],
    drugs: ['Prednisolone · Naproxen ·', 'Ibuprofen'],
  },
  {
    headline: ['Airways narrow in', 'the early hours.'],
    body: [
      'An evening dose covers the window.',
      'DIOS finds when that window opens.',
    ],
    drugs: ['Salmeterol ·', 'Fluticasone'],
  },
] as const

export function DrugModules() {
  return (
    <section id="evidence" className={`${SECTION} ${SECTION_ALT}`}>
      <div className={CONTAINER}>
        <SectionLabel title="The evidence" />
        <h2 className={`${SECTION_TITLE} mt-4 max-w-md`}>
          Four drugs.
          <br />
          Proven timing.
          <br />
          Shown here first.
        </h2>
        <p className={`${BODY} mt-4 max-w-sm`}>
          The strongest clinical evidence for dose timing — today.
        </p>

        <div className="mt-10 grid grid-cols-1 gap-4 lg:grid-cols-2">
          {PROOFS.map((item) => (
            <Card key={item.headline.join('-')} className={`${CARD} gap-0 py-0`}>
              <CardHeader className="gap-3 px-6 pt-6">
                <MatchedLines lines={item.headline} variant="headline" slots={2} />
              </CardHeader>
              <CardContent className="space-y-4 px-6 pb-6">
                <MatchedLines lines={item.body} variant="body" slots={2} />
                <MatchedLines lines={item.drugs} variant="footer" slots={2} />
              </CardContent>
            </Card>
          ))}
        </div>

        <p className={`${BODY} mt-10 text-center`}>
          Hundreds of treatments have a timing window.
          <br />
          These four are where we start.
        </p>
      </div>
    </section>
  )
}
