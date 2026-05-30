import Image from 'next/image'

import { MatchedLines } from './MatchedLines'
import { CONTAINER, SECTION, SECTION_TITLE } from './layout'
import { SectionLabel } from './SectionLabel'

const CLIENTS = [
  {
    tag: 'GPs',
    headline: ['GPs · You prescribe.', 'DIOS informs.'],
    image: {
      src: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=600&q=80',
      alt: 'GP in consultation — dose timing intelligence for prescribing clinicians',
      width: 1200,
      height: 800,
    },
  },
  {
    tag: 'Researchers',
    headline: ['Researchers · The dataset', 'doesn\'t exist elsewhere.'],
    image: {
      src: 'https://images.unsplash.com/photo-1532094349884-543559a8f9c1?w=600&q=80',
      alt: 'Research team reviewing data — chronotype-stratified population dataset',
      width: 1200,
      height: 800,
    },
  },
  {
    tag: 'Workforce',
    headline: ['Workforce · Shift-work', 'timing at scale.'],
    image: {
      src: 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=600&q=80',
      alt: 'Shift workers at night — circadian disruption and workforce health',
      width: 1200,
      height: 800,
    },
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
            <Image
              src={client.image.src}
              alt={client.image.alt}
              width={client.image.width}
              height={client.image.height}
              loading="lazy"
              className="mb-4 aspect-[3/2] w-full rounded-lg object-cover"
            />
            <p className="type-label mb-2">{client.tag}</p>
            <MatchedLines lines={client.headline} variant="headline" slots={2} />
          </article>
        ))}
      </div>
    </section>
  )
}
