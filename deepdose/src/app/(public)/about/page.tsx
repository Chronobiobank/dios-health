import Link from 'next/link'

import { AboutFounderSection } from '@/components/deepdose/AboutFounderSection'
import { DEEPDOSE_NAME } from '@/lib/brand/deepdose-brand'

export default function AboutPage() {
  return (
    <article className="seco-page seco-about">
      <div className="seco-landing__section-inner">
        <p className="seco-page__eyebrow">About {DEEPDOSE_NAME}</p>
        <h1 className="seco-page__title seco-about__title">
          <span className="seco-landing__hero-line seco-landing__hero-line--white">Optimised</span>
          <span className="seco-landing__hero-line seco-landing__hero-spectrum">
            precision dosing
          </span>
        </h1>
        <p className="seco-page__lede">
          Timing changes how medicines feel — in your body, in clinic, and in the products we build.{' '}
          {DEEPDOSE_NAME} exists so that moment is not left to chance.
        </p>

        <AboutFounderSection />

        <div className="seco-about__actions seco-reveal seco-reveal--3">
          <Link href="/patient-landing" className="seco-landing__btn seco-landing__btn--primary">
            See how it works →
          </Link>
        </div>
      </div>
    </article>
  )
}
