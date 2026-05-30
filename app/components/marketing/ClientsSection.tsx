import Image from 'next/image'
import { SectionIntro } from './SectionIntro'

const CLIENTS = [
  {
    tag: 'For Clinicians',
    headline: 'Pre-computed SWSD signal and differential — before the patient walks in.',
    body: 'DIOS delivers chronotype-informed dose timing intelligence. The GP sees wearable-derived MSFsc, timing recommendations, and audit-ready outputs — informing the prescribing decision.',
    metric: 'Output: pre-computed biological profiles',
    image: {
      src: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&q=85',
      alt: 'Healthcare consultant speaking with a patient during a clinical consultation',
      objectPosition: 'center 35%',
    },
  },
  {
    tag: 'Workforce & institutions',
    headline: 'Population-level coherence intelligence across your workforce.',
    body: 'Identify which teams, shifts, and roles are at highest circadian risk — before incidents, absenteeism, and attrition compound.',
    metric: 'Output: coherence intelligence by role, shift, and team',
    image: {
      src: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=800&q=85',
      alt: 'Leadership team in a boardroom reviewing workforce strategy',
      objectPosition: 'center center',
    },
  },
  {
    tag: 'Excluded — insurers',
    headline: 'Exposure risk modelling before the claim is filed.',
    body: 'Insurer access to patient or population risk data is permanently excluded — by design, not policy.',
    metric: 'Output: exposure risk score and claims probability',
    image: {
      src: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=85',
      alt: 'Analytics dashboard showing population risk trends and metrics',
      objectPosition: 'center center',
    },
  },
] as const

export function ClientsSection() {
  return (
    <section id="clients" className="dios-section bg-dios-cream">
      <div className="dios-container">
        <SectionIntro
          eyebrow="Our clients"
          title="One platform. Three value propositions."
          subtitle="Built for three buyers"
          className="mb-14 text-center md:mb-16 [&_.dios-lead]:mx-auto"
          titleClassName="mx-auto"
        />

        <div className="grid gap-8 md:grid-cols-3 md:gap-6 lg:gap-8">
          {CLIENTS.map((client) => (
            <article
              key={client.tag}
              className="flex flex-col border border-dios-border bg-white p-8 md:p-9"
            >
              <div className="dios-photo relative mb-6 aspect-[4/3] w-full overflow-hidden">
                <Image
                  src={client.image.src}
                  alt={client.image.alt}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover"
                  style={{ objectPosition: client.image.objectPosition }}
                />
              </div>

              <span className="dios-tag mb-4 w-fit rounded-full bg-dios-aubergine px-3 py-1 text-dios-lilac">
                {client.tag}
              </span>
              <h3 className="dios-display mb-4 text-xl leading-snug text-dios-aubergine md:text-2xl">
                {client.headline}
              </h3>
              <p className="dios-body mb-6 flex-1 text-sm md:text-base">{client.body}</p>
              <p className="text-sm font-semibold text-dios-gold">{client.metric}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
