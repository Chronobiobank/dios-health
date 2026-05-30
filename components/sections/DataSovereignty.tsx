import Image from 'next/image'
import Link from 'next/link'

import { CONTAINER, LIST_LINE, SECTION, SECTION_TITLE } from './layout'
import { SectionLabel } from './SectionLabel'

const SECTION_IMAGE = {
  src: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=1200&q=80',
  alt: 'Open landscape — global indigenous data sovereignty and inclusion',
  width: 1200,
  height: 675,
} as const

export function DataSovereignty() {
  return (
    <section id="sovereignty" className={`${SECTION} ${CONTAINER}`}>
      <Image
        src={SECTION_IMAGE.src}
        alt={SECTION_IMAGE.alt}
        width={SECTION_IMAGE.width}
        height={SECTION_IMAGE.height}
        loading="lazy"
        className="aspect-video w-full rounded-xl object-cover lg:aspect-[21/9]"
      />

      <SectionLabel title="Data sovereignty" className="mt-8" />
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
