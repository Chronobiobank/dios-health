import { CONTAINER } from './layout'

const PLATFORM_STATS = [
  { value: 'Free', label: 'for every patient — always' },
  { value: 'Oxford', label: 'validated chronodosing science' },
  { value: 'MSFsc', label: 'wearable-derived chronotype' },
  { value: '0', label: 'insurer data access — by design' },
] as const

export function StatsBar() {
  return (
    <div className="bg-[#FAFAFA] pb-16 sm:pb-20">
      <div className={CONTAINER}>
        <dl className="mt-12 grid grid-cols-2 gap-8 border-t border-black/10 pt-12 sm:grid-cols-4">
          {PLATFORM_STATS.map((stat) => (
            <div key={stat.label} className="text-center sm:text-left">
              <dt className="type-mono text-2xl text-black sm:text-3xl">{stat.value}</dt>
              <dd className="type-label mt-2">{stat.label}</dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  )
}
