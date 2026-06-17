import { Container, Card } from '@/components/ui/Layout'

const ROWS = [
  { feature: 'Personalised dosing windows', standard: false, deepdose: true },
  { feature: 'Circadian phase adjustment', standard: false, deepdose: true },
  { feature: 'Patient-owned consent', standard: false, deepdose: true },
  { feature: 'Chronotype assessment (MCTQ)', standard: false, deepdose: true },
  { feature: 'Fixed morning/evening labels', standard: true, deepdose: false },
]

function Cell({ value }: { value: boolean }) {
  return (
    <span className={value ? 'text-success font-medium' : 'text-ink-faint'}>
      {value ? '✓' : '—'}
    </span>
  )
}

export function ComparisonSection() {
  return (
    <Container>
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="font-display text-3xl tracking-tight text-ink md:text-4xl">
          Not your average pill reminder
        </h2>
        <p className="mt-3 text-ink-muted">
          Static alarms ignore your biology. Deepdose doesn&apos;t.
        </p>
      </div>
      <Card className="mt-10 overflow-hidden p-0">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-surface-muted">
              <th className="px-6 py-4 text-left font-medium text-ink-muted">Feature</th>
              <th className="px-6 py-4 text-center font-medium text-ink-muted">Standard app</th>
              <th className="px-6 py-4 text-center font-medium text-accent">Deepdose</th>
            </tr>
          </thead>
          <tbody>
            {ROWS.map((row) => (
              <tr key={row.feature} className="border-b border-border last:border-0">
                <td className="px-6 py-4 text-ink">{row.feature}</td>
                <td className="px-6 py-4 text-center"><Cell value={row.standard} /></td>
                <td className="px-6 py-4 text-center"><Cell value={row.deepdose} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </Container>
  )
}
