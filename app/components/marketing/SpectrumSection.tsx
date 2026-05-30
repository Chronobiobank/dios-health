import { SectionIntro } from './SectionIntro'

const STAGES = [
  {
    stage: 'Stage 1: Behavioural',
    bg: 'bg-dios-lilac-light',
    tag: 'Mild / Acute',
    headline: 'Social Jetlag & Shift Work Disorder',
    body: 'Your cells work fine but your daily habits do not match your internal clock. Social jetlag causes mild weekly clock confusion. Shift Work Sleep Disorder forces you to sleep when your brain wants to be awake.',
    dark: false,
  },
  {
    stage: 'Stage 2: Metabolic',
    bg: 'bg-dios-surface',
    tag: 'Intermediate',
    headline: 'Diabetes & Heart Disease',
    body: 'When clock disruption lasts months or years it breaks down your metabolism and blood vessels. Your body master clock controls how you use sugar — when it is broken your cells stop responding to insulin.',
    dark: false,
  },
  {
    stage: 'Stage 3: Systemic',
    bg: 'bg-[#FDF6E8]',
    tag: 'Severe',
    headline: 'Cancer',
    body: 'The body clock controls cell growth and fixes damaged DNA. When the clock stops working mutated cells can grow out of control. Night shift workers carry measurably elevated cancer risk.',
    dark: false,
  },
  {
    stage: 'Stage 4: Neurological',
    bg: 'bg-dios-aubergine',
    tag: 'Chronic',
    headline: "Dementia & Alzheimer's",
    body: "Your brain clears dangerous waste products during sleep. Chronic clock disruption stops this cleaning process causing toxic plaques to build up. Circadian dysfunction is now linked to Alzheimer's disease onset.",
    dark: true,
  },
] as const

const SPECTRUM_MARKERS = [
  'Social Jetlag',
  'Shift Work Disorder',
  'Diabetes & Heart Disease',
  'Cancer & Dementia',
] as const

const REFERENCES = [
  'PMC7261021',
  'PMC4212693',
  'PMC9974590',
  'PMC7002226',
  'PMC11050388',
  'PMC12254753',
] as const

export function SpectrumSection() {
  return (
    <section id="science" className="dios-section bg-dios-cream">
      <div className="dios-container">
        <SectionIntro
          eyebrow="The evidence"
          title="Circadian dysfunction is not just tiredness. It is a pathway to serious disease."
          subtitle="Scientists now view body clock disruption as a core driver of major illness — not just a cause of fatigue. The disruption spectrum runs from mild behavioural misalignment to cancer and dementia."
          className="mb-16 md:mb-20"
        />

        <div className="mb-16 md:mb-24">
          <div className="mb-3 flex justify-between dios-tag text-dios-muted">
            <span>Mild / Acute</span>
            <span>Severe / Chronic</span>
          </div>
          <div className="relative">
            {/* Full-width track — vertically centred on dots */}
            <div
              className="pointer-events-none absolute inset-x-0 top-[0.5625rem] z-0 -translate-y-1/2"
              aria-hidden
            >
              <div className="dios-spectrum-track" />
            </div>
            <div className="relative z-10 grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-4 sm:gap-y-0">
              {SPECTRUM_MARKERS.map((label) => (
                <div key={label} className="flex flex-col items-center text-center">
                  <span
                    className="mb-5 block h-2.5 w-2.5 shrink-0 rounded-full bg-dios-gold ring-4 ring-dios-cream"
                    aria-hidden
                  />
                  <p className="px-1 text-xs font-semibold leading-snug text-dios-aubergine md:text-sm">
                    {label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mb-16 grid gap-px bg-dios-border md:grid-cols-2 md:mb-20">
          {STAGES.map((card) => (
            <article key={card.stage} className={`dios-editorial-card ${card.bg}`}>
              <p className={`dios-tag mb-4 ${card.dark ? 'text-dios-gold' : 'text-dios-muted'}`}>
                {card.stage}
              </p>
              <h3
                className={`dios-display mb-4 text-2xl md:text-[1.75rem] ${card.dark ? 'text-white' : 'text-dios-aubergine'}`}
              >
                {card.headline}
              </h3>
              <p className={`dios-body mb-8 flex-1 ${card.dark ? 'text-dios-lilac' : ''}`}>{card.body}</p>
              <span
                className={`dios-tag w-fit rounded-full px-3 py-1.5 ${
                  card.dark ? 'bg-white/10 text-dios-gold' : 'bg-dios-aubergine/5 text-dios-aubergine'
                }`}
              >
                {card.tag}
              </span>
            </article>
          ))}
        </div>

        <blockquote className="border-l-2 border-dios-gold bg-dios-lilac-light px-8 py-10 md:px-12 md:py-14 mb-12">
          <p className="dios-display text-[clamp(1.375rem,2.5vw,2rem)] leading-snug text-dios-aubergine mb-4">
            DIOS detects circadian disruption at Stage 1 — before it progresses to Stage 2, 3, or 4.
          </p>
          <p className="dios-body max-w-2xl">
            Early chronotype-informed dose timing is clinically essential — and untranslated into
            everyday prescribing. DIOS informs the clinician&apos;s prescribing decision.
          </p>
        </blockquote>

        <div className="flex flex-wrap justify-center gap-3">
          {REFERENCES.map((id) => (
            <a
              key={id}
              href={`https://www.ncbi.nlm.nih.gov/pmc/articles/${id}/`}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border border-dios-border bg-white px-4 py-2 text-xs font-medium text-dios-aubergine transition-colors hover:border-dios-aubergine/30 hover:bg-dios-cream"
            >
              {id}
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
