import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

import { BODY, CONTAINER, SECTION } from './layout'

const STEPS = [
  {
    num: '01',
    title: 'Detect rhythm from wearable, lab, retinal, and phone data',
    body: 'Passive capture across four streams adds zero burden for the patient or the clinic',
  },
  {
    num: '02',
    title: 'Diagnose the dose window from your patient\'s body clock',
    body: 'Timing modules surface when to take medicines already prescribed — informing your decision, not replacing it',
  },
  {
    num: '03',
    title: 'Deliver timing intelligence to clinicians and consented research',
    body: 'Pre-computed intelligence reaches the desk, workforce programmes, and opt-in research with insurers permanently excluded',
  },
  {
    num: '04',
    title: 'Close the loop before biological thresholds cross',
    body: 'Longitudinal monitoring flags drift velocity before deterioration needs a reactive intervention',
  },
] as const

export function ClosedLoop() {
  return (
    <section id="closed-loop" className={`${SECTION} bg-white py-16 sm:py-20`}>
      <div className={CONTAINER}>
        <p className="font-mono text-xs uppercase tracking-widest text-black/50">The closed loop</p>
        <h2 className="type-section mt-4 max-w-3xl">
          Detect, diagnose, and deliver dose timing in one closed loop
        </h2>
        <p className={`${BODY} mt-4 max-w-2xl`}>
          DIOS moves from passive capture to population intervention when biological thresholds cross — without operational friction
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
                <CardTitle className="font-sans text-lg font-semibold leading-snug text-black">
                  {step.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="px-6 pb-6">
                <p className={`${BODY} text-pretty`}>{step.body}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
