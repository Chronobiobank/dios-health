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
  },
] as const

export function FourClusters() {
  return (
    <section id="how-it-works" className={`${SECTION} ${CONTAINER}`}>
      <SectionLabel title="Four clusters" />

      <div className="mt-10 grid grid-cols-1 gap-4 lg:grid-cols-2">
        {CLUSTERS.map((cluster) => (
          <Card key={cluster.headline.join('-')} className={`${CARD} gap-0 py-0`}>
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
