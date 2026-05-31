import { Card, CardContent, CardHeader } from '@/components/ui/card'

import { CONTAINER, SECTION, SECTION_TITLE, TILE_BODY, TILE_CARD, TILE_GRID, TILE_HEADER } from './layout'
import { SectionLabel } from './SectionLabel'

const GAP_CARDS = [
  {
    name: 'Atorvastatin',
    standard: 'take at night',
    dios: '3h after your body clock shifts',
  },
  {
    name: 'Ramipril',
    standard: 'take in the morning',
    dios: '1h after your body clock shifts',
  },
  {
    name: 'Sertraline',
    standard: 'take in the morning',
    dios: 'timed to your cortisol peak',
  },
] as const

export function HomeGap() {
  return (
    <section className={`${SECTION} ${CONTAINER}`}>
      <SectionLabel title="The gap" />
      <h2 className={`${SECTION_TITLE} mt-4 max-w-2xl`}>Timing changes outcomes.</h2>
      <div className={`${TILE_GRID} lg:grid-cols-3`}>
        {GAP_CARDS.map((card) => (
          <Card key={card.name} className={TILE_CARD}>
            <CardHeader className={TILE_HEADER}>
              <p className="type-tile-title">{card.name}</p>
            </CardHeader>
            <CardContent className={TILE_BODY}>
              <p className="type-caption text-black/55">Standard: {card.standard}</p>
              <p className="type-body font-medium text-black">DIOS: {card.dios}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}
