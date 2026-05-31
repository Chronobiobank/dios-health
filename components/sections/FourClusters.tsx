import Image from 'next/image'

import { Card, CardContent, CardHeader } from '@/components/ui/card'

import { BODY, CONTAINER, SECTION, SECTION_TITLE, TILE_BODY, TILE_CARD, TILE_GRID, TILE_HEADER, TILE_IMAGE } from './layout'
import { SectionLabel } from './SectionLabel'

const CLUSTERS = [
  {
    id: 'light',
    headline: 'Set patient clocks with light',
    body: 'DIOS maps light diet and which morning or evening exposures need fixing.',
    caption: 'Light therapy for seasonal depression',
    image: {
      src: 'https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?w=600&q=80',
      alt: 'Morning sunlight through a window — light as the primary body clock signal',
    },
  },
  {
    id: 'food',
    headline: 'Time food for metabolic rhythm',
    body: 'Meal timing shifts insulin, cortisol, and cholesterol—not diet choices alone.',
    caption: 'Meal timing for metabolic health',
    image: {
      src: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&q=80',
      alt: 'Clean whole food meal in natural light — food timing and circadian rhythm',
    },
  },
  {
    id: 'medicine',
    headline: 'Land medicines when they work',
    body: 'DIOS finds each medicine window from body clock, not guidelines.',
    caption: 'Ramipril, simvastatin, and prednisolone timing',
    image: {
      src: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600&q=80',
      alt: 'Single capsule on neutral background — medication timing and dose intelligence',
    },
  },
  {
    id: 'movement',
    headline: 'Time movement for sleep recovery',
    body: 'DIOS maps when movement best improves sleep, blood sugar, and recovery.',
    caption: 'Cardiac rehab and metabolic programmes',
    image: {
      src: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&q=80',
      alt: 'Person running at dawn — exercise timing and circadian entrainment',
    },
  },
] as const

export function FourClusters() {
  return (
    <section id="how-it-works" className={`${SECTION} ${CONTAINER}`}>
      <SectionLabel title="Four clusters" />
      <h2 className={`${SECTION_TITLE} mt-4 max-w-3xl`}>
        DIOS reads your body clock to find the right time for light, food, medicine, and movement.
      </h2>

      <div className={TILE_GRID}>
        {CLUSTERS.map((cluster) => (
          <Card key={cluster.id} className={TILE_CARD}>
            <Image
              src={cluster.image.src}
              alt={cluster.image.alt}
              width={1200}
              height={800}
              loading="lazy"
              className={TILE_IMAGE}
            />
            <CardHeader className={TILE_HEADER}>
              <p className="type-tile-title">{cluster.headline}</p>
            </CardHeader>
            <CardContent className={TILE_BODY}>
              <p className={BODY}>{cluster.body}</p>
              <p className="type-caption">{cluster.caption}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}
