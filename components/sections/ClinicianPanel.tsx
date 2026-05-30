import { Badge } from '@/components/ui/badge'

import { BODY, CARD, CONTAINER, SECTION, SECTION_TITLE } from './layout'
import { SectionLabel } from './SectionLabel'

const ROWS = [
  {
    patient: 'Margaret T, 58',
    finding: 'Blood pressure not dipping at night',
    bodyClock: 'Night owl · 1.2h late',
    data: '6 of 7 nights',
    status: 'Act now',
    action: 'Move Ramipril to bedtime',
    urgent: true,
  },
  {
    patient: 'James O., 44',
    finding: 'Statin taken too early in the day',
    bodyClock: 'Standard · on track',
    data: 'Wearable complete',
    status: 'Earlier dose',
    action: 'Shift Simvastatin to evening',
    urgent: true,
  },
  {
    patient: 'Priya N., 61',
    finding: 'Vitamin D result missing',
    bodyClock: 'Unknown until panel in',
    data: 'Blood panel pending',
    status: 'Need bloods',
    action: 'Order City Labs panel',
    urgent: false,
  },
  {
    patient: 'David K., 52',
    finding: 'Timing matches body clock',
    bodyClock: 'Aligned · stable',
    data: 'All streams live',
    status: 'On track',
    action: 'No change today',
    urgent: false,
  },
] as const

export function ClinicianPanel() {
  return (
    <section id="panel" className={`${SECTION} ${CONTAINER}`}>
      <SectionLabel title="Clinician panel" />
      <h2 className={`${SECTION_TITLE} mt-4 max-w-md`}>
        Who needs acting on.
        <br />
        Right now.
      </h2>
      <p className={`${BODY} mt-4 max-w-sm`}>
        Your patients, ranked by what needs attention today.
      </p>

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
