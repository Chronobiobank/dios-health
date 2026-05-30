import { Card, CardHeader, CardTitle } from '@/components/ui/card'

import { BODY, CONTAINER, SECTION, SECTION_TITLE } from './layout'
import { SectionLabel } from './SectionLabel'

const PROBLEM_STATS = [
  {
    headline: 'Four drug types where changing the dose time changes the outcome',
  },
  {
    headline: 'Thirty-three percent fewer heart attacks when blood pressure pills move to bedtime',
  },
  {
    headline: 'Zero GP tools existed to make that timing call until DIOS',
  },
] as const

export function Crisis() {
  return (
    <section id="problem" className={`${SECTION} ${CONTAINER} py-14 sm:py-20`}>
      <SectionLabel title="The problem" />
      <h2 className={`${SECTION_TITLE} mt-4 max-w-xl`}>
        Morning or night — nobody knows the right time until DIOS reads the clock
      </h2>
      <p className={`${BODY} mt-4 max-w-xl`}>
        Standard guidelines offer two options while your patient&apos;s body clock defines one precise answer
      </p>

      <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {PROBLEM_STATS.map((stat) => (
          <Card
            key={stat.headline}
            className="gap-0 border border-black/10 bg-[#FAFAFA] py-0 text-center shadow-none ring-0"
          >
            <CardHeader className="items-center px-5 py-6 sm:px-6">
              <CardTitle className="font-sans text-base font-semibold leading-snug text-black text-pretty sm:text-lg">
                {stat.headline}
              </CardTitle>
            </CardHeader>
          </Card>
        ))}
      </div>
    </section>
  )
}
