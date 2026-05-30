import Image from 'next/image'

import { Card, CardContent, CardHeader } from '@/components/ui/card'

import { BODY, CARD, CONTAINER, SECTION, SECTION_TITLE } from './layout'
import { SectionLabel } from './SectionLabel'

const CLUSTERS = [
  {
    id: 'light',
    headline: 'Time light right to set your patient\'s clock',
    body: 'DIOS maps your patient\'s light diet and which morning evening exposures to correct',
    caption: 'Light therapy for seasonal affective disorder',
    image: {
      src: 'https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?w=600&q=80',
      alt: 'Morning sunlight through a window — light as the primary body clock signal',
    },
  },
  {
    id: 'food',
    headline: 'Time food right to align metabolic rhythm',
    body: 'Meal timing changes insulin, cortisol, and cholesterol for patients — not food alone',
    caption: 'Meal timing for metabolic health',
    image: {
      src: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&q=80',
      alt: 'Clean whole food meal in natural light — food timing and circadian rhythm',
    },
  },
  {
    id: 'medicine',
    headline: 'Land every medicine when it actually works',
    body: 'DIOS finds each medicine window from your patient body clock — not guidelines',
    caption: 'Ramipril, simvastatin, and prednisolone timing',
    image: {
      src: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600&q=80',
      alt: 'Single capsule on neutral background — medication timing and dose intelligence',
    },
  },
  {
    id: 'movement',
    headline: 'Time movement right for sleep and recovery',
    body: 'Exercise timing shapes sleep, blood sugar, and recovery when DIOS maps optimal windows',
    caption: 'Cardiac rehab and metabolic syndrome programmes',
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

      <div className="mt-10 grid grid-cols-1 gap-4 lg:grid-cols-2">
        {CLUSTERS.map((cluster) => (
          <Card key={cluster.id} className={`${CARD} gap-0 overflow-hidden py-0`}>
            <Image
              src={cluster.image.src}
              alt={cluster.image.alt}
              width={1200}
              height={800}
              loading="lazy"
              className="aspect-[3/2] w-full rounded-t-lg object-cover"
            />
            <CardHeader className="gap-3 px-6 pt-6">
              <p className="type-tile-title">{cluster.headline}</p>
            </CardHeader>
            <CardContent className="space-y-3 px-6 pb-6">
              <p className={BODY}>{cluster.body}</p>
              <p className="type-caption">{cluster.caption}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}
