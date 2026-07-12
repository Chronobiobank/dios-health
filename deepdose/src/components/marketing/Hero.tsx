import { Button } from '@/components/ui/Button'
import { Container, Eyebrow } from '@/components/ui/Layout'
import { marketingImages } from '@/lib/marketing/images'
import { LifestyleImage } from '@/components/marketing/LifestyleImagery'

export function Hero() {
  return (
    <Container>
      <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
        <div className="motion-safe-fade order-2 lg:order-1">
          <Eyebrow>Precision chronotherapy</Eyebrow>
          <h1 className="mt-4 font-display text-4xl leading-[1.08] tracking-tight text-ink sm:text-5xl lg:text-[3.5rem]">
            Take your medication at the right biological time
          </h1>
          <p className="mt-6 max-w-lg text-lg leading-relaxed text-ink-muted">
            Deepdose maps your circadian rhythm to evidence-based dosing windows — so you and
            your clinician know when each medication works best for your body.
          </p>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <Button href="/">Start onboarding</Button>
            <Button href="/how" variant="secondary">
              Why Deepdose?
            </Button>
          </div>
          <p className="mt-8 text-xs text-ink-faint">
            Patient-owned data · NHS-ready consent · 8 BNF-aligned medications
          </p>
        </div>

        <div className="motion-safe-fade order-1 lg:order-2">
          <LifestyleImage image={marketingImages.hero} priority aspect="aspect-[5/6] lg:aspect-[4/5]" />
        </div>
      </div>
    </Container>
  )
}
