import Image from 'next/image'

import { SITE_IMAGES } from '@/lib/site-images'

import { MatchedLines } from './MatchedLines'
import { CONTAINER, SECTION, SECTION_TITLE } from './layout'
import { SectionLabel } from './SectionLabel'

const CLIENTS = [
  {
    tag: 'GPs',
    headline: ['GPs · You prescribe.', 'DIOS informs.'],
    image: { src: SITE_IMAGES.buyers.clinicians, alt: 'GP in consultation with a patient' },
  },
  {
    tag: 'Researchers',
    headline: ['Researchers · The dataset', 'doesn\'t exist elsewhere.'],
    image: { src: SITE_IMAGES.buyers.research, alt: 'Researcher reviewing clinical data' },
  },
  {
    tag: 'Workforce',
    headline: ['Workforce · Shift-work', 'timing at scale.'],
    image: { src: SITE_IMAGES.buyers.workforce, alt: 'Shift workers on a clinical ward' },
  },
] as const

export function Buyers() {
  return (
    <section id="clients" className={`${SECTION} ${CONTAINER}`}>
      <SectionLabel title="Who it's for" />
      <h2 className={`${SECTION_TITLE} mt-4 max-w-md`}>
        Built for GPs.
        <br />
        Open to all.
      </h2>

      <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-3">
        {CLIENTS.map((client) => (
          <article key={client.tag} className="flex flex-col">
            <div className="relative mb-4 aspect-[4/3] w-full overflow-hidden rounded-lg bg-[#F5F5F5]">
              <Image
                src={client.image.src}
                alt={client.image.alt}
                fill
                sizes="(max-width: 1024px) 100vw, 33vw"
                className="object-cover transition-transform duration-700 ease-out hover:scale-[1.02]"
              />
            </div>
            <p className="type-label mb-2">{client.tag}</p>
            <MatchedLines lines={client.headline} variant="headline" slots={2} />
          </article>
        ))}
      </div>
    </section>
  )
}
