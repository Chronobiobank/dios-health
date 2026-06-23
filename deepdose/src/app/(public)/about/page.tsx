import Link from 'next/link'

import { AboutFounderSection } from '@/components/deepdose/AboutFounderSection'
import { DEEPDOSE_NAME } from '@/lib/brand/deepdose-brand'

export default function AboutPage() {
  return (
    <article className="seco-page seco-about">
      <div className="seco-landing__section-inner">
        <p className="seco-page__eyebrow">About {DEEPDOSE_NAME}</p>
        <h1 className="seco-page__title">Built around your clock</h1>
        <p className="seco-page__lede">
          {DEEPDOSE_NAME} helps you take everyday care at the right time of day. Most advice tells
          you what to take, not when your body is ready to use it. We find the best time of day for
          the habits that set your body clock, and your clinician stays in the loop when it matters.
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
