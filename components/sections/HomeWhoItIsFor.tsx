import { Card, CardContent, CardHeader } from '@/components/ui/card'

import { HashLink } from '@/components/sections/HashLink'

import { BODY, CONTAINER, SECTION, SECTION_ALT, SECTION_TITLE, TILE_BODY, TILE_CARD, TILE_GRID, TILE_HEADER } from './layout'
import { SectionLabel } from './SectionLabel'

const AUDIENCES = [
  {
    id: 'care-homes',
    title: 'Care homes',
    body: 'Polypharmacy residents. One report. All medications.',
  },
  {
    id: 'gp',
    title: 'GP practices',
    body: 'Add timing to chronic disease review.',
  },
  {
    id: 'icb',
    title: 'NHS ICBs',
    body: 'Commission once. Reduce admissions across your population.',
  },
] as const

export function HomeWhoItIsFor() {
  return (
    <section className={`${SECTION} ${SECTION_ALT}`}>
      <div className={CONTAINER}>
        <SectionLabel title="Who it is for" />
        <h2 className={`${SECTION_TITLE} mt-4 max-w-2xl`}>Every setting. One tool.</h2>
        <div className={`${TILE_GRID} lg:grid-cols-3`}>
          {AUDIENCES.map((item) => (
            <Card key={item.id} className={TILE_CARD}>
              <CardHeader className={TILE_HEADER}>
                <p className="type-tile-title">{item.title}</p>
              </CardHeader>
              <CardContent className={TILE_BODY}>
                <p className={BODY}>{item.body}</p>
                <HashLink
                  href="#demo"
                  className="type-body inline-flex font-medium text-black underline-offset-4 hover:underline"
                >
                  Book a demo →
                </HashLink>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
