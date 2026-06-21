import { Container, Card, Eyebrow } from '@/components/ui/Layout'
import { marketingImages } from '@/lib/marketing/images'
import { BackgroundSection, LifestyleImage } from '@/components/marketing/LifestyleImagery'

const STEPS = [
  {
    num: '01',
    title: 'Grant consent',
    body: 'Dynamic consent framework — you control how your chronobiology data is used for care, research, and population analytics.',
  },
  {
    num: '02',
    title: 'Map your rhythm',
    body: 'We use the Munich Chronotype Questionnaire (MCTQ) to estimate your circadian phase.',
  },
  {
    num: '03',
    title: 'Personalise dosing',
    body: 'Select your medications and see phase-adjusted windows — when to take each drug for maximum effect.',
  },
]

export function StepsSection() {
  return (
    <>
      {/* Lifestyle band — visual break between hero and steps (Function-style contrast) */}
      <BackgroundSection
        image={marketingImages.wellness}
        overlay="light"
        minHeight="min-h-[20rem]"
        className="mb-12 md:mb-16"
      >
        <Container className="w-full">
          <p className="max-w-md font-display text-2xl leading-snug text-ink md:text-3xl">
            Health isn&apos;t static. Your dosing shouldn&apos;t be either.
          </p>
        </Container>
      </BackgroundSection>

      <Container>
        <div className="grid gap-12 lg:grid-cols-5 lg:items-start">
          <div className="lg:sticky lg:top-24 lg:col-span-2">
            <LifestyleImage image={marketingImages.medication} aspect="aspect-[3/4]" />
          </div>
          <div className="lg:col-span-3">
            <div className="max-w-xl">
              <Eyebrow>How it works</Eyebrow>
              <h2 className="mt-3 font-display text-3xl tracking-tight text-ink md:text-4xl">
                Onboarding is easy
              </h2>
            </div>
            <div className="mt-10 grid gap-6">
              {STEPS.map((step) => (
                <Card key={step.num} className="motion-safe-fade">
                  <p className="font-display text-4xl text-accent/30">{step.num}</p>
                  <h3 className="mt-4 text-lg font-semibold text-ink">{step.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-muted">{step.body}</p>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </>
  )
}
