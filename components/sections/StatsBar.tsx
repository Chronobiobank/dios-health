import { CONTAINER } from './layout'

const STATS = [
  { value: '£500M', label: 'avoidable NHS admissions annually' },
  { value: '73M', label: 'atorvastatin prescriptions last year' },
  { value: '40%', label: 'efficacy gain from optimal timing' },
] as const

export function StatsBar() {
  return (
    <section className="bg-black pb-14 text-white sm:pb-20" aria-label="Key statistics">
      <div className={CONTAINER}>
        <dl className="grid grid-cols-1 gap-8 border-t border-white/15 pt-10 sm:grid-cols-3 sm:gap-6">
          {STATS.map((stat) => (
            <div key={stat.label} className="text-center sm:text-left">
              <dt className="type-mono text-2xl text-white sm:text-3xl">{stat.value}</dt>
              <dd className="type-label mt-2 text-white/60">{stat.label}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}
