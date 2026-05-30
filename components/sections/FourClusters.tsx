import Image from 'next/image'

import { Card, CardContent, CardHeader } from '@/components/ui/card'

import { MatchedLines } from './MatchedLines'
import { CARD, CONTAINER, SECTION } from './layout'
import { SectionLabel } from './SectionLabel'

const CLUSTERS = [
  {
    headline: ['Light.', 'Time it', 'right.'],
    body: [
      'Morning light sets your clock forward.',
      'Evening light pushes it back.',
      'DIOS maps your patient\'s light diet',
      'and tells you what to correct.',
    ],
    example: ['Light therapy ·', 'Seasonal affective disorder'],
    image: {
      src: 'https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?w=600&q=80',
      alt: 'Morning sunlight through a window — light as the primary body clock signal',
    },
  },
  {
    headline: ['Food.', 'Eat at the', 'right time.'],
    body: [
      'When your patient eats changes how',
      'their body handles insulin, cortisol,',
      'and cholesterol — not just what',
      'they eat.',
    ],
    example: ['Meal timing ·', 'Metabolic health'],
    image: {
      src: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&q=80',
      alt: 'Clean whole food meal in natural light — food timing and circadian rhythm',
    },
  },
  {
    headline: ['Medicine.', 'Land it when', 'it works.'],
    body: [
      'Every medicine has a window.',
      'DIOS finds it from your patient\'s',
      'actual body clock — not a',
      'guideline.',
    ],
    example: ['Ramipril · Simvastatin ·', 'Prednisolone'],
    image: {
      src: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600&q=80',
      alt: 'Single capsule on neutral background — medication timing and dose intelligence',
    },
  },
  {
    headline: ['Movement.', 'Move at the', 'right time.'],
    body: [
      'Exercise timing affects sleep,',
      'blood sugar, and cardiovascular',
      'recovery. DIOS maps the optimal',
      'window.',
    ],
    example: ['Cardiac rehab ·', 'Metabolic syndrome'],
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

      <div className="mt-10 grid grid-cols-1 gap-4 lg:grid-cols-2">
        {CLUSTERS.map((cluster) => (
          <Card key={cluster.headline.join('-')} className={`${CARD} gap-0 overflow-hidden py-0`}>
            <Image
              src={cluster.image.src}
              alt={cluster.image.alt}
              width={1200}
              height={800}
              loading="lazy"
              className="aspect-[3/2] w-full rounded-t-lg object-cover"
            />
            <CardHeader className="gap-3 px-6 pt-6">
              <MatchedLines lines={cluster.headline} variant="headline" slots={3} />
            </CardHeader>
            <CardContent className="space-y-4 px-6 pb-6">
              <MatchedLines lines={cluster.body} variant="body" slots={4} />
              <MatchedLines lines={cluster.example} variant="footer" slots={2} />
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}
