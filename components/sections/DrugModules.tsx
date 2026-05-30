import Image from 'next/image'

import { Card, CardContent, CardHeader } from '@/components/ui/card'

import { MatchedLines } from './MatchedLines'
import { BODY, CARD, CONTAINER, SECTION, SECTION_ALT, SECTION_TITLE } from './layout'
import { SectionLabel } from './SectionLabel'

const SECTION_IMAGE = {
  src: 'https://images.unsplash.com/photo-1550572017-edd951b55104?w=800&q=80',
  alt: 'Medication in hand — dose timing and chronotherapy evidence',
  width: 1200,
  height: 675,
} as const

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

        <div className="mt-4 grid grid-cols-1 items-center gap-6 lg:grid-cols-2 lg:gap-12">
          <div>
            <h2 className={`${SECTION_TITLE} max-w-md`}>
              Four drugs.
              <br />
              Proven timing.
              <br />
              Shown here first.
            </h2>
            <p className={`${BODY} mt-4 hidden max-w-sm lg:block`}>
              The strongest clinical evidence for dose timing — today.
            </p>
          </div>

          <Image
            src={SECTION_IMAGE.src}
            alt={SECTION_IMAGE.alt}
            width={SECTION_IMAGE.width}
            height={SECTION_IMAGE.height}
            loading="lazy"
            className="aspect-video w-full rounded-lg object-cover lg:rounded-xl"
          />

          <p className={`${BODY} max-w-sm lg:hidden`}>
            The strongest clinical evidence for dose timing — today.
          </p>
        </div>

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
