import { Container, Card, Eyebrow } from '@/components/ui/Layout'
import { marketingImages } from '@/lib/marketing/images'
import { LifestyleImage } from '@/components/marketing/LifestyleImagery'

const STATS = [
  { value: '8', label: 'Chronotherapy medications', sub: 'BNF-aligned evidence grades' },
  { value: '100', label: 'Point CHI', sub: 'Phase · jet lag · data quality' },
  { value: '4', label: 'Consent purposes', sub: 'Granular patient control' },
]

const QUOTE = {
  text: 'Bedtime dosing of antihypertensives provides superior cardiovascular outcomes versus morning dosing in the Hygia chronotherapy trial.',
  author: 'Hermida et al.',
  role: 'European Heart Journal, 2020',
}

export function TrustSection() {
  return (
    <Container>
      <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
        <div>
          <Eyebrow>Clinical evidence</Eyebrow>
          <h2 className="mt-3 font-display text-3xl tracking-tight text-ink md:text-4xl">
            Gold standard for timing, not just testing
          </h2>
          <p className="mt-4 leading-relaxed text-ink-muted">
            Standard care tells you what to take. Deepdose tells you when — grounded in
            chronopharmacology research and adjusted for your individual circadian phase.
          </p>
          <div className="mt-10 grid grid-cols-3 gap-6">
            {STATS.map((s) => (
              <div key={s.label}>
                <p className="font-display text-3xl text-accent md:text-4xl">{s.value}</p>
                <p className="mt-1 text-sm font-medium text-ink">{s.label}</p>
                <p className="text-xs text-ink-faint">{s.sub}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <LifestyleImage image={marketingImages.sleep} aspect="aspect-[16/10]" />
          <Card className="border-accent/10 bg-accent-light/50">
            <blockquote className="font-display text-xl leading-snug text-ink">
              &ldquo;{QUOTE.text}&rdquo;
            </blockquote>
            <footer className="mt-6 border-t border-accent/10 pt-4">
              <p className="text-sm font-semibold text-ink">{QUOTE.author}</p>
              <p className="text-xs text-ink-muted">{QUOTE.role}</p>
            </footer>
          </Card>
        </div>
      </div>
    </Container>
  )
}
