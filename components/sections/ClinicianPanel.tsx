import Image from 'next/image'

import { Badge } from '@/components/ui/badge'

import { BODY, CARD, CONTAINER, SECTION, SECTION_TITLE } from './layout'
import { SectionLabel } from './SectionLabel'

const SECTION_IMAGE = {
  src: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&q=80',
  alt: 'Clinician reviewing patient data — dose timing intelligence at point of care',
  width: 1200,
  height: 675,
} as const

const ROWS = [
  {
    patient: 'Margaret T, 58',
    finding: 'Blood pressure is not dipping overnight on current morning dosing',
    bodyClock: 'Night owl chronotype running 1.2 hours late',
    data: 'Wearable shows non-dipping on six of seven nights',
    status: 'Act now',
    action: 'Move ramipril to bedtime tonight',
    urgent: true,
  },
  {
    patient: 'James O., 44',
    finding: 'Statin is being taken too early for his liver clock',
    bodyClock: 'Standard chronotype and on track otherwise',
    data: 'Wearable stream complete and current',
    status: 'Earlier dose',
    action: 'Shift simvastatin to evening dosing',
    urgent: true,
  },
  {
    patient: 'Priya N., 61',
    finding: 'Vitamin D result is missing before timing can be confirmed',
    bodyClock: 'Chronotype unknown until blood panel returns',
    data: 'City Labs blood panel still pending',
    status: 'Need bloods',
    action: 'Order City Labs panel before next review',
    urgent: false,
  },
  {
    patient: 'David K., 52',
    finding: 'Current medicine timing matches his body clock',
    bodyClock: 'Aligned chronotype and stable drift index',
    data: 'All data streams live and complete',
    status: 'On track',
    action: 'No dose timing change needed today',
    urgent: false,
  },
] as const

export function ClinicianPanel() {
  return (
    <section id="panel" className={`${SECTION} ${CONTAINER}`}>
      <SectionLabel title="Clinician panel" />

      <div className="mt-4 grid grid-cols-1 items-center gap-6 lg:grid-cols-2 lg:gap-12">
        <Image
          src={SECTION_IMAGE.src}
          alt={SECTION_IMAGE.alt}
          width={SECTION_IMAGE.width}
          height={SECTION_IMAGE.height}
          loading="lazy"
          className="aspect-video w-full rounded-lg object-cover lg:rounded-xl"
        />

        <div>
          <h2 className={`${SECTION_TITLE} max-w-md`}>
            See which patients need acting on right now
          </h2>
          <p className={`${BODY} mt-4 max-w-lg`}>
            Every row is ranked by clinical urgency so you know who needs a timing change today
          </p>
        </div>
      </div>

      <div className={`${CARD} mt-8 overflow-x-auto rounded-xl`}>
        <table className="w-full min-w-[640px] border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-black/10 bg-[#FAFAFA] font-mono text-[10px] uppercase tracking-wider text-black/50">
              <th className="px-4 py-3 font-medium sm:px-5">PATIENT</th>
              <th className="px-4 py-3 font-medium sm:px-5">FINDING</th>
              <th className="px-4 py-3 font-medium sm:px-5">BODY CLOCK</th>
              <th className="px-4 py-3 font-medium sm:px-5">DATA</th>
              <th className="px-4 py-3 font-medium sm:px-5">ACTION</th>
            </tr>
          </thead>
          <tbody>
            {ROWS.map((row) => (
              <tr key={row.patient} className="border-b border-black/5 last:border-0">
                <td className="px-4 py-4 font-medium text-black sm:px-5">{row.patient}</td>
                <td className="px-4 py-4 text-black/80 sm:px-5">{row.finding}</td>
                <td className="px-4 py-4 text-black/70 sm:px-5">{row.bodyClock}</td>
                <td className="px-4 py-4 text-black/70 sm:px-5">{row.data}</td>
                <td className="px-4 py-4 sm:px-5">
                  <div className="flex flex-col gap-2">
                    <Badge
                      variant="outline"
                      className={
                        row.urgent
                          ? 'w-fit border-black/20 bg-[#FAFAFA] text-black'
                          : 'w-fit border-black/10 text-black/60'
                      }
                    >
                      {row.status}
                    </Badge>
                    <span className="text-black/80">{row.action}</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}
