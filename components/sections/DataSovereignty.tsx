import Link from 'next/link'

import { CONTAINER, LIST_LINE, SECTION, SECTION_TITLE } from './layout'
import { SectionLabel } from './SectionLabel'

export function DataSovereignty() {
  return (
    <section id="sovereignty" className={`${SECTION} ${CONTAINER}`}>
      <SectionLabel title="Data sovereignty" />
      <h2 className={`${SECTION_TITLE} mt-4 max-w-md`}>
        Left out of the science.
        <br />
        Built into the platform.
      </h2>

      <blockquote className="mt-8 border-l-2 border-black/20 bg-[#FAFAFA] px-8 py-8 sm:px-10 sm:py-10">
        <ul className="space-y-2">
          <li className={LIST_LINE}>The original trials missed most of the world.</li>
          <li className={LIST_LINE}>DIOS was built to include all of it.</li>
        </ul>
      </blockquote>

      <p className="mt-8">
        <Link
          href="/evidence#sovereignty"
          className="type-button text-black underline-offset-4 hover:underline"
        >
          How we built this →
        </Link>
      </p>
    </section>
  )
}
