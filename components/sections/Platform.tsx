import Image from 'next/image'

import { SITE_IMAGES } from '@/lib/site-images'

import { BODY, CONTAINER, SECTION, SECTION_TITLE } from './layout'
import { SectionLabel } from './SectionLabel'

const STREAMS = [
  {
    image: SITE_IMAGES.streams.wearable,
    alt: 'Sleep tracker on a bedside table',
    headline: 'The sleep tracker reads when your patient actually sleeps',
    caption: 'TipTraQ wearable stream',
  },
  {
    image: SITE_IMAGES.streams.lab,
    alt: 'Blood test vials in a lab tray',
    headline: 'The blood panel checks whether their body can use the medicine properly',
    caption: 'Vitamin D, B12, ferritin, and cortisol',
  },
  {
    image: SITE_IMAGES.streams.retina,
    alt: 'Handheld eye scan device',
    headline: 'The eye scan reads the retinal nerve that drives their body clock',
    caption: 'Siloton Giraffe OCT on the specialist tier',
  },
  {
    image: SITE_IMAGES.streams.mobile,
    alt: 'Smartphone on a desk',
    headline: 'Their phone passively tracks light exposure and daily rhythm',
    caption: 'Smartphone passive stream',
  },
] as const

export function Platform() {
  return (
    <section id="how-it-works" className={`${SECTION} bg-[#FAFAFA] py-14 sm:py-20`}>
      <div className={CONTAINER}>
        <SectionLabel title="How it works" />
        <h2 className={`${SECTION_TITLE} mt-4 max-w-xl`}>
          Your patient generates the data and you act on the timing call
        </h2>
        <p className={`${BODY} mt-4 max-w-xl`}>
          DIOS reads four data streams your patient already generates without extra clinic visits or tests
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
