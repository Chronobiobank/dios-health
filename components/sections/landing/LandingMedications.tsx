import { BODY, CARD, LANDING_COLUMN, SECTION, SECTION_TITLE } from '@/components/sections/layout'

import { GeometricBg } from './GeometricBg'

const MEDICATIONS = [
  {
    name: 'Simvastatin',
    standard: 'Usually taken at night',
    dios: 'Your window: 11:52pm',
    why: 'Cholesterol synthesis peaks overnight — an evening dose lands when your liver is ready to use it.',
  },
  {
    name: 'Ramipril',
    standard: 'Usually taken in the morning',
    dios: 'Your window: 8:52pm',
    why: 'Blood pressure dipping matters at night — bedtime dosing matches the window trials proved for non-dippers.',
  },
  {
    name: 'Prednisolone',
    standard: 'Usually taken in the morning',
    dios: 'Your window: 2:52am',
    why: 'Inflammatory peaks hit before you wake — a pre-dawn dose arrives before symptoms do.',
  },
  {
    name: 'Salmeterol',
    standard: 'Usually taken twice daily',
    dios: 'Your window: 12:52am',
    why: 'Airways narrow before dawn — an evening dose covers the bronchospasm window your clock predicts.',
  },
] as const

export function LandingMedications() {
  return (
    <section className={`${SECTION} relative bg-white`}>
      <GeometricBg variant="light" />
      <div className={`${LANDING_COLUMN} relative`}>
        <h2 className={`${SECTION_TITLE} max-w-lg`}>
          Built for the medications people take every day.
        </h2>

        <div className="mt-10 -mx-5 flex gap-4 overflow-x-auto px-5 pb-2 snap-x snap-mandatory sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0 sm:pb-0">
          {MEDICATIONS.map((med) => (
            <article
              key={med.name}
              className={`${CARD} min-w-[min(100%,280px)] flex-shrink-0 snap-start rounded-2xl p-5 sm:min-w-0 sm:flex-shrink`}
            >
              <p className="font-mono text-[11px] uppercase tracking-[0.08em] text-black/40">
                {med.standard}
              </p>
              <h3 className="type-tile-title mt-3">{med.name}</h3>
              <p className="mt-3 font-mono text-sm font-medium text-teal-800">{med.dios}</p>
              <p className={`${BODY} mt-3 text-black/65`}>{med.why}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
