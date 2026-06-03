import { HashLink } from '@/components/sections/HashLink'
import { Card, CardContent, CardHeader } from '@/components/ui/card'

import {
  BODY,
  CARD,
  CONTAINER,
  LIST_LINE,
  SECTION,
  SECTION_ALT,
  SECTION_TITLE,
  TILE_BODY,
  TILE_CARD,
  TILE_GRID,
  TILE_HEADER,
  BTN_HERO,
} from './layout'
import { SectionLabel } from './SectionLabel'

const GOLD_STANDARD = [
  'Melanopic Lux phase time (MLux) is the moment melatonin begins rising in the evening — the most reliable circadian biomarker in clinical research.',
  'Traditional MLux phase time requires hourly saliva samples under dim light over 6-8 hours. Clinically impractical at scale.',
  'DIOS derives a MLux phase time passively — from sleep architecture, autonomic data, and smartphone sensors. No saliva sample required.',
  'Every personalised output in DIOS — medication windows, supplement timing, zeitgeber cues — is driven by MLux phase time.',
] as const

const LAYERS = [
  {
    id: 'tiptraq',
    title: 'Layer 1 TipTraQ',
    body: 'FDA 510(k)-cleared clinical-grade home monitoring. Sleep onset, REM latency, ANS balance, AHI, SpO₂. Confidence: 38% night one to 94% night seven.',
  },
  {
    id: 'bloods',
    title: 'Layer 2 Bloods',
    body: 'Gominak panel — D3, B12, ferritin, B5. Metabolic substrate of the circadian system. D3 target: 150-200 nmol/L. Confidence: up to 75%.',
  },
  {
    id: 'smartphone',
    title: 'Layer 3 Smartphone',
    body: 'Sleep timing. Morning light. Solar zenith for VDR activation. Fitzpatrick skin calibration. Confidence: up to 60%.',
  },
] as const

const CALCULATION_STEPS = [
  'Sleep onset anchor: MLux phase time typically occurs 2 hours before sleep onset.',
  'REM latency correction: Delayed REM beyond 85 minutes shifts MLux phase time estimate later by 0.25 minutes per minute of delay.',
  'ANS correction: Low parasympathetic activity at sleep onset indicates melatonin has not fully risen.',
  'AHI modifier: Apnea events above AHI 15 reduce confidence score — sympathetic activation suppresses the PNS signal.',
  'Rolling average: Each additional night narrows the confidence band.',
] as const

const CONFIDENCE_STATS = [
  { night: 'Night 1', score: '38%', band: '±75 min', label: 'Starting estimate' },
  { night: 'Night 2', score: '65%', band: '±45 min', label: 'Direction confirmed' },
  { night: 'Night 3', score: '84%', band: '±20 min', label: 'Clinically actionable' },
  { night: 'Night 7', score: '94%', band: '±12 min', label: 'Sleep lab equivalent' },
] as const

const VDR_STATEMENTS = [
  'VDR response elements are present on CLOCK and BMAL1 genes — the master regulators of circadian rhythm.',
  'Low D3 below 150 nmol/L dampens circadian amplitude, fragments sleep, and reduces medication efficacy.',
  'The Gominak protocol targets D3 at 150-200 nmol/L. The Coimbra protocol uses supervised high-dose D3 at 200-400 nmol/L for autoimmune conditions.',
] as const

const MEDICATIONS = [
  { name: 'Atorvastatin', standard: 'Take at night', dios: '3h after MLux phase' },
  { name: 'Ramipril', standard: 'Take in morning', dios: '1h after MLux phase' },
  { name: 'Amlodipine', standard: 'Take at night', dios: '2h after MLux phase' },
  { name: 'Sertraline', standard: 'Take in morning', dios: '6h after MLux phase' },
  { name: 'Metformin', standard: 'Take with meals', dios: 'First meal post-MLux phase +9h' },
  { name: 'Prednisolone', standard: 'Take in morning', dios: '6h after MLux phase' },
  { name: 'Salmeterol', standard: 'Take at night', dios: '4h after MLux phase' },
  { name: 'Levothyroxine', standard: 'Take in morning fasting', dios: '5h after MLux phase' },
] as const

const REFERENCES = [
  'Smolensky MH, Peppas NA. Chronobiology, drug delivery, and chronotherapeutics. Advanced Drug Delivery Reviews 2007.',
  'Gominak SC, Stumpf WE. The world epidemic of sleep disorders is linked to vitamin D deficiency. Medical Hypotheses 2012.',
  'Coimbra JG et al. High-dose vitamin D3 in autoimmune disease. CNS Drugs 2014.',
  'Huang W et al. Circadian clock-controlled hematopoiesis. Frontiers in Immunology 2021.',
  'Burgess HJ et al. Sleep and circadian influences on the human immune response. Chronobiology International 2019.',
  'Archer SN et al. Per3 polymorphism linked to delayed sleep phase syndrome. Sleep 2003.',
  'Kim JK et al. Wearable technology and systems modeling for personalized chronotherapy. Current Opinion in Systems Biology 2020.',
] as const

