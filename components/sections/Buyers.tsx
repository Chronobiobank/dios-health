import Image from 'next/image'

import { BODY, CONTAINER, SECTION, SECTION_TITLE } from './layout'
import { SectionLabel } from './SectionLabel'

const CLIENTS = [
  {
    tag: 'Prescribing clinicians who need timing intelligence at the point of care',
    headline: 'You prescribe — DIOS informs your timing call',
    image: {
      src: '/buyer-clinicians-team.png',
      alt: 'Diverse clinical team reviewing a case together — dose timing intelligence for prescribing clinicians',
      width: 1200,
      height: 800,
    },
  },
  {
    tag: 'Research teams who need a chronotype-stratified population dataset',
    headline: 'The chronotype dataset that doesn\'t exist anywhere else',
    image: {
      src: '/buyer-research-team.png',
      alt: 'Research team reviewing chronotype data on lab monitors — population dataset analysis',
      width: 1200,
      height: 800,
    },
  },
  {
    tag: 'Workforce leaders managing circadian risk across shift patterns',
    headline: 'Shift-work timing intelligence at workforce scale',
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
      <h2 className={`${SECTION_TITLE} mt-4 max-w-lg`}>
        Built for GPs and open to everyone who needs dose timing
      </h2>
      <p className={`${BODY} mt-4 max-w-lg`}>
        The same platform serves clinicians, researchers, and workforce programmes with one consent model
      </p>

      <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-3">
        {CLIENTS.map((client) => (
          <article key={client.headline} className="flex flex-col">
            <Image
              src={client.image.src}
              alt={client.image.alt}
              width={client.image.width}
              height={client.image.height}
              loading="lazy"
              className="mb-4 aspect-[3/2] w-full rounded-lg object-cover"
            />
            <p className="type-caption mb-3">{client.tag}</p>
            <p className="type-tile-title">{client.headline}</p>
          </article>
        ))}
      </div>
    </section>
  )
}
