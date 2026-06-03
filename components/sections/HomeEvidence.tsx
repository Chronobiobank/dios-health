import Link from 'next/link'

import { CONTAINER, LIST_LINE, SECTION, SECTION_TITLE, BTN_PRIMARY } from './layout'
import { SectionLabel } from './SectionLabel'

const EVIDENCE_LINES = [
  '— Northwestern University PNAS 2018 DLMO methodology.',
  '— TipTraQ is FDA 510(k)-cleared for sleep apnea monitoring.',
  '— All eight medications have published chronodosing evidence.',
] as const

export function HomeEvidence() {
  return (
    <section className={`${SECTION} ${CONTAINER}`}>
      <SectionLabel title="The evidence" />
      <h2 className={`${SECTION_TITLE} mt-4 max-w-2xl`}>Peer-reviewed. Not a wellness app.</h2>
      <ul className="mt-8 max-w-3xl space-y-4">
        {EVIDENCE_LINES.map((line) => (
          <li key={line} className={LIST_LINE}>
            {line}
          </li>
        ))}
      </ul>
      <Link href="/technology" className={`${BTN_PRIMARY} mt-10`}>
        Read the technology →
      </Link>
    </section>
  )
}
