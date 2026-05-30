import Image from 'next/image'
import { SectionIntro } from './SectionIntro'

const CLIENTS = [
  {
    tag: 'Clinicians who need timing intelligence before the patient walks in',
    headline: 'Pre-computed SWSD signal and differential arrive before the consultation starts',
    body: 'The GP sees wearable MSFsc, timing recommendations, and audit-ready outputs that inform the prescribing decision',
    metric: 'Each profile is pre-computed from passive patient streams',
    image: {
      src: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&q=85',
      alt: 'Healthcare consultant speaking with a patient during a clinical consultation',
      objectPosition: 'center 35%',
    },
  },
  {
    tag: 'Workforce leaders who need population-level circadian coherence',
    headline: 'Population coherence intelligence shows which teams and shifts carry the highest drift risk',
    body: 'Leaders see which roles need intervention before incidents, absenteeism, and attrition compound',
    metric: 'Outputs are grouped by role, shift pattern, and team',
    image: {
      src: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=800&q=85',
      alt: 'Leadership team in a boardroom reviewing workforce strategy',
      objectPosition: 'center center',
    },
  },
  {
    tag: 'Insurers who are permanently excluded from patient and population data',
    headline: 'Insurer access to exposure modelling is excluded by platform design rather than policy',
    body: 'Patient and population risk data never flows to underwriting teams regardless of contract terms',
    metric: 'Exposure scoring remains unavailable to insurance buyers by design',
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
          title="One platform with a different value proposition for each buyer"
          subtitle="Clinicians, workforce leaders, and researchers each get a dedicated outcome from the same consent model"
          className="mb-14 text-center md:mb-16 [&_.dios-lead]:mx-auto"
          titleClassName="mx-auto"
        />

        <div className="grid gap-8 md:grid-cols-3 md:gap-6 lg:gap-8">
          {CLIENTS.map((client) => (
            <article
              key={client.headline}
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
