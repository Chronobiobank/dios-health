import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'

import {
  TIPTRAQ_GUIDE_STEPS,
  TIPTRAQ_PAGE_CTA,
  TIPTRAQ_PAGE_INTRO,
  TIPTRAQ_PAGE_META,
} from '@/lib/deepdose-marketing/tiptraq-content'
import { marketingCtaClass } from '@/lib/design/marketing-system'
import { cn } from '@/lib/utils/cn'

export const metadata: Metadata = {
  title: TIPTRAQ_PAGE_META.title,
  description: TIPTRAQ_PAGE_META.description,
  alternates: { canonical: '/tiptraq' },
}

export default function TipTraqGuidePage() {
  const title = `${TIPTRAQ_PAGE_INTRO.titleWhite} ${TIPTRAQ_PAGE_INTRO.titleAccent}`

  return (
    <article className="seco-page seco-homekit seco-tiptraq seco-marketing-page">
      <div className="seco-landing__section-inner">
        <header className="seco-homekit__intro seco-reveal seco-reveal--1">
          <h1 className="seco-page__title">
            <span className="seco-landing__hero-spectrum">{title}</span>
          </h1>
          <p className="seco-page__lede">{TIPTRAQ_PAGE_INTRO.lede}</p>
        </header>

        <ol className="seco-homekit__guide" aria-label="Homekit setup">
          {TIPTRAQ_GUIDE_STEPS.map((step, index) => (
            <li
              key={step.id}
              className={cn(
                'seco-homekit__guide-tile',
                'seco-reveal',
                `seco-reveal--${Math.min(index + 2, 7)}`,
                step.copySide === 'right' && 'seco-homekit__guide-tile--flip'
              )}
              style={{ ['--step-img-pos' as string]: step.imagePosition ?? 'center' }}
            >
              <figure className="seco-homekit__guide-media">
                <Image
                  src={step.image}
                  alt={step.alt}
                  fill
                  sizes="(min-width: 720px) 40vw, 100vw"
                  className="seco-homekit__guide-img"
                />
              </figure>
              <div className="seco-homekit__guide-copy">
                <p className="seco-homekit__guide-rank">Step {step.rank}</p>
                <h2 className="seco-homekit__guide-title">{step.title}</h2>
                <p className="seco-homekit__guide-body">{step.body}</p>
              </div>
            </li>
          ))}
        </ol>

        <div className={marketingCtaClass('seco-homekit__cta seco-reveal seco-reveal--7')}>
          <Link href={TIPTRAQ_PAGE_CTA.href} className="seco-landing__btn seco-landing__btn--primary">
            {TIPTRAQ_PAGE_CTA.label} →
          </Link>
        </div>
      </div>
    </article>
  )
}
