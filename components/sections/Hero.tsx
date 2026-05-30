import Image from 'next/image'
import Link from 'next/link'

import { BTN_PRIMARY, CONTAINER } from './layout'
import { SectionLabel } from './SectionLabel'

const HERO_IMAGE = {
  src: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=80',
  alt: 'Person in morning light — body clock entrainment through natural light exposure',
  width: 1200,
  height: 675,
} as const

export function Hero() {
  return (
    <section
      id="our-edge"
      className="w-full py-14 sm:py-20 lg:py-24"
    >
      <div className={`${CONTAINER} grid grid-cols-1 items-center gap-8 lg:grid-cols-2 lg:gap-12`}>
        <div className="order-2 text-left lg:order-1">
          <SectionLabel title="Our Edge" />

          <h1 className="type-hero mt-4">
            The World&apos;s First
            <br />
            Dose Intelligence Platform
          </h1>

          <ul className="type-body mt-8 space-y-2">
            <li>Light sets your clock.</li>
            <li>Food feeds your rhythm.</li>
            <li>Medicine needs your window.</li>
          </ul>

          <p className="type-body mt-6 max-w-xl">
            DIOS reads your body clock and finds the right time for every treatment.
          </p>

          <Link href="#demo" className={`${BTN_PRIMARY} mt-8`}>
            See it in action in 30 minutes →
          </Link>
        </div>

        <div className="order-1 w-full lg:order-2">
          <Image
            src={HERO_IMAGE.src}
            alt={HERO_IMAGE.alt}
            width={HERO_IMAGE.width}
            height={HERO_IMAGE.height}
            className="aspect-video w-full rounded-lg object-cover lg:aspect-auto lg:min-h-[28rem] lg:rounded-xl"
            priority
          />
        </div>
      </div>
    </section>
  )
}
