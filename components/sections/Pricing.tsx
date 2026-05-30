import { Card, CardContent, CardHeader } from '@/components/ui/card'

import { MatchedLines } from './MatchedLines'
import { BODY, CARD, CONTAINER, SECTION, SECTION_ALT, SECTION_TITLE } from './layout'
import { SectionLabel } from './SectionLabel'

const TIERS = [
  {
    headline: ['Patients ·', 'Always free.'],
    body: ['No upgrade wall. No exceptions.'],
  },
  {
    headline: ['GPs ·', 'Free to start.'],
    body: ['Pay when you\'ve seen it work.'],
  },
  {
    headline: ['Researchers ·', 'Consented access.'],
    body: ['Only from patients who opt in.'],
  },
] as const

export function Pricing() {
  return (
    <section id="pricing" className={`${SECTION} ${SECTION_ALT}`}>
      <div className={CONTAINER}>
        <SectionLabel title="Pricing" />
        <h2 className={`${SECTION_TITLE} mt-4 max-w-md`}>
          Free for patients.
          <br />
          Free to start for GPs.
        </h2>

        <div className="mt-10 grid grid-cols-1 items-stretch gap-4 lg:grid-cols-3">
          {TIERS.map((tier) => (
            <Card key={tier.headline.join('-')} className={`${CARD} flex h-full flex-col gap-0 py-0`}>
              <CardHeader className="px-6 pt-6">
                <MatchedLines lines={tier.headline} variant="headline" slots={2} />
              </CardHeader>
              <CardContent className="flex flex-1 px-6 pb-6">
                <MatchedLines lines={tier.body} variant="body" slots={1} />
              </CardContent>
            </Card>
          ))}
        </div>

        <p className={`${BODY} mt-10 max-w-lg`}>No opt-in. No access. Simple.</p>
      </div>
    </section>
  )
}
