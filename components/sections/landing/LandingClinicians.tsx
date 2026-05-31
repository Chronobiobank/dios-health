import { HashLink } from '@/components/sections/HashLink'
import { BODY, BTN_PRIMARY, LANDING_COLUMN, SECTION, SECTION_TITLE } from '@/components/sections/layout'

import { GeometricBg } from './GeometricBg'

export function LandingClinicians() {
  return (
    <section className={`${SECTION} relative bg-[#F9F9F9]`}>
      <GeometricBg variant="muted" />
      <div className={`${LANDING_COLUMN} relative`}>
        <h2 className={`${SECTION_TITLE} max-w-lg`}>
          Your patients are already taking these medications. Now they can take them better.
        </h2>
        <p className={`${BODY} mt-5 max-w-lg text-black/70`}>
          DIʘS gives GPs and pharmacists a clinically grounded tool for chronodosing — without
          changing the prescription. Patients share their body clock report at their next
          appointment.
        </p>
        <HashLink href="/#demo" className={`${BTN_PRIMARY} mt-8 h-12 px-6`}>
          Book a clinical demo →
        </HashLink>
      </div>
    </section>
  )
}
