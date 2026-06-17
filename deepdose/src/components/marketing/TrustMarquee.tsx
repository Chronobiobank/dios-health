const ITEMS = [
  'Atorvastatin', 'Ramipril', 'Metformin', 'Aspirin', 'Prednisolone',
  'Amlodipine', 'Warfarin', 'Alendronate', 'Social jet lag', 'DLMO',
  'Chronotype', 'Circadian score', 'Hygia trial', 'Phase offset',
]

export function TrustMarquee() {
  const doubled = [...ITEMS, ...ITEMS]

  return (
    <div className="overflow-hidden border-y border-border bg-surface py-4">
      <div className="animate-marquee flex w-max gap-8">
        {doubled.map((item, i) => (
          <span
            key={`${item}-${i}`}
            className="shrink-0 text-sm font-medium text-ink-muted"
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  )
}
