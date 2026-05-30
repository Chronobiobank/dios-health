import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

import { BODY, CONTAINER, SECTION, SECTION_TITLE } from './layout'
import { SectionLabel } from './SectionLabel'

const PROBLEM_STATS = [
  {
    value: '4 drug types',
    label: 'where timing changes the outcome',
  },
  {
    value: '33% fewer heart attacks',
    label: 'when blood pressure pills move to bedtime',
  },
  {
    value: '0 tools available',
    label: 'to help GPs make this call — until now',
  },
] as const

export function Crisis() {
  return (
    <section id="problem" className={`${SECTION} ${CONTAINER} py-14 sm:py-20`}>
      <SectionLabel title="The problem" />
      <h2 className={`${SECTION_TITLE} mt-4 max-w-xl`}>
        Morning or night?
        <br />
        Nobody actually knows.
      </h2>
      <p className={`${BODY} mt-4 max-w-xl`}>
        Standard prescribing guidance gives you two options. Your patient&apos;s body clock gives
        you a precise answer. DIOS finds it.
      </p>

      <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {PROBLEM_STATS.map((stat) => (
          <Card
            key={stat.value}
            className="gap-0 border border-black/10 bg-[#FAFAFA] py-0 text-center shadow-none ring-0"
          >
            <CardHeader className="items-center gap-2 px-5 pt-6 sm:px-6">
              <CardTitle className="font-sans text-lg font-semibold leading-snug text-black text-pretty sm:text-xl">
                {stat.value}
              </CardTitle>
            </CardHeader>
            <CardContent className="px-5 pb-6 sm:px-6">
              <p className="type-body text-pretty text-black/70">{stat.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}
