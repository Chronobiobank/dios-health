import Link from 'next/link'

import { BTN_PRIMARY, CONTAINER, LIST_LINE, SECTION, SECTION_ALT, SECTION_TITLE } from './layout'
import { SectionLabel } from './SectionLabel'

const STATEMENTS = [
  'Tell DIOS what medications and supplements you take.',
  'DIOS builds your personal body clock protocol automatically.',
  'Every pill, supplement, and dose of sunlight — timed to your biology.',
] as const

export function TimebotHome() {
  return (
    <section id="dios-timebot" className={`${SECTION} ${SECTION_ALT}`}>
      <div className={CONTAINER}>
        <SectionLabel title="The DIOS Timebot" />
        <h2 className={`${SECTION_TITLE} mt-4 max-w-2xl`}>No forms. Just a conversation.</h2>
        <ul className="mt-8 max-w-2xl space-y-4">
          {STATEMENTS.map((line) => (
            <li key={line} className={LIST_LINE}>
              {line}
            </li>
          ))}
        </ul>
        <Link href="/signup" className={`${BTN_PRIMARY} mt-10`}>
          Try it free →
        </Link>
      </div>
    </section>
  )
}
