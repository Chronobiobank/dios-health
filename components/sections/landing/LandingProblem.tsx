import { BODY, LANDING_COLUMN, SECTION, SECTION_TITLE } from '@/components/sections/layout'

import { GeometricBg } from './GeometricBg'

export function LandingProblem() {
  return (
    <section id="problem" className={`${SECTION} relative bg-white`}>
      <GeometricBg variant="light" />
      <div className={`${LANDING_COLUMN} relative`}>
        <h2 className={`${SECTION_TITLE} max-w-lg`}>
          Timing is the instruction your prescription is missing.
        </h2>
        <p className={`${BODY} mt-5 max-w-lg text-black/70`}>
          Most medications have a best time. Not morning or evening — a precise window tied to your
          biology. Miss it and the medication works less. Hit it and it works better. Nobody tells
          you this. Until now.
        </p>
      </div>
    </section>
  )
}
