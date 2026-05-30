import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

import { CONTAINER, SECTION } from './layout'

const STEPS = [
  {
    num: '01',
    title: 'Detect',
    body: 'Passive multi-stream capture across wearable, lab, retinal, and smartphone — zero additional patient burden.',
  },
  {
    num: '02',
    title: 'Diagnose',
    body: 'Chronotype-informed dose timing modules surface when to take medicines already prescribed — informing the clinician\'s prescribing decision.',
  },
  {
    num: '03',
    title: 'Deliver',
    body: 'Pre-computed timing intelligence for clinicians, optional workforce programmes, and consented research datasets — insurer access permanently excluded.',
  },
  {
    num: '04',
    title: 'Close the loop',
    body: 'Longitudinal monitoring tracks population velocity and deterioration — intervention before threshold crossing.',
  },
] as const

export function ClosedLoop() {
  return (
    <section id="closed-loop" className={`${SECTION} bg-white py-16 sm:py-20`}>
      <div className={CONTAINER}>
        <p className="font-mono text-xs uppercase tracking-widest text-black/50">The closed loop</p>
        <h2 className="type-section mt-4">Detect · Diagnose · Deliver.</h2>
        <p className="type-body mt-4 max-w-2xl">
          DIOS closes the loop when biological thresholds cross — from passive capture to
          population-level intervention, without adding operational friction.
        </p>

        <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((step) => (
            <Card
              key={step.num}
              className="gap-0 border border-black/10 bg-[#FAFAFA] py-0 shadow-none ring-0"
            >
              <CardHeader className="gap-3 px-6 pt-6">
                <span className="font-mono text-2xl font-medium tabular-nums text-[#C9973A]">
                  {step.num}
                </span>
                <CardTitle className="min-h-[2.75rem] font-sans text-lg font-semibold leading-snug text-black">
                  {step.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="px-6 pb-6">
                <p className="type-body min-h-[4.5em] text-pretty text-black/70">{step.body}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
