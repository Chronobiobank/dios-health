import Image from 'next/image'

import { SITE_IMAGES } from '@/lib/site-images'

import { BODY, CONTAINER, SECTION, SECTION_TITLE } from './layout'
import { SectionLabel } from './SectionLabel'

const STREAMS = [
  {
    image: SITE_IMAGES.streams.wearable,
    alt: 'Sleep tracker on a bedside table',
    lead: 'Sleep tracker',
    plain: 'reads when they actually sleep',
    detail: 'TipTraQ wearable',
  },
  {
    image: SITE_IMAGES.streams.lab,
    alt: 'Blood test vials in a lab tray',
    lead: 'Blood panel',
    plain: 'checks if their body can use the medicine properly',
    detail: 'Vitamin D · B12 · Ferritin · Cortisol',
  },
  {
    image: SITE_IMAGES.streams.retina,
    alt: 'Handheld eye scan device',
    lead: 'Eye scan',
    plain: 'checks the retinal nerve that drives their body clock',
    detail: 'Siloton Giraffe OCT — optional, specialist tier',
  },
  {
    image: SITE_IMAGES.streams.mobile,
    alt: 'Smartphone on a desk',
    lead: 'Their phone',
    plain: 'tracks light exposure and daily rhythm passively',
    detail: 'Smartphone passive',
  },
] as const

export function Platform() {
  return (
    <section id="how-it-works" className={`${SECTION} bg-[#FAFAFA] py-14 sm:py-20`}>
      <div className={CONTAINER}>
        <SectionLabel title="How it works" />
        <h2 className={`${SECTION_TITLE} mt-4`}>
          Your patient wears it.
          <br />
          You act on it.
        </h2>
        <p className={`${BODY} mt-4 max-w-xl`}>
          No clinic visits. No extra tests. DIOS reads four data streams your patient is already
          generating.
        </p>

        <ul className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2">
          {STREAMS.map((stream) => (
            <li
              key={stream.lead}
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
                  {stream.lead} → {stream.plain}
                </p>
                <p className="type-label mt-2 text-black/50">{stream.detail}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
