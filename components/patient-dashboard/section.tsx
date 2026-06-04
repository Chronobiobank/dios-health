import type { ReactNode } from 'react'

type SectionProps = {
  label: string
  children: ReactNode
}

export function Section({ label, children }: SectionProps) {
  return (
    <section className="space-y-3">
      <h2 className="text-[11px] font-medium uppercase tracking-widest text-[var(--researcher-avatar-text)]">
        {label}
      </h2>
      {children}
    </section>
  )
}

export function TileGrid({ children }: { children: ReactNode }) {
  return <div className="grid grid-cols-2 gap-3">{children}</div>
}
