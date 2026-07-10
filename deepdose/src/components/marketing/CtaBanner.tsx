import Link from 'next/link'
import { Container } from '@/components/ui/Layout'
import { marketingImages } from '@/lib/marketing/images'
import { BackgroundSection } from '@/components/marketing/LifestyleImagery'

export function CtaBanner() {
  return (
    <BackgroundSection image={marketingImages.cta} overlay="dark" minHeight="min-h-[24rem]">
      <Container className="w-full text-center">
        <p className="text-xs font-semibold uppercase tracking-widest text-white/70">
          Get started
        </p>
        <h2 className="mt-3 font-display text-3xl tracking-tight text-white md:text-5xl">
          Your biology. Your data. Your timing.
        </h2>
        <p className="mx-auto mt-4 max-w-lg text-white/80">
          Join Deepdose and align your medication schedule with your circadian rhythm.
        </p>
        <div className="mt-8">
          <Link href="/" className="seco-landing__btn seco-landing__btn--primary">
            Get started
          </Link>
        </div>
      </Container>
    </BackgroundSection>
  )
}
