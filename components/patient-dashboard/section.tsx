import type { ReactNode } from 'react'

type SectionProps = {
  label: string
  children: ReactNode
}

export function Section({ label, children }: SectionProps) {
  return (
    <section className="dash-dashboard-section">
      <h2 className="dashboard-section-label">{label}</h2>
      {children}
    </section>
  )
}

export function TileGrid({ children }: { children: ReactNode }) {
  return <div className="dash-tile-grid">{children}</div>
}
