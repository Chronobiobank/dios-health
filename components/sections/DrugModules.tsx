import Image from 'next/image'

import { Card, CardContent, CardHeader } from '@/components/ui/card'

import { BODY, CONTAINER, SECTION, SECTION_ALT, SECTION_TITLE, TILE_BODY, TILE_CARD, TILE_GRID, TILE_HEADER } from './layout'
import { SectionLabel } from './SectionLabel'

const SECTION_IMAGE = {
  src: 'https://images.unsplash.com/photo-1550572017-edd951b55104?w=800&q=80',
  alt: 'Medication in hand — dose timing and chronotherapy evidence',
  width: 1200,
  height: 675,
} as const

const PROOFS = [
  {
    id: 'bp',
    headline: 'Bedtime beats morning when blood pressure won\'t dip overnight',
    body: 'For non-dippers, moving ramipril or lisinopril to bedtime matches the window the trials proved',
    caption: 'Ramipril, lisinopril, and amlodipine',
  },
  {
    id: 'statin',
    headline: 'Evening statins match the window when the liver works hardest',
    body: 'A morning statin misses midnight liver activity — an evening dose lands when cholesterol synthesis peaks',
    caption: 'Simvastatin',
  },
  {
    id: 'pain',
    headline: 'Pain relief should arrive before your patient wakes, not after',
    body: 'DIOS finds each patient\'s inflammatory peak so prednisolone or naproxen lands before they wake',
    caption: 'Prednisolone, naproxen, and ibuprofen',
  },
  {
    id: 'asthma',
    headline: 'Evening dosing covers the airway narrowing that hits before dawn',
    body: 'An evening salmeterol or fluticasone dose covers the pre-dawn bronchospasm window DIOS tracks',
    caption: 'Salmeterol and fluticasone',
  },
] as const

export function DrugModules() {
  return (
    <section id="evidence" className={`${SECTION} ${SECTION_ALT}`}>
      <div className={CONTAINER}>
        <SectionLabel title="The evidence" />

        <div className="mt-4 grid grid-cols-1 items-center gap-6 lg:grid-cols-2 lg:gap-12">
          <div>
            <h2 className={`${SECTION_TITLE} max-w-2xl`}>
              Four drugs. The strongest timing evidence in primary care.
            </h2>
            <p className={`${BODY} mt-4 hidden max-w-lg lg:block`}>
              These four carry the strongest published evidence for dose timing in primary care today
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

          <p className={`${BODY} max-w-lg lg:hidden`}>
            These four carry the strongest published evidence for dose timing in primary care today
          </p>
        </div>

        <div className={TILE_GRID}>
          {PROOFS.map((item) => (
            <Card key={item.id} className={TILE_CARD}>
              <CardHeader className={TILE_HEADER}>
                <p className="type-tile-title">{item.headline}</p>
              </CardHeader>
              <CardContent className={TILE_BODY}>
                <p className={BODY}>{item.body}</p>
                <p className="type-caption">{item.caption}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <p className={`${BODY} mt-10 text-center`}>
          Hundreds of other treatments have a timing window — these four are where DIOS starts
        </p>
      </div>
    </section>
  )
}
