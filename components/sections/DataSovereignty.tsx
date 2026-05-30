import Image from 'next/image'
import Link from 'next/link'

import { BTN_HERO, CONTAINER, SECTION } from './layout'
import { SectionLabel } from './SectionLabel'

const SECTION_IMAGE = {
  src: '/data-sovereignty.png',
  alt: 'Secure cloud and hardware — patient data sovereignty and encrypted consent control',
} as const

export function DataSovereignty() {
  return (
    <section id="sovereignty" className={`${SECTION} ${CONTAINER}`}>
      <div className="relative aspect-video w-full overflow-hidden rounded-xl lg:aspect-[21/9]">
        <Image
          src={SECTION_IMAGE.src}
          alt={SECTION_IMAGE.alt}
          fill
          sizes="(max-width: 1024px) 100vw, 76rem"
          loading="lazy"
          className="object-cover"
        />

        <div className="absolute inset-0 bg-black/55" aria-hidden />

        <div className="relative z-10 flex min-h-full flex-col justify-end px-6 py-10 text-white sm:justify-center sm:px-10 sm:py-12 lg:px-14 lg:py-16">
          <SectionLabel title="Data sovereignty" light />

          <h2 className="type-hero-overlay mt-4 max-w-2xl text-white">
            We include what trials leave out
          </h2>

          <Link href="/evidence#sovereignty" className={`${BTN_HERO} mt-8`}>
            How we built this →
          </Link>
        </div>
      </div>
    </section>
  )
}
