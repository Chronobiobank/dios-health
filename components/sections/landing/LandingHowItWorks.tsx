import { BODY, CARD, LANDING_COLUMN, SECTION, SECTION_TITLE } from '@/components/sections/layout'

import { GeometricBg } from './GeometricBg'

const STEPS = [
  {
    step: '1',
    title: 'Wear TipTraQ for three nights.',
    body: 'Your body clock is measured while you sleep.',
  },
  {
    step: '2',
    title: 'DIʘS calculates your personal DLMO',
    body: '— the moment your biology shifts into night mode.',
  },
  {
    step: '3',
    title: 'You get exact timing windows for each of your medications.',
    body: 'And reminders to match.',
  },
] as const

export function LandingHowItWorks() {
  return (
    <section id="how-it-works" className={`${SECTION} relative ${'bg-[#F9F9F9]'}`}>
      <GeometricBg variant="muted" />
      <div className={`${LANDING_COLUMN} relative`}>
        <h2 className={`${SECTION_TITLE} max-w-lg`}>Three steps to your personal dose window.</h2>

        <ol className="mt-10 space-y-4">
          {STEPS.map((item) => (
            <li key={item.step} className={`${CARD} relative rounded-2xl p-5 sm:p-6`}>
              <span className="font-mono text-xs uppercase tracking-widest text-black/40">
                Step {item.step}
              </span>
              <p className="type-tile-title mt-3">{item.title}</p>
              <p className={`${BODY} mt-2 text-black/65`}>{item.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
