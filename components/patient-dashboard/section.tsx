import type { ReactNode } from 'react'

type SectionProps = {
  label: string
  children: ReactNode
}

export function Section({ label, children }: SectionProps) {
  return (
    <section className="space-y-3.5">
      <h2 className="dashboard-section-label">{label}</h2>
      {children}
    </section>
  )
}

export function TileGrid({ children }: { children: ReactNode }) {
  return <div className="grid grid-cols-2 gap-3.5">{children}</div>
}
