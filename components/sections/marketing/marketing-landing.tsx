import Link from 'next/link'

import { DIOS_BRAND_NAME, DIOS_LOGO_GLYPH, DIOS_LOGO_MARK } from '@/components/DiosLogo'
import { MarketingFontScope } from '@/components/sections/marketing/marketing-font-scope'
import { MarketingKawasakiProgress } from '@/components/sections/marketing/marketing-kawasaki-progress'
import { MarketingSlideBackground } from '@/components/sections/marketing/marketing-slide-background'
import {
  KAWASAKI_CTA_SECTION,
  KAWASAKI_FOOTER,
  KAWASAKI_NAV,
  KAWASAKI_STORY_SLIDES,
} from '@/lib/pitch/marketing-landing-content'

function HtmlText({ html }: { html: string }) {
  return <span dangerouslySetInnerHTML={{ __html: html }} />
}

const KAWASAKI_SECTION_IDS = [
  ...KAWASAKI_STORY_SLIDES.map((s) => s.id),
  KAWASAKI_CTA_SECTION.id,
] as const

function slideVariantClass(variant?: string) {
  if (variant === 'dark') return 'kz-s--dark'
  if (variant === 'teal') return 'kz-s--teal'
  return ''
}

function slideMediaClass(media?: (typeof KAWASAKI_STORY_SLIDES)[number]['media']) {
  if (!media) return ''
  const classes = ['kz-s--has-media']
  if (media.scrim === 'cta' || media.scrim === 'dark') {
    classes.push('kz-s--on-video')
  }
  if (media.extendsUnderNav) classes.push('kz-s--under-nav')
  return ` ${classes.join(' ')}`
}

export function MarketingLanding() {
  return (
    <MarketingFontScope>
      <nav className="kz-nav" aria-label="Site">
        <Link
          href="/"
          className="kz-nav-logo dios-wordmark"
          aria-label={`${DIOS_BRAND_NAME} — home`}
        >
          {DIOS_LOGO_MARK}
        </Link>
        <ul className="kz-nav-links">
          {KAWASAKI_NAV.links.map((link) => (
            <li key={link.label}>
              <Link href={link.href}>{link.label}</Link>
            </li>
          ))}
        </ul>
        <Link href={KAWASAKI_NAV.cta.href} className="kz-nav-cta">
          {KAWASAKI_NAV.cta.label}
        </Link>
      </nav>

      <MarketingKawasakiProgress sectionIds={KAWASAKI_SECTION_IDS} />

      {KAWASAKI_STORY_SLIDES.map((slide) => (
        <section
          key={slide.id}
          id={slide.id}
          className={`kz-s ${slideVariantClass(slide.variant)}${slideMediaClass(slide.media)}`}
          aria-labelledby={`${slide.id}-heading`}
        >
          {slide.media ? (
            <MarketingSlideBackground media={slide.media} />
          ) : null}
          <div className="kz-s__content">
            <p className="kz-ey">{slide.eyebrow}</p>
            <h1 id={`${slide.id}-heading`} className="kz-h1">
              <HtmlText html={slide.headlineHtml} />
            </h1>
            <p className="kz-sup">{slide.support}</p>
            {slide.link ? (
              <Link href={slide.link.href} className="kz-btn-t kz-slide-link">
                {slide.link.label}
              </Link>
            ) : null}
          </div>
          <div className="kz-num">{slide.slideNum}</div>
        </section>
      ))}

      <section
        id={KAWASAKI_CTA_SECTION.id}
        className="kz-s kz-s--dark kz-s--has-media kz-s--on-video"
        aria-labelledby={`${KAWASAKI_CTA_SECTION.id}-heading`}
      >
        {KAWASAKI_CTA_SECTION.media ? (
          <MarketingSlideBackground media={KAWASAKI_CTA_SECTION.media} />
        ) : null}
        <div className="kz-s__content">
          <p className="kz-ey">{KAWASAKI_CTA_SECTION.eyebrow}</p>
          <h1 id={`${KAWASAKI_CTA_SECTION.id}-heading`} className="kz-h1">
            <HtmlText html={KAWASAKI_CTA_SECTION.headlineHtml} />
          </h1>
          <div className="kz-cta-stack">
          <Link href={KAWASAKI_CTA_SECTION.ctas.primary.href} className="kz-btn-p">
            {KAWASAKI_CTA_SECTION.ctas.primary.label}
          </Link>
          <Link href={KAWASAKI_CTA_SECTION.ctas.secondary.href} className="kz-btn-s">
            {KAWASAKI_CTA_SECTION.ctas.secondary.label}
          </Link>
          <Link href={KAWASAKI_CTA_SECTION.ctas.tertiary.href} className="kz-btn-t">
            {KAWASAKI_CTA_SECTION.ctas.tertiary.label}
          </Link>
          </div>
        </div>
        <div className="kz-num">{KAWASAKI_CTA_SECTION.slideNum}</div>
      </section>

      <footer className="kz-footer">
        <div className="kz-footer__main">
          <div className="kz-footer__brand">
            <span className="kz-f-glyph dios-wordmark" aria-hidden>
              {DIOS_LOGO_GLYPH}
            </span>
            <p className="kz-f-descriptor">{KAWASAKI_FOOTER.descriptor}</p>
          </div>
          <nav className="kz-footer__nav" aria-label="Site">
            <ul className="kz-f-links">
              {KAWASAKI_FOOTER.links.map((link) => (
                <li key={link.label}>
                  <Link href={link.href}>{link.label}</Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
        <div className="kz-footer__bar">
          <p className="kz-footer__copy">
            © {KAWASAKI_FOOTER.copyrightYear} {DIOS_BRAND_NAME}
          </p>
          <p className="kz-footer__tagline">{KAWASAKI_FOOTER.tagline}</p>
        </div>
      </footer>
    </MarketingFontScope>
  )
}
