import Image from 'next/image'

import { INTELLIGENCE_CADENCES } from '@/lib/product/intelligence-cadence'
import { SITE_IMAGES } from '@/lib/site-images'

import { BODY, CONTAINER, SECTION, SECTION_TITLE } from './layout'
import { SectionLabel } from './SectionLabel'

const STREAMS = [
  {
    image: SITE_IMAGES.streams.mobile,
    alt: 'Smartphone on a desk',
    headline: INTELLIGENCE_CADENCES.dose_adherence.label,
    caption: `${INTELLIGENCE_CADENCES.dose_adherence.interval} — ${INTELLIGENCE_CADENCES.dose_adherence.roleLabel}`,
  },
  {
    image: SITE_IMAGES.streams.mobile,
    alt: 'Smartphone camera at wake and sleep',
    headline: INTELLIGENCE_CADENCES.mlux_camera.label,
    caption: `${INTELLIGENCE_CADENCES.mlux_camera.interval} — ${INTELLIGENCE_CADENCES.mlux_camera.roleLabel}`,
  },
  {
    image: SITE_IMAGES.streams.lab,
    alt: 'Blood test vials in a lab tray',
    headline: INTELLIGENCE_CADENCES.blood_panel.label,
    caption: `${INTELLIGENCE_CADENCES.blood_panel.interval} — ${INTELLIGENCE_CADENCES.blood_panel.roleLabel}`,
  },
  {
    image: SITE_IMAGES.streams.wearable,
    alt: 'TipTraQ fingertip sleep sensor',
    headline: INTELLIGENCE_CADENCES.tiptraq.label,
    caption: `${INTELLIGENCE_CADENCES.tiptraq.interval} — ${INTELLIGENCE_CADENCES.tiptraq.roleLabel}`,
  },
] as const

export function Platform() {
  return (
    <section id="how-it-works" className={`${SECTION} bg-[#FAFAFA] py-14 sm:py-20`}>
      <div className={CONTAINER}>
        <SectionLabel title="How it works" />
        <h2 className={`${SECTION_TITLE} mt-4 max-w-xl`}>
          Four cadences, one dose engine
        </h2>
        <p className={`${BODY} mt-4 max-w-xl`}>
          TipTraQ sets the clock. Blood confirms response. Camera maintains the estimate. DINA proves
          adherence.
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
