import { Card, CardHeader } from '@/components/ui/card'

import { BODY, CARD, CONTAINER, SECTION, SECTION_ALT, SECTION_TITLE } from './layout'
import { SectionLabel } from './SectionLabel'

const TIERS = [
  {
    id: 'patients',
    headline: 'Always free for patients — no upgrade wall',
  },
  {
    id: 'gps',
    headline: 'Free to start for GPs — pay when convinced',
  },
  {
    id: 'researchers',
    headline: 'Research data only from consenting patients',
  },
] as const

export function Pricing() {
  return (
    <section id="pricing" className={`${SECTION} ${SECTION_ALT}`}>
      <div className={CONTAINER}>
        <SectionLabel title="Pricing" />
        <h2 className={`${SECTION_TITLE} mt-4 max-w-lg`}>
          Free for every patient, and free to start for every GP
        </h2>

        <div className="mt-10 grid grid-cols-1 items-stretch gap-4 lg:grid-cols-3">
          {TIERS.map((tier) => (
            <Card key={tier.id} className={`${CARD} flex h-full flex-col gap-0 py-0`}>
              <CardHeader className="flex min-h-[4.125rem] items-center px-6 py-6">
                <p className="type-tile-title text-pretty">{tier.headline}</p>
              </CardHeader>
            </Card>
          ))}
        </div>

        <p className={`${BODY} mt-10 max-w-lg`}>
          Researchers and insurers get no access unless patients choose to share
        </p>
      </div>
    </section>
  )
}