function StatementList({ items }: { items: readonly string[] }) {
  return (
    <ul className="mt-8 max-w-3xl space-y-4">
      {items.map((line) => (
        <li key={line} className={LIST_LINE}>
          {line}
        </li>
      ))}
    </ul>
  )
}

export function TipTraqScience() {
  return (
    <>
      <section className="bg-black py-14 text-white sm:py-20 lg:py-24">
        <div className={CONTAINER}>
          <SectionLabel title="Technology" light />
          <h1 className="type-hero-overlay mt-4 max-w-3xl text-white">
            How DIOS reads your body clock.
          </h1>
          <p className="type-hero-meta mt-6 max-w-2xl text-white/85">
            TipTraQ clinical monitoring, blood panels, then smartphone sensors — one MLux phase reading.
          </p>
          <HashLink href="/contact?intent=clinical-briefing" className={`${BTN_HERO} mt-8`}>
            Book a clinical demo →
          </HashLink>
        </div>
      </section>

      <section className={`${SECTION} ${CONTAINER}`}>
        <SectionLabel title="The gold standard" />
        <h2 className={`${SECTION_TITLE} mt-4 max-w-3xl`}>
          MLux phase time is the most accurate measure of your body clock.
        </h2>
        <StatementList items={GOLD_STANDARD} />
      </section>

      <section className={`${SECTION} ${SECTION_ALT}`}>
        <div className={CONTAINER}>
          <SectionLabel title="The DIOS method" />
          <h2 className={`${SECTION_TITLE} mt-4 max-w-3xl`}>
            Clinical grade first — three layers, one body clock reading.
          </h2>
          <div className="mt-10 grid grid-cols-1 gap-4 lg:grid-cols-3">
            {LAYERS.map((layer) => (
              <Card key={layer.id} className={TILE_CARD}>
                <CardHeader className={TILE_HEADER}>
                  <p className="type-tile-title">{layer.title}</p>
                </CardHeader>
                <CardContent className={TILE_BODY}>
                  <p className={BODY}>{layer.body}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className={`${SECTION} ${CONTAINER}`}>
        <SectionLabel title="The calculation" />
        <h2 className={`${SECTION_TITLE} mt-4 max-w-3xl`}>How MLux phase time is calculated.</h2>
        <ol className="mt-8 max-w-3xl space-y-4">
          {CALCULATION_STEPS.map((step, index) => (
            <li key={step} className="flex gap-4">
              <span className="font-mono text-sm font-semibold tabular-nums text-black/40">
                {index + 1}.
              </span>
              <span className={LIST_LINE}>{step}</span>
            </li>
          ))}
        </ol>
      </section>

      <section className={`${SECTION} ${SECTION_ALT}`}>
        <div className={CONTAINER}>
          <SectionLabel title="Confidence builds nightly" />
          <h2 className={`${SECTION_TITLE} mt-4 max-w-3xl`}>More nights. More precision.</h2>
          <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {CONFIDENCE_STATS.map((stat) => (
              <Card key={stat.night} className={`${CARD} gap-0 py-0`}>
                <CardHeader className="gap-2 px-6 pt-6">
                  <p className="font-mono text-xs uppercase tracking-widest text-black/50">
                    {stat.night}
                  </p>
                  <p className="type-tile-title">{stat.score}</p>
                  <p className="font-mono text-lg font-semibold tabular-nums text-black">
                    {stat.band}
                  </p>
                </CardHeader>
                <CardContent className="px-6 pb-6">
                  <p className="type-caption">{stat.label}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className={`${SECTION} ${CONTAINER}`}>
        <SectionLabel title="The VDR connection" />
        <h2 className={`${SECTION_TITLE} mt-4 max-w-3xl`}>Vitamin D is not just for bones.</h2>
        <StatementList items={VDR_STATEMENTS} />
      </section>

      <section className={`${SECTION} ${SECTION_ALT}`}>
        <div className={CONTAINER}>
          <SectionLabel title="The medication evidence" />
          <h2 className={`${SECTION_TITLE} mt-4 max-w-3xl`}>
            Eight medications. Published timing evidence.
          </h2>
          <div className={`${TILE_GRID} lg:grid-cols-4`}>
            {MEDICATIONS.map((med) => (
              <Card key={med.name} className={TILE_CARD}>
                <CardHeader className={TILE_HEADER}>
                  <p className="type-tile-title">{med.name}</p>
                </CardHeader>
                <CardContent className={`${TILE_BODY} space-y-2`}>
                  <p className="type-caption text-black/55">Standard: {med.standard}</p>
                  <p className={`${BODY} font-medium text-black`}>DIOS: {med.dios}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className={`${SECTION} ${CONTAINER}`}>
        <SectionLabel title="References" />
        <h2 className={`${SECTION_TITLE} mt-4 max-w-3xl`}>Key peer-reviewed sources.</h2>
        <ul className="mt-8 max-w-3xl space-y-3">
          {REFERENCES.map((ref) => (
            <li key={ref} className={`${BODY} text-black/70`}>
              {ref}
            </li>
          ))}
        </ul>
      </section>
    </>
  )
}

/** DIOS three-layer measurement stack (formerly bundled under TipTraQ route) */
export const DiosTechnology = TipTraqScience
