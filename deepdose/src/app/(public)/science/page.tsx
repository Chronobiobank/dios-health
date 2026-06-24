import type { Metadata } from 'next'

import { ScienceTrustSections } from '@/components/deepdose/marketing/ScienceTrustSections'
import { SCIENCE_TRUST_INTRO, SCIENCE_TRUST_META } from '@/lib/deepdose-marketing/science-trust-content'

export const metadata: Metadata = {
  title: SCIENCE_TRUST_META.title,
  description: SCIENCE_TRUST_META.description,
}

export default function SciencePage() {
  return (
    <article className="seco-page seco-science">
      <div className="seco-landing__section-inner">
        <header className="seco-reveal seco-reveal--1">
          <p className="seco-page__eyebrow">{SCIENCE_TRUST_INTRO.eyebrow}</p>
          <h1 className="seco-page__title">{SCIENCE_TRUST_INTRO.title}</h1>
          <p className="seco-page__lede">{SCIENCE_TRUST_INTRO.lede}</p>
        </header>
        <ScienceTrustSections />
      </div>
    </article>
  )
}
