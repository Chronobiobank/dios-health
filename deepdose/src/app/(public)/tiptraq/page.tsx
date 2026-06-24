import type { Metadata } from 'next'
import Link from 'next/link'

import { MarketingPhotoStepTile } from '@/components/deepdose/MarketingPhotoStepTile'
import {
  TIPTRAQ_GUIDE_STEPS,
  TIPTRAQ_PAGE_CTA,
  TIPTRAQ_PAGE_INTRO,
  TIPTRAQ_PAGE_META,
} from '@/lib/deepdose-marketing/tiptraq-content'
import { marketingCtaClass } from '@/lib/design/marketing-system'

export const metadata: Metadata = {
  title: TIPTRAQ_PAGE_META.title,
  description: TIPTRAQ_PAGE_META.description,
}

export default function TipTraqGuidePage() {
  return (
    <article className="seco-page seco-tiptraq seco-marketing-page">
      <div className="seco-landing__section-inner">
        <header className="seco-tiptraq__intro seco-reveal seco-reveal--1">
          <p className="seco-page__eyebrow">{TIPTRAQ_PAGE_INTRO.eyebrow}</p>
          <h1 className="seco-page__title seco-tiptraq__title">
            <span className="seco-landing__hero-line seco-landing__hero-line--white">
              {TIPTRAQ_PAGE_INTRO.titleWhite}
            </span>
            <span className="seco-landing__hero-line seco-landing__hero-spectrum">
              {TIPTRAQ_PAGE_INTRO.titleAccent}
            </span>
          </h1>
          <p className="seco-page__lede seco-tiptraq__lede">{TIPTRAQ_PAGE_INTRO.lede}</p>
        </header>

        <ol className="seco-tiptraq__tiles">
          {TIPTRAQ_GUIDE_STEPS.map((step, index) => (
            <li
              key={step.id}
              className={`seco-tiptraq__tile seco-reveal seco-reveal--${Math.min(index + 2, 6)}`}
            >
              <MarketingPhotoStepTile
                rank={step.rank}
                cue={step.cue}
                title={step.title}
                body={step.body}
                image={{ src: step.image, alt: step.alt }}
                copySide={step.copySide}
                copyValign={step.copyValign}
                imagePosition={step.imagePosition}
              />
            </li>
          ))}
        </ol>

        <div className={marketingCtaClass('seco-tiptraq__cta seco-reveal seco-reveal--7')}>
          <Link href={TIPTRAQ_PAGE_CTA.href} className="seco-landing__btn seco-landing__btn--primary">
            {TIPTRAQ_PAGE_CTA.label} →
          </Link>
        </div>
      </div>
    </article>
  )
}
