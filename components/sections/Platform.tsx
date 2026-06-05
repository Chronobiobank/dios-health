import Image from 'next/image'

import { SITE_IMAGES } from '@/lib/site-images'

import { BODY, CONTAINER, SECTION, SECTION_TITLE } from './layout'
import { SectionLabel } from './SectionLabel'

const STREAMS = [
  {
    image: SITE_IMAGES.streams.mobile,
    alt: 'Smartphone on a desk',
    headline: 'DIOS computes melanopic dose — intensity, wavelength, timing',
    caption: 'Dose Intelligence OS · passive phone stream',
  },
  {
    image: SITE_IMAGES.streams.retina,
    alt: 'Handheld eye scan device',
    headline: 'Siloton GiraffeOCT maps retinal light-receptor density',
    caption: 'Quantum photonic-chip eye-clock scan',
  },
  {
    image: SITE_IMAGES.streams.lab,
    alt: 'Blood test vials in a lab tray',
    headline: 'Biochemical fuel titration — D3, B5, B12 for deep sleep chemistry',
    caption: 'Quarterly metabolic panel',
  },
  {
    image: SITE_IMAGES.streams.wearable,
    alt: 'TipTraQ fingertip sleep sensor',
    headline: 'PranaQ TipTraQ verifies neural sleep recovery',
    caption: 'FDA-cleared fingertip telemetry',
  },
] as const

export function Platform() {
  return (
    <section id="how-it-works" className={`${SECTION} bg-[#FAFAFA] py-14 sm:py-20`}>
      <div className={CONTAINER}>
        <SectionLabel title="How it works" />
        <h2 className={`${SECTION_TITLE} mt-4 max-w-xl`}>
          Dose Intelligence — four automated inputs, one dose engine
        </h2>
        <p className={`${BODY} mt-4 max-w-xl`}>
          Eye-clock structure, biochemical fuel, passive light sensing, and medical-grade sleep verification —
          no guesswork wearables
        </p>

        <ul className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2">
          {STREAMS.map((stream) => (
            <li
              key={stream.headline}
              className="flex gap-4 rounded-lg border border-black/10 bg-white p-4 sm:gap-5 sm:p-5"
            >
              <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-md bg-[#F5F5F5] sm:h-24 sm:w-24">
                <Image
                  src={stream.image}
                  alt={stream.alt}
                  fill
                  sizes="96px"
                  className="object-cover"
                />
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-sans text-base font-semibold leading-snug text-black">
                  {stream.headline}
                </p>
                <p className="type-caption mt-2">{stream.caption}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
