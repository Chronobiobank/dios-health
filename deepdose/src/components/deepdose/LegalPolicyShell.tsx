import Link from 'next/link'
import type { CSSProperties, ReactNode } from 'react'

import { SpectrumTile } from '@/components/deepdose/SpectrumTile'
import { marketingTilesClass } from '@/lib/design/marketing-system'
import { cn } from '@/lib/utils/cn'

export type LegalPolicySection = {
  heading: string
  body: string
  cue?: string
}

export type LegalPolicyLink = {
  href: string
  label: string
  cue?: string
}

const SECTION_CUES = ['#acd3de', '#c9b6f2', '#f2b8a2', '#8b9cf8', '#a8d5c0', '#e8c4a8'] as const

type LegalPolicyShellProps = {
  /** Single-line spectrum head — same pattern as Connect / Chat. */
  title: string
  /** Only when the head cannot carry the meaning alone. */
  lede?: string
  meta?: string
  body?: string
  sections?: readonly LegalPolicySection[]
  links?: readonly LegalPolicyLink[]
  footer?: ReactNode
  children?: ReactNode
  className?: string
}

/** Policy pages on the marketing design system — dense, no waffle. */
export function LegalPolicyShell({
  title,
  lede,
  meta,
  body,
  sections,
  links,
  footer,
  children,
  className,
}: LegalPolicyShellProps) {
  return (
    <article className={cn('seco-page seco-marketing-page seco-legal', className)}>
      <div className="seco-landing__section-inner">
        <header className="seco-legal__intro seco-reveal seco-reveal--1">
          <h1 className="seco-page__title seco-legal__title">
            <span className="seco-landing__hero-spectrum">{title}</span>
          </h1>
          {lede ? <p className="seco-page__lede seco-legal__lede">{lede}</p> : null}
          {meta ? <p className="seco-legal__meta">{meta}</p> : null}
        </header>

        {body ? <p className="seco-legal__body seco-reveal seco-reveal--2">{body}</p> : null}

        {children}

        {sections && sections.length > 0 ? (
          <section
            className="seco-marketing-panel--tiles seco-reveal seco-reveal--2"
            aria-label="Policy details"
          >
            <div className={marketingTilesClass('seco-legal__tiles')}>
              {sections.map((section, index) => (
                <SpectrumTile
                  key={section.heading}
                  cue={section.cue ?? SECTION_CUES[index % SECTION_CUES.length]!}
                  label={String(index + 1).padStart(2, '0')}
                  title={section.heading}
                  body={section.body}
                  variant="hero"
                />
              ))}
            </div>
          </section>
        ) : null}

        {links && links.length > 0 ? (
          <section
            className="seco-marketing-panel--tiles seco-reveal seco-reveal--3"
            aria-label="Policies"
          >
            <div className={marketingTilesClass('seco-legal__tiles seco-legal__tiles--links')}>
              {links.map((link, index) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="seco-spectrum-tile seco-spectrum-tile--hero seco-legal__link-tile"
                  style={
                    {
                      '--cue': link.cue ?? SECTION_CUES[index % SECTION_CUES.length]!,
                    } as CSSProperties
                  }
                >
                  <p className="seco-spectrum-tile__title">{link.label}</p>
                </Link>
              ))}
            </div>
          </section>
        ) : null}

        {footer ? (
          <div className="seco-legal__footer seco-reveal seco-reveal--4">{footer}</div>
        ) : null}
      </div>
    </article>
  )
}
