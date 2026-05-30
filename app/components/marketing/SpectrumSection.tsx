import { SectionIntro } from './SectionIntro'

const STAGES = [
  {
    stage: 'Stage one is behavioural disruption before organ damage begins',
    bg: 'bg-dios-lilac-light',
    tag: 'Mild acute misalignment at population scale',
    headline: 'Social jetlag and shift-work disorder are the earliest signals on the curve',
    body: 'Daily habits fall out of sync with the internal clock long before metabolic or neurological disease appears',
    dark: false,
  },
  {
    stage: 'Stage two is metabolic strain after months of sustained drift',
    bg: 'bg-dios-surface',
    tag: 'Intermediate cardiovascular and insulin disruption',
    headline: 'Diabetes and heart disease follow when the master clock stops regulating metabolism',
    body: 'Insulin resistance and vascular damage build quietly for years before a formal diagnosis is made',
    dark: false,
  },
  {
    stage: 'Stage three is systemic cancer risk in chronically misaligned cohorts',
    bg: 'bg-[#FDF6E8]',
    tag: 'Severe DNA repair failure in shift populations',
    headline: 'Cancer incidence rises when circadian control of cell growth breaks down',
    body: 'Night-shift workers carry higher cancer burden when clock-driven DNA repair fails',
    dark: false,
  },
  {
    stage: 'Stage four is neurological decline at the chronic end of the spectrum',
    bg: 'bg-dios-aubergine',
    tag: 'Chronic glymphatic failure and dementia risk',
    headline: "Dementia risk grows when sleep architecture stops clearing toxic brain waste",
    body: 'Circadian sleep disruption blocks glymphatic clearance and tracks neurodegenerative onset in cohorts',
    dark: true,
  },
] as const

const SPECTRUM_MARKERS = [
  'Social jetlag starts when habits and biology diverge',
  'Shift-work disorder forces sleep against the clock',
  'Metabolic disease follows sustained insulin drift',
  'Cancer and dementia sit at the chronic end',
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
          title="Circadian dysfunction is a pathway to serious disease — not just tiredness"
          subtitle="Body clock disruption drives major illness across a spectrum from mild jetlag to cancer and dementia"
          className="mb-16 md:mb-20"
        />

        <div className="mb-16 md:mb-24">
          <div className="mb-3 flex justify-between dios-tag text-dios-muted">
            <span>Mild acute disruption</span>
            <span>Severe chronic pathology</span>
          </div>
          <div className="relative">
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
          <p className="dios-display text-[clamp(1.375rem,2.5vw,2rem)] leading-snug text-dios-aubergine">
            DIOS detects circadian disruption at stage one — before metabolic, cancer, or neurological pathology — and informs the prescribing decision without prescribing or dosing
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
