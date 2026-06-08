import Link from 'next/link'
import type { ReactNode } from 'react'

import { MarketingKawasakiHtml } from '@/components/sections/marketing/marketing-kawasaki-html'
import { MarketingSlideBackground } from '@/components/sections/marketing/marketing-slide-background'
import type { KawasakiSlideMedia } from '@/lib/pitch/marketing-landing-content'

export type MarketingKawasakiSectionProps = {
  id: string
  slideNum: string
  eyebrow: string
  headlineHtml: string
  support: string
  variant?: 'default' | 'dark' | 'teal' | 'bronze'
  media?: KawasakiSlideMedia
  link?: { label: string; href: string }
  children?: ReactNode
  headingLevel?: 'h1' | 'h2'
}

function variantClass(variant?: string) {
  if (variant === 'dark') return 'kz-s--dark'
  if (variant === 'teal') return 'kz-s--teal'
  if (variant === 'bronze') return 'kz-s--bronze'
  return ''
}

function mediaClass(media?: KawasakiSlideMedia) {
  if (!media) return ''
  const classes = ['kz-s--has-media']
  if (media.scrim === 'cta' || media.scrim === 'dark') {
    classes.push('kz-s--on-video')
  }
  if (media.extendsUnderNav) classes.push('kz-s--under-nav')
  return ` ${classes.join(' ')}`
}

export function MarketingKawasakiSection({
  id,
  slideNum,
  eyebrow,
  headlineHtml,
  support,
  variant,
  media,
  link,
  children,
  headingLevel = 'h2',
}: MarketingKawasakiSectionProps) {
  const Heading = headingLevel

  return (
    <section
      id={id}
      className={`kz-s ${variantClass(variant)}${mediaClass(media)}`}
      aria-labelledby={`${id}-heading`}
    >
      {media ? <MarketingSlideBackground media={media} /> : null}
      <div className="kz-s__content">
        <p className="kz-ey">{eyebrow}</p>
        <Heading id={`${id}-heading`} className="kz-h1">
          <MarketingKawasakiHtml html={headlineHtml} />
        </Heading>
        <p className="kz-sup">{support}</p>
        {children}
        {link ? (
          <Link href={link.href} className="kz-cta-btn kz-slide-link">
            {link.label}
          </Link>
        ) : null}
      </div>
      <div className="kz-num">{slideNum}</div>
    </section>
  )
}
